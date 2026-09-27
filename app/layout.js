import collection from "../collection.config.js";
import localFont from "next/font/local";
import "./globals.css";

const khmerFont = localFont({
  src: "../public/fonts/NotoSansKhmer-Variable.ttf",
  variable: "--font-khmer",
  display: "swap",
  weight: "100 900",
});

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={khmerFont.variable}>
      <body>{children}</body>
    </html>
  );
}
