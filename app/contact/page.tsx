import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuoteForm } from "@/components/quote-form";
import { Enter } from "@/components/motion";
import { contact } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = {
  title: "Get a quote",
  description: "Tell us the date, city and occasion and we'll recommend a car and send a quote. Call or WhatsApp for urgent bookings.",
};

export default function ContactPage() {
  const rows = [
    ...contact.phones.map((p) => ({ label: "Call", value: p.label, href: p.href })),
    { label: "WhatsApp", value: "Message us", href: contact.whatsapp },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <>
      <SiteHeader />
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
                  <li key={r.href} className="border-b border-line">
                    <a href={r.href} className="group flex min-h-16 items-center justify-between gap-4 py-3">
                      <span className="text-sm font-medium text-muted">{r.label}</span>
                      <span className="text-right font-serif text-2xl decoration-gold-deep/60 underline-offset-[6px] transition-colors group-hover:text-gold-deep group-hover:underline">
                        {r.value}
                      </span>
                    </a>
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
