import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FleetBrowser } from "@/components/fleet-browser";
import { Enter, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Fleet",
  description:
    "Rolls-Royce, Mercedes-Benz, BMW, Audi and Range Rover, plus Volvo and Mercedes-Benz coaches. All chauffeur-driven.",
};

export default function FleetPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-ink pt-[72px] text-cream">
          <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 md:pt-24 md:pb-20">
            <Enter>
              <h1 className="max-w-[720px] font-serif text-[clamp(40px,5.5vw,68px)] leading-[1.05] tracking-[-0.02em]">
                Our fleet
              </h1>
            </Enter>
            <Enter delay={0.12}>
              <p className="mt-5 max-w-[560px] text-lg text-[#cfcac0]">
                Rolls-Royce, Mercedes-Benz, BMW, Audi and Range Rover, plus Volvo and Mercedes-Benz coaches. Every
                vehicle comes with a trained chauffeur.
              </p>
            </Enter>
          </div>
        </section>

        <section className="py-[72px] md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <FleetBrowser />
          </div>
        </section>

        <section className="bg-sand py-[72px] md:py-24">
          <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-6">
            <div className="min-w-0 flex-[1_1_480px]">
              <h2 className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.1]">Need a car for a month or more?</h2>
              <p className="mt-3 max-w-[480px] text-[17px] text-[#45423c]">
                Long-term hire is flexible: choose the car, the chauffeur and the terms.
              </p>
            </div>
            <Button asChild variant="ink">
              <Link href="/contact?occasion=Long-term%20hire">Ask about long-term hire</Link>
            </Button>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
