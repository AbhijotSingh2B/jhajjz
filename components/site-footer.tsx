import Link from "next/link";
import { contact, founded } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#0e0e0d] text-[15px] text-[#cfcac0]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 px-6 pt-16 pb-8">
        <div>
          <Link href="/" className="font-serif text-2xl text-cream">
            Jhajj&apos;z
          </Link>
          <p className="mt-2 text-muted-dark">Luxury car and coach rental since {founded}.</p>
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
          <ul className="flex flex-col">
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
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-ink-soft px-6 py-5 text-sm text-[#8e8a81]">
        <span>© 2026 Jhajj&apos;z</span>
        <Link href="/privacy-policy" className="hover:text-cream">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
