// Run with: node --experimental-vm-modules tests/entryMutations.test.cjs
// Actual route/validation modules, with only Supabase replaced by an in-memory double.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { createContext, SourceTextModule, SyntheticModule } = require("node:vm");
const { webcrypto } = require("node:crypto");

const project = "https://archive.example";
const photoPrefix = `${project}/storage/v1/object/public/photos/`;
const owner = "authenticated-owner";
const id = "entry-id";
const oldPath = `${owner}/old.jpg`;

async function setup(options = {}) {
  const calls = [], logs = [];
  const client = {
    auth: { getUser: async () => {
      calls.push({ operation: "auth" });
      return { data: { user: options.loggedOut ? null : { id: owner } }, error: options.authError };
    } },
    from(table) {
      assert.equal(table, "entries");
      const call = { operation: "read", filters: {} };
      const query = {
        select(columns) { call.columns = columns; return query; },
        eq(key, value) { call.filters[key] = value; return query; },
        update(values) { call.operation = "update"; call.values = values; return query; },
        delete() { call.operation = "delete"; return query; },
        async maybeSingle() {
          calls.push(call);
          if (call.operation === "read") return { data: options.notOwner ? null : {
            id, owner, photo_url: options.oldUrl ?? photoPrefix + oldPath, photoAvailable: true,
          } };
          return { data: options.zeroRows ? null : { id }, error: options.writeError };
        },
      };
      return query;
    },
    storage: { from(bucket) {
      assert.equal(bucket, "photos");
      return {
        async upload(path, file, config) { calls.push({ operation: "upload", path, config }); return { error: options.uploadError }; },
        getPublicUrl(path) { return { data: { publicUrl: photoPrefix + path } }; },
        async remove(paths) { calls.push({ operation: "cleanup", paths: Array.from(paths) }); return { error: options.cleanupError }; },
      };
    } },
  };
  const context = createContext({
    URL, Response, crypto: webcrypto,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: project } },
    console: { error: (...args) => logs.push(args) },
  });
  const modules = new Map();
  function load(path) {
    path = resolve(path);
    if (!modules.has(path)) {
      const module = path.endsWith(resolve("lib/supabase/server.js"))
        ? new SyntheticModule(["createClient"], function () { this.setExport("createClient", async () => client); }, { context, identifier: path })
        : new SourceTextModule(readFileSync(path, "utf8"), { context, identifier: path });
      modules.set(path, module);
    }
    return modules.get(path);
  }
  const route = load("app/api/entries/[id]/route.js");
  await route.link((specifier, parent) => load(resolve(dirname(parent.identifier), specifier)));
  await route.evaluate();
  const validation = load("lib/contribution.js").namespace;
  function form() {
    const body = new FormData();
    for (const field of validation.fields) body.set(field.name, field.required ? "  ខ្មែរ  " : "  ");
    body.set("owner", "forged-owner");
    body.set("id", "forged-id");
    body.set("slug", "forged-slug");
    body.set("photo_url", "https://untrusted.example/photo.jpg");
    return body;
  }
  async function run(method = "PATCH", body = form(), origin = "https://site.example") {
    const request = new Request(`https://site.example/api/entries/${id}`, {
      method, headers: origin ? { origin } : {}, ...(method === "PATCH" ? { body } : {}),
    });
    return route.namespace[method](request, { params: Promise.resolve({ id }) });
  }
  return { calls, logs, run, form, validation, photos: load("lib/entryPhotos.js").namespace };
}

function addPhoto(body) {
  body.set("photo", new File([new Uint8Array([255, 216, 255])], "original.jpg", { type: "image/jpeg" }));
  return body;
}

for (const method of ["PATCH", "DELETE"]) {
  test(`${method}: origin, session and ownership gates precede every write`, async () => {
    for (const origin of ["https://attacker.example", null]) {
      const t = await setup();
      assert.equal((await t.run(method, t.form(), origin)).status, 403);
      assert.equal(t.calls.length, 0);
    }
    for (const [options, status] of [[{ loggedOut: true }, 401], [{ authError: new Error("private") }, 401], [{ notOwner: true }, 404]]) {
      const t = await setup(options);
      assert.equal((await t.run(method)).status, status);
      assert.ok(t.calls.some((call) => call.operation === "auth"));
      assert.ok(t.calls.every((call) => ["auth", "read"].includes(call.operation)));
    }
  });

  test(`${method}: mutation requires both id and authenticated owner and returns id`, async () => {
    const t = await setup();
    assert.equal((await t.run(method)).status, 200);
    for (const call of t.calls.filter((call) => ["read", "update", "delete"].includes(call.operation))) {
      assert.deepEqual(call.filters, { id, owner });
      if (call.operation !== "read") assert.equal(call.columns, "id");
    }
  });

  test(`${method}: zero rows and database errors are failures with safe cleanup`, async () => {
    for (const options of [{ zeroRows: true }, { writeError: new Error("private database detail") }]) {
      const t = await setup(options);
      const response = await t.run(method, addPhoto(t.form()));
      assert.equal(response.status, options.zeroRows ? 404 : 500);
      assert.ok(!(await response.text()).includes("private database detail"));
      assert.ok(t.logs.length);
      const cleanup = t.calls.filter((call) => call.operation === "cleanup");
      if (method === "PATCH") assert.deepEqual(cleanup[0].paths, [t.calls.find((call) => call.operation === "upload").path]);
      else assert.equal(cleanup.length, 0);
    }
  });
}

