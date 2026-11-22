"use client";

import Image from "next/image";
import collection from "../collection.config.js";
import LanguageText from "./LanguageText.js";
import { useLanguage } from "./LanguageProvider.js";

export default function ArchiveAbout() {
  const { ui } = useLanguage();
  return (
    <section className="collection-story page-width" aria-labelledby="about-title">
      <div className="collection-story-art" aria-hidden="true">
        <Image
          src="/images/collection-still-life.webp"
          alt=""
          width={1448}
          height={1086}
          sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1168px) 44vw, 480px"
        />
      </div>
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
        <div className="collection-story-source">
          <div>
            <p className="collection-story-source-name">{ui(collection.sourceName)}</p>
            <p className="collection-story-source-context">{ui(collection.source)}</p>
          </div>
        </div>
        <a className="collection-story-link" href="#entries-title">
          <LanguageText text="រុករកកំណត់ត្រា / Explore the records" />
        </a>
      </div>
    </section>
  );
}
