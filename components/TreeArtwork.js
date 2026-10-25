"use client";

import { useEffect, useState } from "react";
import { getTreeArt } from "../lib/archiveTreeArt.js";

export default function TreeArtwork({ scene, entries }) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const element = scene.current;
    let active = true;
    function measure() {
      if (!active) return;
      setLayout({
        width: element.clientWidth,
        height: element.clientHeight,
        anchors: Array.from(element.querySelectorAll(".entry-hanger"), (card) => ({
          x: card.offsetLeft + card.offsetWidth / 2,
          y: card.offsetTop,
        })),
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll(".entry-hanger").forEach((card) => observer.observe(card));
    document.fonts.ready.then(measure);
    measure();
    return () => { active = false; observer.disconnect(); };
  }, [scene, entries]);

  if (!layout) return null;
  const art = getTreeArt(layout);

  return (
    <svg className="archive-tree-art" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" focusable="false">
      <ellipse className="tree-ground" cx={art.trunkX} cy={art.ground + 8} rx={art.groundWidth} ry="14" />
      <g className="tree-wood">
        <path d={art.trunk} />
        {art.branches.map((branch, index) => (
          <path d={branch.path} strokeWidth={branch.width} key={index} />
        ))}
      </g>
      <g className="tree-crown">
        {art.leaves.map((leaf, index) => (
          <path
            d={`M ${-leaf.size} 0 Q 0 ${-leaf.size * 0.75} ${leaf.size} 0 Q 0 ${leaf.size * 0.75} ${-leaf.size} 0`}
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}
            className={`tree-leaf tree-leaf-${index % 4}`}
            key={index}
          />
        ))}
      </g>
    </svg>
  );
}
