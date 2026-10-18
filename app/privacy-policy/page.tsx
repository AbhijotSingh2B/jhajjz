import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { contact } from "@/lib/site";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the Jhajj'z website handles your information. No cookies, no tracking.",
  alternates: { canonical: "/privacy-policy" },
};

// Written from what this site actually does (checked in the code: no cookies, no
// analytics, the quote form only opens WhatsApp or email). Nothing about how the client handles
// bookings: the "When you contact us" section (sharing, retention, marketing) was removed (Nirmal).

const updated = "18 October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What this website collects",
    body: (
      <>
        <p>
          Nothing, on its own. The site doesn&apos;t use cookies, analytics, advertising or tracking of any kind. Fonts
          and photos are served from our own server.
        </p>
        <p>
          Like any website, our hosting provider keeps standard technical logs (such as IP address, browser and the
          pages requested) to keep the site secure and running.
        </p>
      </>
    ),
  },
  {
    title: "The quote form",
    body: (
      <>
        <p>
          What you type into the quote form stays in your browser. When you press &ldquo;Request a quote&rdquo;, the
          site opens WhatsApp (or your email app) with your details written into a message. Nothing reaches us until
          you send that message yourself, and the form is not stored on our servers.
        </p>
      </>
    ),
  },
  {
    title: "Links to other sites",
    body: (
      <p>
        Our pages link to WhatsApp, Google Maps and our social media pages. Those sites have their own privacy policies,
        which apply once you leave ours.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask us what details we hold about you, and ask us to correct or delete them, using the contact details
        below.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: <p>If we change how the site handles information, we&apos;ll update this page and the date at the top.</p>,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main className="mx-auto max-w-[760px] px-6 pt-[144px] pb-[72px] md:pt-[168px] md:pb-28">
          <h1 className="font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">Privacy policy</h1>
          <p className="mt-4 text-[15px] text-muted">Last updated {updated}</p>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-serif text-[26px] leading-tight">{s.title}</h2>
                <div className="mt-3 flex flex-col gap-4 text-[17px] leading-relaxed text-body">{s.body}</div>
              </section>
            ))}

            <section>
              <h2 className="font-serif text-[26px] leading-tight">Contact</h2>
              <div className="mt-3 text-[17px] leading-relaxed text-body">
                <p>Jhajj&apos;z</p>
                <p>
                  {contact.address[0]}, {contact.address[1]}
                </p>
                <p className="mt-3">
                  <ContactDialog channel="email">
                    <button type="button" className="underline underline-offset-4 hover:text-gold-deep">
                      {contact.email}
                    </button>
                  </ContactDialog>
                </p>
                <p>
                  {contact.phones.map((p, i) => (
                    <span key={p.href}>
                      {i > 0 && " · "}
                      <ContactDialog channel="call">
                        <button type="button" className="underline-offset-4 hover:text-gold-deep hover:underline">
                          {p.label}
                        </button>
                      </ContactDialog>
                    </span>
                  ))}
                </p>
              </div>
              <ContactDialog channel="all">
                <Button type="button" variant="ink" className="mt-8">
                  Contact us
                </Button>
              </ContactDialog>
            </section>
          </div>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
