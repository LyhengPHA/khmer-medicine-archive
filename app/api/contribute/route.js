import { createClient } from "../../../lib/supabase/server.js";
import { validateContribution, validatePhoto } from "../../../lib/contribution.js";

export async function POST(request) {
  let supabase;
  let uploadedPath;
  let saved = false;
  let stage = "validation";
  try {
    // Cookie-authenticated writes must originate from this site.
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return Response.json({ error: "សូមផ្ទុកទំព័រឡើងវិញ ហើយព្យាយាមម្តងទៀត។ / Refresh the page and try again." }, { status: 403 });
    }
    supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) console.error("Contribution authentication failed", authError);
    if (!user || authError) return Response.json({ error: "សូមចូលគណនីម្តងទៀតដើម្បីបញ្ចូលកំណត់ត្រា។ / Log in again to contribute." }, { status: 401 });
    const form = await request.formData();
    const { values: v, errors } = validateContribution(form);
    const photo = form.get("photo");
    const { extension, error: photoError } = await validatePhoto(photo);
    if (photoError) errors.photo = photoError;
    if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

    // Older schemas may not have this optional flag. Check before any upload.
    const { error: columnError } = await supabase.from("entries").select("photoAvailable").limit(0);
    if (columnError && columnError.code !== "42703" && columnError.code !== "PGRST204") throw columnError;
    const hasPhotoAvailable = !columnError;
    stage = "upload";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("photos").upload(path, photo, { contentType: photo.type, upsert: false });
    if (uploadError) throw uploadError;
    uploadedPath = path;
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
    stage = "insert";
    // A UUID-only slug works for titles in any language without altering Khmer text.
    const entry = {
      slug: crypto.randomUUID(), owner: user.id,
      title: v.title, description: v.description,
      ingredients: v.ingredients, preparation: v.preparation, usage: v.usage,
      precautions: v.precautions, contributor: v.contributor, place: v.place,
      frequency: v.frequency, duration: v.duration, englishTitle: v.englishTitle,
      khmerDescription: v.khmerDescription, learnedFrom: v.learnedFrom, story: v.story,
      photo_url: publicUrl,
    };
    if (hasPhotoAvailable) entry.photoAvailable = true;
    const { data, error } = await supabase.from("entries").insert(entry).select("id").single();
    if (error) throw error;
    saved = true;
    return Response.json({ id: data.id }, { status: 201 });
  } catch (error) {
    console.error(`Contribution ${stage} failed`, error);
    return Response.json({ error: stage === "upload"
      ? "បង្ហោះរូបថតមិនបាន។ សូមព្យាយាមម្តងទៀត។ / Photo upload failed. Try again."
      : "មិនអាចរក្សាទុកកំណត់ត្រាបាន។ សូមព្យាយាមម្តងទៀត។ / Could not save the entry. Try again." }, { status: 500 });
  } finally {
    if (uploadedPath && !saved) {
      try {
        const { error } = await supabase.storage.from("photos").remove([uploadedPath]);
        if (error) throw error;
      } catch (error) { console.error("Contribution photo cleanup failed", error); }
    }
  }
}
