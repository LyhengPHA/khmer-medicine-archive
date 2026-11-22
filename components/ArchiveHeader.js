"use client";

import collection from "../collection.config.js";
import ReviewerLink from "./ReviewerLink.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { useLanguage } from "./LanguageProvider.js";

export default function ArchiveHeader({ user, isReviewer, home = false, onLogout }) {
  const { ui, pick } = useLanguage();
  return (
    <header className="site-header">
      <a className="archive-name" href={home ? "#top" : "/"} aria-label={pick("ទំព័រដើមនៃបណ្ណសារ", "Archive home")}>
        {home && <span className="archive-mark">KTM</span>}
        <span>{ui(collection.name)}</span>
      </a>
      <div className="header-right">
        <nav className="header-auth" aria-label={pick("គណនី និងការរុករក", "Account and archive navigation")}>
          {!home && <a href="/">{pick("រុករកបណ្ណសារ", "Browse archive")}</a>}
          <a className="header-auth-link" href="/contribute">{pick("ចូលរួមចំណែក", "Contribute")}</a>
          {isReviewer === undefined ? <ReviewerLink user={user} /> : isReviewer && <a href="/review">{pick("ពិនិត្យកំណត់ត្រា", "Review entries")}</a>}
          {user ? <>
            <a className="header-auth-link" href="/my-entries">{pick("កំណត់ត្រារបស់ខ្ញុំ", "My entries")}</a>
            {home && <span className="header-auth-email">{user.email}</span>}
            {onLogout && <button className="header-auth-button" onClick={onLogout}>{pick("ចាកចេញ", "Log out")}</button>}
          </> : home && <>
            <a className="header-auth-link" href="/login">{pick("ចូលគណនី", "Log in")}</a>
            <a className="header-auth-link" href="/signup">{pick("ចុះឈ្មោះ", "Sign up")}</a>
          </>}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
