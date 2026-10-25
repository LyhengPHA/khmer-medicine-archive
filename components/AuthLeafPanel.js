import collection from "../collection.config.js";

export default function AuthLeafPanel({ title, children }) {
  return (
    <main className="auth-page">
      <section className="auth-leaf" aria-labelledby="auth-heading">
        <svg
          className="auth-leaf-art"
          viewBox="0 0 800 700"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="leaf-paper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eef0d8" />
              <stop offset="55%" stopColor="#e0e6c4" />
              <stop offset="100%" stopColor="#c0cea3" />
            </linearGradient>
          </defs>
          <path d="M95 650 Q76 670 52 682" fill="none" stroke="#a6b58b" strokeWidth="7" strokeLinecap="round" />
          <path
            d="M780 20 C690 128 446 -30 228 55 C62 116 4 294 40 452 C65 552 118 599 95 650 C258 635 509 735 667 604 C806 488 817 214 780 20Z"
            fill="url(#leaf-paper)"
            stroke="#a6b58b"
            strokeWidth="1.5"
          />
          <g fill="none" stroke="#61794b" strokeLinecap="round">
            <path d="M95 650 C260 510 526 299 780 20" strokeWidth="2" opacity="0.18" />
            <g strokeWidth="1.2" opacity="0.12">
              <path d="M200 562 Q100 453 65 343 M318 461 Q165 342 152 135" />
              <path d="M438 352 Q303 235 327 55 M562 229 Q452 135 492 73" />
              <path d="M200 562 Q330 646 468 652 M318 461 Q497 588 639 569" />
              <path d="M438 352 Q624 455 750 398 M562 229 Q693 297 778 218" />
            </g>
          </g>
        </svg>
        <div className="auth-card">
          <p className="eyebrow">
            <a href="/">{collection.name}</a>
          </p>
          <h1 id="auth-heading">{title}</h1>
          {children}
        </div>
      </section>
    </main>
  );
}
