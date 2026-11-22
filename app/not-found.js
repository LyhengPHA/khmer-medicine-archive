import LanguageText from "../components/LanguageText.js";
import ArchivePage from "../components/ArchivePage.js";

export default function NotFound() {
  return (
    <ArchivePage title="រកមិនឃើញទំព័រ / Page not found">
      <p><LanguageText text={"មិនមានទំព័រដែលអ្នកកំពុងស្វែងរកទេ។ / The page you are looking for does not exist."} /></p>
      <a href="/"><LanguageText text={"ត្រឡប់ទៅបណ្ណសារ / Return to the archive"} /></a>
    </ArchivePage>
  );
}
