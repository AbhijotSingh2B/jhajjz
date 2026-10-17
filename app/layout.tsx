import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { heroImage } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jhajjz.in"),
  title: {
    default: "Jhajj'z | Luxury car & coach rental across India, since 1998",
    template: "%s | Jhajj'z",
  },
  description:
    "Chauffeur-driven luxury cars, wedding cars, SUVs and coaches across India since 1998. Head office in Chandigarh, serving pan-India.",
  openGraph: {
    siteName: "Jhajj'z",
    type: "website",
    locale: "en_IN",
    images: [heroImage],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
