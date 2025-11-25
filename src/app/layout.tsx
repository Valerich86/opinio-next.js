import type { Metadata } from "next";
import "./globals.css";
import { bodyFont } from "./utilities/fonts";
import Header from "./components/header";

export const metadata: Metadata = {
  title: {
    template: '%s | Opinio',
    default: 'Opinio',
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
        <Header/>
        {children}
      </body>
    </html>
  );
}
