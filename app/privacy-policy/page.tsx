import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { contact } from "@/lib/site";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";
import { Confirm } from "@/components/confirm";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the Jhajj'z website handles your information. No cookies, no tracking.",
  alternates: { canonical: "/privacy-policy" },
};

// Written from what this site actually does (checked in the code: no cookies, no
// analytics, the quote form only opens WhatsApp or email). Statements about how
// the client handles bookings are marked [CONFIRM] until the client agrees them.
// If the client prefers the text from jhajjz.in/privacy-policy, replace this.

const updated = "17 October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What this website collects",
    body: (
      <>
        <p>
          Nothing, on its own. The site doesn&apos;t use cookies, analytics, advertising or tracking of any kind. Fonts
          are served from our own server. Car photos load from the image service that stores them, which sees your IP
          address and that the request came from this site, as with any image online; we don&apos;t send it anything else.
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
    title: "When you contact us",
    body: (
      <>
        <p>
          If you call, message us on WhatsApp or email us, we receive what you share: usually your name, phone number
          and trip details. We use it to reply, prepare a quote and arrange your booking.
        </p>
        <p>
          <Confirm>who booking details are shared with, e.g. the assigned chauffeur and station manager</Confirm>{" "}
          <Confirm>how long enquiry and booking details are kept</Confirm>
        </p>
        <p>
          <Confirm>we don&apos;t sell your details or use them for marketing without asking</Confirm>
        </p>
        <p>
          Messages sent on WhatsApp are also covered by{" "}
          <a
            href="https://www.whatsapp.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-gold-deep"
          >
            WhatsApp&apos;s privacy policy
          </a>
          .
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

          <p className="mt-8 max-w-[640px] text-[19px] leading-relaxed text-ink">
            In short: this website doesn&apos;t use cookies or tracking, and the quote form doesn&apos;t send anything
            until you send it yourself on WhatsApp or by email.
          </p>

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
