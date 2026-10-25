export default function FallingLeaves() {
  return (
    <div className="tree-falling-leaves" aria-hidden="true">
      {[18, 70, 40, 82, 55].map((left, index) => (
        <span
          className="tree-falling-leaf"
          key={left}
          style={{
            left: `${left}%`,
            "--fall-duration": `${18 + index * 2}s`,
            "--fall-delay": `${-index * 5}s`,
          }}
        />
      ))}
    </div>
  );
}
