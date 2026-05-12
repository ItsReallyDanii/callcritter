import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "CallCritter",
  description:
    "A scene-aware AI companion generator built with GPT-5.5, Image Gen, and browser canvas export.",
  openGraph: {
    title: "CallCritter",
    description:
      "Capture a scene, generate a tiny AI companion, place it on canvas, and export a share card.",
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
