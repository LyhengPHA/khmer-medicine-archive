import collection from "../collection.config.js";

export default function ArchivePage({ title, children }) {
  return (
    <div className="archive-home">
      <header className="site-header">
        <a className="archive-name" href="/">{collection.name}</a>
        <nav className="header-auth"><a href="/">Browse archive</a><a href="/contribute">Contribute</a></nav>
      </header>
      <main className="page-width contribution-page">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
