import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { contact, founded } from "@/lib/site";
import { ContactDialog } from "@/components/contact-dialog";

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep pb-[calc(56px+env(safe-area-inset-bottom))] text-[15px] text-on-dark md:pb-0">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 px-6 pt-16 pb-8">
        <div>
          <Link href="/" className="font-serif text-2xl text-cream">
            Jhajj&apos;z
          </Link>
          <p className="mt-2 text-muted-dark">Luxury car and coach rental across India since {founded}.</p>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Office</h3>
          <p>
            {contact.address[0]}
            <br />
            {contact.address[1]}
          </p>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Contact</h3>
          <ul className="flex flex-col">
            {contact.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="transition-colors hover:text-cream">
                  {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-cream">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Follow</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {contact.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-ink-soft px-6 py-5 text-sm text-footer-muted">
        <span>© 2026 Jhajj&apos;z</span>
        <Link href="/privacy-policy" className="hover:text-cream">
          Privacy policy
        </Link>
      </div>
      <MobileContactBar />
    </footer>
  );
}

/** Phones only: Call and WhatsApp always within thumb reach. */
function MobileContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur-md md:hidden">
      <ContactDialog channel="call">
        <button type="button" className="flex h-14 items-center justify-center gap-2 text-[15px] font-medium">
          <Phone className="size-4 text-gold" aria-hidden="true" />
          Call
        </button>
      </ContactDialog>
      <ContactDialog channel="whatsapp">
        <button
          type="button"
          className="flex h-14 items-center justify-center gap-2 border-l border-white/10 text-[15px] font-medium"
        >
          <MessageCircle className="size-4 text-gold" aria-hidden="true" />
          WhatsApp
        </button>
      </ContactDialog>
    </div>
  );
}
