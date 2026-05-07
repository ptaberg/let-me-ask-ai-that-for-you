import type { Metadata, Viewport } from "next";
import { siteUrl } from "./lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "ChatGPT",
    template: "%s · ChatGPT",
  },
  description: "Ask anything",
  applicationName: "ChatGPT",
  openGraph: {
    type: "website",
    siteName: "ChatGPT",
    title: "ChatGPT",
    description: "Ask anything",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "ChatGPT",
    description: "Ask anything",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#212121" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
