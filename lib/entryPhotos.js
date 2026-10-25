// Never turn an unrelated URL, local image, or another owner's photo into a deletion.
export function ownedPhotoPath(photoUrl, owner, projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL) {
  if (!photoUrl || !owner || !projectUrl) return null;
  try {
    const url = new URL(photoUrl);
    const project = new URL(projectUrl);
    const prefix = `${project.pathname.replace(/\/$/, "")}/storage/v1/object/public/photos/`;
    if (url.origin !== project.origin || url.username || url.password || !url.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    const parts = path.split("/");
    if (parts.length < 2 || parts[0] !== owner || parts.some((part) => !part || part === "." || part === "..")
      || /[\\\x00-\x1f\x7f]/.test(path)) return null;
    return path;
  } catch { return null; }
}

export async function removePhoto(supabase, path) {
  if (!path) return;
  try {
    const { error } = await supabase.storage.from("photos").remove([path]);
    if (error) throw error;
  } catch (error) { console.error("Entry photo cleanup failed", error); }
}
