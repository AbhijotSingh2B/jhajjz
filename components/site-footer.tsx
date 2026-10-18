import Link from "next/link";
import { Logo } from "@/components/logo";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { contact, founded } from "@/lib/site";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";

const socialIcons = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  Facebook: FacebookIcon,
  X: XIcon,
};
// "Instagram (Delhi)" uses the Instagram icon too.
const socialIcon = (label: string) => socialIcons[label.split(" ")[0] as keyof typeof socialIcons] ?? InstagramIcon;

const item = "group flex min-h-11 items-center gap-3 text-left transition-colors hover:text-cream md:min-h-9";
const icon = "size-4 shrink-0 text-gold transition-transform duration-300 group-hover:scale-110";

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep pb-[calc(56px+env(safe-area-inset-bottom))] text-[15px] text-on-dark md:pb-0">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 px-6 pt-16 pb-8">
        <div>
          <Link href="/" aria-label="Jhajj'z home" className="font-serif text-2xl text-cream">
            <Logo markClassName="h-8" />
          </Link>
          <p className="mt-2 text-muted-dark">Luxury car and coach rental across India since {founded}.</p>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Office</h3>
          <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="group flex gap-3 transition-colors hover:text-cream">
            <MapPin className={`${icon} mt-1`} aria-hidden="true" />
            <span>
              {contact.address[0]}
              <br />
              {contact.address[1]}
            </span>
          </a>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Contact</h3>
          <ul className="flex flex-col">
            {contact.phones.map((p) => (
              <li key={p.href}>
                <ContactDialog channel="call">
                  <button type="button" className={item}>
                    <Phone className={icon} aria-hidden="true" />
                    {p.label}
                  </button>
                </ContactDialog>
              </li>
            ))}
            <li>
              <ContactDialog channel="whatsapp">
                <button type="button" className={item}>
                  <WhatsAppIcon className={icon} aria-hidden="true" />
                  WhatsApp
                </button>
              </ContactDialog>
            </li>
            <li>
              <ContactDialog channel="email">
                <button type="button" className={item}>
                  <Mail className={icon} aria-hidden="true" />
                  {contact.email}
                </button>
              </ContactDialog>
            </li>
          </ul>
          <ContactDialog channel="all">
            <Button type="button" variant="outlineLight" size="default" className="mt-5">
              Contact us
            </Button>
          </ContactDialog>
        </div>
        <div>
          <h3 className="mb-2.5 text-sm font-semibold text-cream">Follow</h3>
          <ul className="grid grid-cols-2 gap-x-4 sm:flex sm:flex-col">
            {contact.socials.map((s) => {
              const Icon = socialIcon(s.label);
              return (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={item}>
                    <Icon className={icon} aria-hidden="true" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Rule on the inner div so it lines up with the columns above instead of running into the padding. */}
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-wrap justify-between gap-3 border-t border-ink-soft py-5 text-sm text-footer-muted">
          <span>© 2026 Jhajj&apos;z</span>
          <Link href="/privacy-policy" className="hover:text-cream">
            Privacy policy
          </Link>
        </div>
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
          <WhatsAppIcon className="size-4 text-gold" aria-hidden="true" />
          WhatsApp
        </button>
      </ContactDialog>
    </div>
  );
}
