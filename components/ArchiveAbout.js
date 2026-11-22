"use client";

import collection from "../collection.config.js";
import LanguageText from "./LanguageText.js";
import { useLanguage } from "./LanguageProvider.js";

export default function ArchiveAbout() {
  const { ui } = useLanguage();
  return (
    <section className="collection-story page-width" aria-labelledby="about-title">
      <div className="collection-story-copy">
        <p className="collection-story-eyebrow">
          <LanguageText text="ចំណេះដឹងនៅពីក្រោយបណ្ដុំ / The knowledge behind the collection" />
        </p>
        <h2 id="about-title">
          <span><LanguageText text="រៀននៅតាកែវ។ / Learned in Takeo." /></span>
          <span><LanguageText text="រក្សាទុកសម្រាប់ថ្ងៃស្អែក។ / Preserved for tomorrow." /></span>
        </h2>
        <p className="collection-story-description">
          <LanguageText text="បណ្ដុំនេះកត់ត្រាចំណេះដឹងឱសថបុរាណខ្មែរ ឈ្មោះរុក្ខជាតិដើម វិធីរៀបចំ និងទីកន្លែងដែលទាក់ទងនឹងកំណត់ត្រានីមួយៗ។ / This collection records Khmer traditional knowledge, original plant names, preparation methods, and the places connected to each record." />
        </p>
        <a className="collection-story-link" href="#entries-title">
          <LanguageText text="រុករកកំណត់ត្រា / Explore the records" />
        </a>
      </div>
      <aside className="collection-story-source-panel" aria-label={ui("ប្រភពចំណេះដឹង / Knowledge source")}>
        <p className="collection-story-source-name">{ui(collection.sourceDetails.name)}</p>
        <dl className="collection-story-timeline">
          <div>
            <dt><LanguageText text="ទីកន្លែងរៀនចំណេះដឹង៖ / Knowledge learned in:" /></dt>
            <dd>{ui(collection.sourceDetails.learnedIn)}</dd>
          </div>
          <div>
            <dt><LanguageText text="ទីកន្លែងរស់នៅបច្ចុប្បន្ន៖ / Now living in:" /></dt>
            <dd>{ui(collection.sourceDetails.nowLivingIn)}</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
