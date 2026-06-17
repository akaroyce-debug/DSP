import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Sora — geometric, refined display face with beautiful numerals.
// Used for headlines, the wordmark, and prices.
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roycedsp.com"),
  title: {
    default: "RoyceDSP — The Future of Refined Audio Intelligence",
    template: "%s — RoyceDSP",
  },
  description:
    "RoyceDSP crafts premium digital signal processing tools and intelligent plugins for the world's most discerning producers and sound designers.",
  keywords: [
    "DSP",
    "audio plugins",
    "spatial audio",
    "sound design",
    "mastering",
    "luxury audio software",
  ],
  openGraph: {
    title: "RoyceDSP — The Future of Refined Audio Intelligence",
    description:
      "Premium digital signal processing tools and intelligent plugins for discerning producers.",
    type: "website",
    siteName: "RoyceDSP",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