test("text-only edit trims Khmer, preserves photos and excludes immutable/unrecognized fields", async () => {
  const t = await setup();
  const body = t.form();
  body.set("ingredients", "  ខ្មែរ  \r\n\n ខ្មែរ ");
  body.set("photo", new File([], "", { type: "application/octet-stream" }));
  assert.equal((await t.run("PATCH", body)).status, 200);
  const update = t.calls.find((call) => call.operation === "update").values;
  assert.deepEqual(Object.keys(update).sort(), Array.from(t.validation.fields, (field) => field.name).sort());
  assert.equal(update.title, "ខ្មែរ");
  assert.equal(update.frequency, "");
  assert.deepEqual(Array.from(update.ingredients), ["ខ្មែរ", "ខ្មែរ"]);
  assert.ok(t.calls.every((call) => !["upload", "cleanup"].includes(call.operation)));
});

test("all text rules and optional replacement validation run before uploads", async () => {
  const t = await setup();
  for (const field of t.validation.fields) {
    const body = addPhoto(t.form());
    body.set(field.name, "x".repeat(field.max + 1));
    const response = await t.run("PATCH", body);
    assert.equal(response.status, 400);
    assert.ok((await response.json()).errors[field.name]);
    body.set(field.name, " \n ");
    assert.equal(Boolean(t.validation.validateContribution(body).errors[field.name]), !!field.required);
  }
  for (const file of [new File([], "empty.jpg", { type: "image/jpeg" }),
    new File(["invalid"], "fake.jpg", { type: "image/jpeg" }),
    new File([new Uint8Array(5242881)], "large.jpg", { type: "image/jpeg" })]) {
    const body = t.form(); body.set("photo", file);
    assert.equal((await t.run("PATCH", body)).status, 400);
  }
  assert.ok(t.calls.every((call) => ["auth", "read"].includes(call.operation)));
  assert.ok((await t.validation.validatePhoto(null)).error, "new contributions still require photos");
});

test("replacement uploads with a UUID, then updates, then removes only the old photo", async () => {
  const t = await setup();
  assert.equal((await t.run("PATCH", addPhoto(t.form()))).status, 200);
  assert.deepEqual(t.calls.map((call) => call.operation), ["auth", "read", "upload", "update", "cleanup"]);
  const upload = t.calls[2];
  assert.match(upload.path, /^authenticated-owner\/[0-9a-f-]{36}\.jpg$/);
  assert.equal(upload.config.upsert, false);
  assert.equal(t.calls[3].values.photo_url, photoPrefix + upload.path);
  assert.equal(t.calls[3].values.photoAvailable, true);
  assert.deepEqual(t.calls[4].paths, [oldPath]);
});

test("upload failure leaves the entry and old photo untouched", async () => {
  const t = await setup({ uploadError: new Error("upload rejected") });
  assert.equal((await t.run("PATCH", addPhoto(t.form()))).status, 500);
  assert.deepEqual(t.calls.map((call) => call.operation), ["auth", "read", "upload"]);
});

test("cleanup errors are logged without turning successful writes into failures", async () => {
  for (const method of ["PATCH", "DELETE"]) {
    const t = await setup({ cleanupError: new Error("cleanup rejected") });
    assert.equal((await t.run(method, addPhoto(t.form()))).status, 200);
    assert.ok(t.logs.some((args) => args[0] === "Entry photo cleanup failed"));
  }
});

test("cleanup accepts only this project's photos bucket and exact owner folder", async () => {
  const unsafe = ["/images/local.jpg", "local.jpg", "", photoPrefix + "another-owner/photo.jpg",
    photoPrefix + owner + "-other/photo.jpg", "https://elsewhere.example/storage/v1/object/public/photos/" + oldPath,
    `${project}/storage/v1/object/public/other/${oldPath}`, photoPrefix + owner + "/%2e%2e%2fother.jpg",
    photoPrefix + owner + "/%5cother.jpg", photoPrefix + owner + "/%00.jpg", photoPrefix + owner + "/%invalid"];
  const t = await setup();
  assert.equal(t.photos.ownedPhotoPath(photoPrefix + oldPath, owner), oldPath);
  for (const url of unsafe) {
    assert.equal(t.photos.ownedPhotoPath(url, owner), null);
    for (const method of ["PATCH", "DELETE"]) {
      const t = await setup({ oldUrl: url });
      assert.equal((await t.run(method, addPhoto(t.form()))).status, 200);
      assert.ok(!t.calls.some((call) => call.operation === "cleanup"));
    }
  }
});
