import { createClient } from "../../../../lib/supabase/server.js";
import { validateContribution, validatePhoto } from "../../../../lib/contribution.js";
import { ownedPhotoPath, removePhoto } from "../../../../lib/entryPhotos.js";

const unavailable = () => Response.json({ error: "Entry unavailable or permission denied." }, { status: 404 });

async function authorize(request, params) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return { response: Response.json({ error: "Refresh the page and try again." }, { status: 403 }) };
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error("Entry authentication failed", error);
  if (error || !user) return { response: Response.json({ error: "Please log in again." }, { status: 401 }) };
  const { id } = await params;
  const { data: entry, error: readError } = await supabase.from("entries").select("*")
    .eq("id", id).eq("owner", user.id).maybeSingle();
  if (readError) throw readError;
  if (!entry) return { response: unavailable() };
  return { supabase, user, id, entry };
}

export async function PATCH(request, { params }) {
  let supabase;
  let uploadedPath;
  let saved = false;
  try {
    const auth = await authorize(request, params);
    if (auth.response) return auth.response;
    const { user, id, entry } = auth;
    supabase = auth.supabase;
    const form = await request.formData();
    const { values: v, errors } = validateContribution(form);
    const photo = form.get("photo");
    const { extension, error: photoError } = await validatePhoto(photo, false);
    if (photoError) errors.photo = photoError;
    if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

    // Only contributor-editable fields belong here; owner, slug and timestamps stay unchanged.
    const update = {
      title: v.title, description: v.description,
      ingredients: v.ingredients, preparation: v.preparation, usage: v.usage,
      precautions: v.precautions, contributor: v.contributor, place: v.place,
      frequency: v.frequency, duration: v.duration, englishTitle: v.englishTitle,
      khmerDescription: v.khmerDescription, learnedFrom: v.learnedFrom, story: v.story,
    };
    if (extension) {
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("photos").upload(path, photo, { contentType: photo.type, upsert: false });
      if (error) throw error;
      uploadedPath = path;
      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
      update.photo_url = publicUrl;
      if (Object.hasOwn(entry, "photoAvailable")) update.photoAvailable = true;
    }
    const { data, error } = await supabase.from("entries").update(update)
      .eq("id", id).eq("owner", user.id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Entry update returned no row", { id });
      return unavailable();
    }
    saved = true;
    if (uploadedPath) await removePhoto(supabase, ownedPhotoPath(entry.photo_url, user.id));
    return Response.json({ id: data.id });
  } catch (error) {
    console.error("Entry update failed", error);
    return Response.json({ error: "Could not save your changes. Please try again." }, { status: 500 });
  } finally {
    if (uploadedPath && !saved) await removePhoto(supabase, uploadedPath);
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await authorize(request, params);
    if (auth.response) return auth.response;
    const { supabase, user, id, entry } = auth;
    const { data, error } = await supabase.from("entries").delete()
      .eq("id", id).eq("owner", user.id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Entry deletion returned no row", { id });
      return unavailable();
    }
    await removePhoto(supabase, ownedPhotoPath(entry.photo_url, user.id));
    return Response.json({ id: data.id });
  } catch (error) {
    console.error("Entry deletion failed", error);
    return Response.json({ error: "Could not delete your entry. Please try again." }, { status: 500 });
  }
}
