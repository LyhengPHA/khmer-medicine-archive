"use client";

import LanguageText from "./LanguageText.js";


import { useRef, useState } from "react";
import EntryCard from "./EntryCard.js";
import TreeArtwork from "./TreeArtwork.js";
import FallingLeaves from "./FallingLeaves.js";

export default function EntryTree({ entries, allEntries }) {
  const scene = useRef(null);
  const [paused, setPaused] = useState(false);

  return (
    <div className={`archive-tree${paused ? " archive-tree-paused" : ""}`}>
      <div className="archive-tree-heading">
        <div>
          <p className="eyebrow"><LanguageText text={"ចាក់ឫសក្នុងការចងចាំ / Rooted in memory"} /></p>
          <p className="archive-tree-intro"><LanguageText text={"ចំណេះដឹងលូតលាស់នៅទីនេះ។ / Knowledge grows here."} /></p>
        </div>
        <button
          type="button"
          className="tree-motion-button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          <LanguageText text={paused ? "បន្តចលនា / Resume motion" : "ផ្អាកចលនា / Pause motion"} />
        </button>
      </div>
      <div className="archive-tree-scene" ref={scene}>
        <TreeArtwork scene={scene} entries={entries} />
        <FallingLeaves />
        <div className="archive-tree-grid">
          {entries.map((entry, index) => (
            <div
              className="entry-hanger"
              key={entry.id || entry.slug}
              style={{
                "--swing-duration": `${6 + (index % 4) * 0.8}s`,
                "--swing-delay": `${-(index % 5) * 1.3}s`,
                "--swing-angle": `${index % 2 ? -0.9 : 0.9}deg`,
              }}
            >
              <span className="entry-string" aria-hidden="true" />
              <EntryCard entry={entry} recordNumber={allEntries.indexOf(entry) + 1} />
            </div>
          ))}
        </div>
        <p className="archive-tree-roots"><LanguageText text={"ឫសគល់របស់យើង។ រឿងរ៉ាវរបស់យើង។ / Our roots. Our stories."} /></p>
      </div>
    </div>
  );
}
