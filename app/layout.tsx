import type { Metadata } from "next";
import "./globals.css";
import { bodyFont } from "./lib/fonts";
import Header from "./components/header";

export const metadata: Metadata = {
  title: {
    template: "%s | Opinio",
    default: "Opinio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.className} antialiased bg-primary overflow-x-hidden`}
      >
        <Header />
        <div className="w-screen h-screen fixed -z-20 overflow-hidden">
          <div className="w-[120%] h-full bg-secondary absolute -rotate-45 -z-10 translate-x-1/4"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
