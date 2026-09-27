import Image from "next/image";
import collection from "../collection.config.js";

export default function ArchiveHero() {
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
          <p className="eyebrow">Plants, preparations, and records</p>
          <h1 id="hero-title">{collection.name}</h1>
          <p className="hero-description">{collection.description}</p>
          <a className="browse-link" href="#entries-title">
            Browse the archive <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-caption">Illustrative scene · AI-generated</p>
      </div>
    </section>
  );
}
