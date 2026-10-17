import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuoteForm } from "@/components/quote-form";
import { Enter } from "@/components/motion";
import { contact } from "@/lib/site";

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
      <main className="pt-[72px]">
        <section className="mx-auto flex max-w-[1200px] flex-wrap gap-x-16 gap-y-12 px-6 py-[72px] md:py-28">
          <Enter className="min-w-0 flex-[1_1_400px]">
            <h1 className="font-serif text-[clamp(40px,5.5vw,68px)] leading-[1.05] tracking-[-0.02em]">Get a quote</h1>
            <p className="mt-5 max-w-[420px] text-[17px] text-muted">
              Share a few details and we&apos;ll recommend the right car and send a price. For anything urgent, call or
              WhatsApp.
            </p>
            <ul className="mt-10 border-t border-line">
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
              <li className="border-b border-line py-4 text-[15px] text-muted">
                {contact.address[0]}, {contact.address[1]}
              </li>
            </ul>
          </Enter>
          <Enter delay={0.15} className="min-w-0 flex-[1_1_540px] bg-ink p-8 text-cream md:p-12">
            <Suspense fallback={<div className="min-h-[560px]" />}>
              <QuoteForm />
            </Suspense>
          </Enter>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
