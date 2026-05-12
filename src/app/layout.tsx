import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallCritter",
  description: "A scene-aware AI companion generator scaffold for camera and demo scenes."
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
