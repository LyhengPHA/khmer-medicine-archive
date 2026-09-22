import collection from "../collection.config.js";

export default function AuthLeafPanel({ title, children }) {
  return (
    <main className="auth-page">
      <section className="auth-leaf" aria-labelledby="auth-heading">
        <svg
          className="auth-leaf-art"
          viewBox="-20 0 760 900"
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
          <g transform="rotate(35 360 450) translate(0 -54) scale(1 1.12)">
          <path
            d="M310 838 Q292 864 270 882"
            fill="none"
            stroke="#a6b58b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M430 16 C340 95 40 92 20 350 C0 590 94 741 310 838 C382 772 665 770 700 510 C733 272 548 132 430 16Z"
            fill="url(#leaf-paper)"
            stroke="#a6b58b"
            strokeWidth="1.5"
          />
          <g fill="none" stroke="#61794b" strokeLinecap="round">
            <path d="M310 838 C454 618 271 308 430 16" strokeWidth="2" opacity="0.18" />
            <g strokeWidth="1.2" opacity="0.12">
              <path d="M362 705 Q201 683 79 585 M370 566 Q178 533 37 408" />
              <path d="M360 426 Q189 384 70 266 M360 289 Q235 255 171 165" />
              <path d="M378 160 Q314 142 288 108" />
              <path d="M362 705 Q521 655 648 567 M370 566 Q558 499 685 390" />
              <path d="M360 426 Q539 366 623 262 M360 289 Q477 242 532 155" />
              <path d="M378 160 Q434 129 454 76" />
            </g>
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
