import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { heroImage } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jhajjz.in"),
  title: {
    default: "Jhajj'z | Luxury car & coach rental in Chandigarh, since 1998",
    template: "%s | Jhajj'z",
  },
  description:
    "Chauffeur-driven luxury cars, wedding cars, SUVs and coaches. Based in Mohali, serving 14 cities across India since 1998.",
  openGraph: {
    siteName: "Jhajj'z",
    type: "website",
    images: [heroImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
