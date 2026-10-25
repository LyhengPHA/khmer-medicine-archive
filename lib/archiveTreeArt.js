// Decoration only: deterministic leaves keep the same arrangement after resizing.
function random(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function branch(x0, y0, x1, y1, width) {
  return {
    path: `M ${x0} ${y0} C ${x0 + (x1 - x0) * 0.16} ${y1 + (y0 - y1) * 0.24}, ${x1 - (x1 - x0) * 0.25} ${y1 + 18}, ${x1} ${y1}`,
    width,
  };
}

export function getTreeArt({ width, height, anchors }) {
  const mobile = width <= 760;
  const trunkX = mobile ? 22 : width / 2;
  const ground = height - 55;
  const trunkWidth = mobile ? 12 : 24;
  const trunk = `M ${trunkX - trunkWidth} ${ground} C ${trunkX - 3} ${ground - 100}, ${trunkX - 12} 300, ${trunkX - 4} 70 C ${trunkX + 14} 260, ${trunkX + 5} ${ground - 120}, ${trunkX + trunkWidth + 5} ${ground} Q ${trunkX} ${ground - 12} ${trunkX - trunkWidth} ${ground}`;
  const branches = [
    branch(trunkX, ground - 40, Math.max(4, trunkX - 65), ground + 7, 9),
    branch(trunkX, ground - 35, trunkX + 75, ground + 12, 8),
    branch(trunkX, 285, width * 0.28, 100, 10),
    branch(trunkX, 320, width * 0.75, 108, 12),
    branch(trunkX, 210, width * 0.50, 65, 7),
  ];
  const clusters = [
    [width * 0.21, 138, width * 0.18, 65, 90],
    [width * 0.42, 92, width * 0.20, 67, 105],
    [width * 0.66, 100, width * 0.20, 70, 105],
    [width * 0.82, 162, width * 0.15, 60, 80],
    [width * 0.50, 171, width * 0.25, 53, 90],
  ];
  anchors.forEach(({ x, y }, index) => {
    branches.push(branch(trunkX, y + 105, x, y, mobile ? 6 : 9));
    const twigX = mobile ? trunkX + 25 : trunkX + (x - trunkX) * 0.55;
    const twigY = y + 15;
    branches.push(branch(trunkX, y + 90, twigX, twigY, 3));
    clusters.push([twigX, twigY - 5, mobile ? 22 : 38, 25, 25]);
  });
  const leaves = clusters.flatMap(([x, y, rx, ry, count], cluster) =>
    Array.from({ length: count }, (_, index) => {
      const seed = index + cluster * 500;
      const angle = random(seed) * Math.PI * 2;
      const radius = Math.sqrt(random(seed + 17));
      return {
        x: x + Math.cos(angle) * radius * rx,
        y: y + Math.sin(angle) * radius * ry,
        size: 5 + random(seed + 33) * 10,
        angle: random(seed + 71) * 180,
      };
    })
  );
  return { trunkX, ground, groundWidth: mobile ? 85 : width * 0.22, trunk, branches, leaves };
}
