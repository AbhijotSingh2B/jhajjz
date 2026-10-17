import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuoteForm } from "@/components/quote-form";
import { Enter } from "@/components/motion";
import { contact } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbStructuredData } from "@/components/structured-data";
import { openGraphBase, previewImage } from "@/lib/seo";
import { ContactDialog, type ContactChannel } from "@/components/contact-dialog";

const contactDescription =
  "Get a quote for a luxury car, wedding car or coach with chauffeur. Tell us the date, city and occasion, or call +91 98036 00001. Chandigarh and pan-India.";

export const metadata: Metadata = {
  title: "Get a Quote for Luxury & Wedding Car Rental",
  description: contactDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    ...openGraphBase,
    url: "/contact",
    title: "Get a quote from Jhajj'z",
    description: contactDescription,
    images: [previewImage("contact", "Get a quote from Jhajj'z")],
  },
};

export default function ContactPage() {
  // Each row opens the matching contact popup (both numbers, copy buttons, other options).
  const rows: { label: string; value: string; channel: ContactChannel }[] = [
    ...contact.phones.map((p) => ({ label: "Call", value: p.label, channel: "call" as const })),
    { label: "WhatsApp", value: "Message us", channel: "whatsapp" },
    { label: "Email", value: contact.email, channel: "email" },
  ];

  return (
    <>
      <SiteHeader />
      <BreadcrumbStructuredData name="Get a quote" path="/contact" />
      <PageTransition>
        <main className="pt-[72px]">
          {/* Phones: intro, form, then contact details. Desktop: intro + details left, form right. */}
          <section className="mx-auto grid max-w-[1200px] gap-y-12 px-6 py-[72px] md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
            <Enter>
              <h1 className="font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">Get a quote</h1>
              <p className="mt-5 max-w-[420px] text-[17px] text-muted">
                Share a few details and we&apos;ll recommend the right car and send a price, for anywhere in India. For
                anything urgent, call or WhatsApp.
              </p>
            </Enter>
            <Enter
              delay={0.15}
              className="-mx-6 bg-ink px-6 py-10 text-cream sm:mx-0 sm:p-8 md:p-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
            >
              <Suspense fallback={<div className="min-h-[560px]" />}>
                <QuoteForm />
              </Suspense>
            </Enter>
            <Enter delay={0.25}>
              <ul className="border-t border-line">
                {rows.map((r) => (
                  <li key={r.value} className="border-b border-line">
                    <ContactDialog channel={r.channel}>
                      <button
                        type="button"
                        className="group flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left"
                      >
                        <span className="text-sm font-medium text-muted">{r.label}</span>
                        <span className="text-right font-serif text-2xl decoration-gold-deep/60 underline-offset-[6px] transition-colors group-hover:text-gold-deep group-hover:underline">
                          {r.value}
                        </span>
                      </button>
                    </ContactDialog>
                  </li>
                ))}
                <li className="border-b border-line">
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block py-4 text-[15px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {contact.address[0]}, {contact.address[1]}
                  </a>
                </li>
              </ul>
            </Enter>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
