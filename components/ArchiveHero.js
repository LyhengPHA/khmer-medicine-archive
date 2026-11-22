"use client";

import LanguageText from "./LanguageText.js";


import Image from "next/image";
import collection from "../collection.config.js";
import { useLanguage } from "./LanguageProvider.js";

export default function ArchiveHero() {
  const { ui } = useLanguage();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image
        className="hero-image"
        src="/images/khmer-medicine-forest-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content page-width">
        <div className="hero-copy">
          <p className="eyebrow"><LanguageText text={"រុក្ខជាតិ វិធីរៀបចំ និងកំណត់ត្រា / Plants, preparations, and records"} /></p>
          <h1 id="hero-title">{ui(collection.name)}</h1>
          <p className="hero-description">{ui(collection.description)}</p>
          <a className="browse-link" href="#entries-title"><LanguageText text={"រុករកបណ្ណសារ / Browse the archive"} /><span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-caption"><LanguageText text={"រូបភាពតំណាង · បង្កើតដោយ AI / Illustrative scene · AI-generated"} /></p>
      </div>
    </section>
  );
}
