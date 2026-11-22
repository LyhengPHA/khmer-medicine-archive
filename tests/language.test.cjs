// Run with: node --experimental-vm-modules --test tests/*.test.cjs
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { createContext, SourceTextModule, SyntheticModule } = require("node:vm");
const React = require("react");
const jsxRuntime = require("react/jsx-runtime");
const { renderToStaticMarkup } = require("react-dom/server");
const babel = require("next/dist/compiled/babel/core");

async function loadModules() {
  const context = createContext({ console });
  const modules = new Map();
  function load(filename) {
    const id = ["react", "react/jsx-runtime"].includes(filename) ? filename : resolve(filename);
    if (!modules.has(id)) {
      let module;
      if (id === "react" || id === "react/jsx-runtime") {
        const exports = id === "react" ? React : jsxRuntime;
        module = new SyntheticModule(Object.keys(exports), function () {
          for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
        }, { context, identifier: id });
      } else {
        const code = babel.transformSync(readFileSync(id, "utf8"), {
          filename: id, babelrc: false, configFile: false,
          presets: [[require("next/dist/compiled/babel/preset-react"), { runtime: "automatic" }]],
        }).code;
        module = new SourceTextModule(code, { context, identifier: id });
      }
      modules.set(id, module);
    }
    return modules.get(id);
  }
  const module = new SourceTextModule(`
    export * from "./lib/language.js";
    export { default as Provider } from "./components/LanguageProvider.js";
    export { default as Text } from "./components/LanguageText.js";
    export { default as Detail } from "./components/BilingualDetail.js";
    export { default as Card } from "./components/EntryCard.js";
    export { default as Field } from "./components/ContributionField.js";
  `, { context, identifier: resolve("language-test-root.js") });
  await module.link((specifier, parent) => load(specifier.startsWith(".") ? resolve(dirname(parent.identifier), specifier) : specifier));
  await module.evaluate();
  return module.namespace;
}

const ready = loadModules();
async function render(component, props, language) {
  const api = await ready;
  return renderToStaticMarkup(React.createElement(api.Provider, { initialLanguage: language }, React.createElement(api[component], props)));
}

test("interface copy selects a single language, including labels with several slashes", async () => {
  const { localizeUiText: ui } = await ready;
  assert.equal(ui("ចូលគណនី / Log in", "km"), "ចូលគណនី");
  assert.equal(ui("ចូលគណនី / Log in", "en"), "Log in");
  assert.equal(ui("ទីកន្លែង / តំបន់ / Place / Region", "km"), "ទីកន្លែង / តំបន់");
  assert.equal(ui("ទីកន្លែង / តំបន់ / Place / Region", "en"), "Place / Region");
  assert.equal(ui("1 ក្នុងចំណោម 8 កំណត់ត្រា / 1 of 8 entries", "en"), "1 of 8 entries");
  assert.equal(ui(undefined, "km"), undefined);
});

test("only valid saved language choices are accepted", async () => {
  const { isLanguage } = await ready;
  assert.equal(isLanguage("km"), true);
  assert.equal(isLanguage("en"), true);
  for (const value of [null, "", "fr", "EN", "undefined"]) assert.equal(isLanguage(value), false);
});

test("Khmer-only descriptions are never presented as English translations", async () => {
  const { recordDescription } = await ready;
  const description = "កំណត់ត្រាចំណេះដឹងបុរាណ";
  assert.equal(recordDescription({ description }).source, description);
  assert.equal(recordDescription({ description }).english, null);
});

test("language switching selects existing translations without changing original records", async () => {
  const { selectRecordText } = await ready;
  const source = "ជម្ងឺក្រពះ";
  const english = "Stomach-related remedy";
  assert.equal(selectRecordText(source, english, "km").text, source);
  assert.equal(selectRecordText(source, english, "en").text, english);
  const missing = selectRecordText(source, null, "en");
  assert.equal(missing.text, source);
  assert.equal(missing.pending, true);
  assert.equal(selectRecordText("Lyheng PHA", null, "en").pending, false);
});

test("rendered interface text contains only the selected translation", async () => {
  assert.equal(await render("Text", { text: "ចូលគណនី / Log in" }, "km"), "ចូលគណនី");
  assert.equal(await render("Text", { text: "ចូលគណនី / Log in" }, "en"), "Log in");
});

