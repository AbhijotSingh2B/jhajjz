import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { BusinessStructuredData } from "@/components/structured-data";
import { heroImage, siteName, siteUrl } from "@/lib/site";
import { openGraphBase } from "@/lib/seo";

const description =
  "Chauffeur-driven luxury car, wedding car and coach rental since 1998. Rolls-Royce, Mercedes-Benz, BMW, Audi, Range Rover and Volvo coaches. Head office in Chandigarh, serving pan-India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jhajj'z | Luxury Car, Wedding Car & Coach Rental in Chandigarh, Pan-India",
    template: "%s | Jhajj'z",
  },
  description,
  applicationName: siteName,
  keywords: [
    "luxury car rental Chandigarh",
    "wedding car rental Chandigarh",
    "luxury car rental Mohali",
    "Rolls-Royce rental",
    "wedding car hire",
    "vintage car for wedding",
    "limousine rental",
    "luxury coach hire",
    "Volvo coach rental",
    "chauffeur driven car",
    "VIP car rental India",
    "Jhajjz",
  ],
  alternates: { canonical: "/" },
  category: "travel",
  formatDetection: { telephone: false },
  openGraph: {
    ...openGraphBase,
    url: "/",
    title: "Jhajj'z | Luxury car, wedding car & coach rental since 1998",
    description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@Jhajjztransport",
    title: "Jhajj'z | Luxury car, wedding car & coach rental since 1998",
    description,
    images: [heroImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#151514",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        <BusinessStructuredData />
        {/* iPhone Safari ignores overflow on html/body when you drag sideways, so the clip lives on a plain
            wrapper. `clip` (not `hidden`) keeps the fixed header and bottom bar pinned to the screen. */}
        <div className="overflow-x-clip">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
