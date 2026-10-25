export default function EntryPhoto({ entry }) {
  const photo = typeof entry.photo_url === "string" ? entry.photo_url.trim() : "";
  // Keep absolute URLs and root-relative paths intact; bare names live in /images/.
  const src = /^https?:\/\//i.test(photo) || (photo.startsWith("/") && !photo.startsWith("//"))
    ? photo : photo && !photo.includes(":") && !photo.startsWith("//") ? `/${photo.startsWith("images/") ? "" : "images/"}${photo}` : "";
  if (!src) return null;
  return <img className="entry-photo" src={src} alt={`Photo for ${entry.title}`} loading="lazy" />;
}
