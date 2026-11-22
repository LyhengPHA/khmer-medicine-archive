import collection from "../collection.config.js";
import localFont from "next/font/local";
import LanguageProvider from "../components/LanguageProvider.js";
import "./globals.css";
import "./entry-tree.css";

const khmerFont = localFont({
  src: "../public/fonts/NotoSansKhmer-Variable.ttf",
  variable: "--font-khmer",
  display: "swap",
  weight: "100 900",
});

export const metadata = {
  title: `${collection.name} — បណ្ណសាររស់ខ្មែរ / Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="km" className={khmerFont.variable}>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