test("partial translations retain every original preparation step", async () => {
  const props = { khmer: ["ដាំទឹកមួយកំសៀវអោយពុះ។", "បង់ថ្នាំចូល និងដាំរយៈពេល ៣០ នាទី។"], english: ["Bring a kettle of water to a boil."], field: "preparation" };
  const english = await render("Detail", props, "en");
  assert.match(english, /Bring a kettle of water to a boil/);
  assert.match(english, /បង់ថ្នាំចូល/);
  assert.match(english, /English translation pending/);
  assert.doesNotMatch(english, /English plant name/);
  assert.equal((english.match(/<li>/g) || []).length, 2);
  const khmer = await render("Detail", props, "km");
  assert.match(khmer, /ដាំទឹកមួយកំសៀវ/);
  assert.doesNotMatch(khmer, /Bring a kettle/);
});

test("missing plant translations retain original names with an honest notice", async () => {
  const html = await render("Detail", { khmer: ["សំបកឃ្មៀរ"], field: "ingredients" }, "en");
  assert.match(html, /សំបកឃ្មៀរ/);
  assert.match(html, /English plant name pending confirmation/);
});

test("entry cards use the selected title and preview", async () => {
  const entry = { title: "ជម្ងឺក្រពះ", englishTitle: "Stomach-related remedy", khmerDescription: "កំណត់ត្រាចំណេះដឹងបុរាណ", description: "An archive record of traditional knowledge.", ingredients: [] };
  const english = await render("Card", { entry, recordNumber: 1 }, "en");
  assert.match(english, /Stomach-related remedy/);
  assert.match(english, /An archive record of traditional knowledge/);
  assert.doesNotMatch(english, /ជម្ងឺក្រពះ/);
  const khmer = await render("Card", { entry, recordNumber: 1 }, "km");
  assert.match(khmer, /ជម្ងឺក្រពះ/);
  assert.doesNotMatch(khmer, /Stomach-related remedy/);
});

test("localized form labels and validation preserve entered content and field names", async () => {
  const props = { field: { name: "title", label: "ចំណងជើង / Title", required: true, max: 150 }, value: "ជម្ងឺក្រពះ", error: "ត្រូវបំពេញប្រអប់នេះ។ / This field is required." };
  const english = await render("Field", props, "en");
  assert.match(english, /Title/);
  assert.match(english, /This field is required/);
  assert.match(english, /name="title"/);
  assert.match(english, /value="ជម្ងឺក្រពះ"/);
  assert.doesNotMatch(english, /ចំណងជើង/);
});

test("mismatched translation types never hide the original scalar text", async () => {
  const original = "កំណត់ត្រាចំណេះដឹងបុរាណ";
  for (const language of ["km", "en"]) {
    const html = await render("Detail", { khmer: original, english: ["An archive record."] }, language);
    assert.match(html, /កំណត់ត្រាចំណេះដឹងបុរាណ/);
    assert.doesNotMatch(html, /An archive record/);
  }
});

test("empty optional fields do not leave empty headings on entry cards", async () => {
  const entry = { title: "ជម្ងឺក្រពះ", englishTitle: "Stomach-related remedy", ingredients: ["សំបកឃ្មៀរ"], frequency: "  ", duration: null, english: { ingredientAmount: "" } };
  const html = await render("Card", { entry, recordNumber: 1 }, "en");
  assert.match(html, /Ingredients/);
  assert.match(html, /សំបកឃ្មៀរ/);
  assert.doesNotMatch(html, /<h4>Frequency<\/h4>/);
  assert.doesNotMatch(html, /<h4>Duration<\/h4>/);
  assert.doesNotMatch(html, /<h4>Amount<\/h4>/);
  assert.doesNotMatch(html, /<dt>Learned from<\/dt>/);
});

test("blank optional Khmer description falls back to the actual description", async () => {
  const { recordDescription } = await ready;
  assert.equal(recordDescription({ khmerDescription: "  ", description: "កំណត់ត្រាចំណេះដឹងបុរាណ" }).source, "កំណត់ត្រាចំណេះដឹងបុរាណ");
});
