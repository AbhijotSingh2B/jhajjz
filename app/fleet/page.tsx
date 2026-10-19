import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FleetBrowser } from "@/components/fleet-browser";
import { Enter, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbStructuredData } from "@/components/structured-data";
import { openGraphBase } from "@/lib/seo";

const fleetDescription =
  "Rent a Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, Jaguar or Range Rover with a chauffeur: luxury cars, wedding cars, vintage cars, limousines, SUVs, luxury MPVs like the Toyota Vellfire, Volvo coaches and mini vans. Chandigarh and pan-India.";

export const metadata: Metadata = {
  title: "Luxury Car, Wedding Car & Coach Fleet",
  description: fleetDescription,
  alternates: { canonical: "/fleet" },
  openGraph: {
    ...openGraphBase,
    url: "/fleet",
    title: "The Jhajj'z fleet: luxury cars, wedding cars and coaches",
    description: fleetDescription,
  },
};

export default function FleetPage() {
  return (
    <>
      <SiteHeader />
      <BreadcrumbStructuredData name="Fleet" path="/fleet" />
      <PageTransition>
        <main>
          <section className="pt-[72px]">
            <div className="mx-auto max-w-[1200px] px-6 pt-14 md:pt-20">
              <Enter>
                <h1 className="max-w-[720px] font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">
                  Our fleet
                </h1>
              </Enter>
              <Enter delay={0.12}>
                <p className="mt-5 max-w-[560px] text-[17px] text-body">
                  Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, Jaguar and Range Rover, plus Volvo and Mercedes-Benz coaches. Every
                  vehicle comes with a trained chauffeur, anywhere in India, and any of them can be booked for a wedding or event.
                </p>
              </Enter>
            </div>
          </section>

          <section className="pt-10 pb-[72px] md:pt-12 md:pb-24">
            <div className="mx-auto max-w-[1200px] px-6">
              <FleetBrowser />
            </div>
          </section>

          <section className="bg-sand py-[72px] md:py-24">
            <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-6">
              <div className="min-w-0 flex-[1_1_480px]">
                <h2 className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.1]">Need a car for a month or more?</h2>
                <p className="mt-3 max-w-[480px] text-[17px] text-body">
                  Long-term hire is flexible: choose the car, the chauffeur and the terms.
                </p>
              </div>
              <Button asChild variant="ink">
                <Link href="/contact?occasion=Long-term%20hire">Ask about long-term hire</Link>
              </Button>
            </Reveal>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
