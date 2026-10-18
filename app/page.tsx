import { Photo } from "@/components/photo";
import { IllustrativeTag } from "@/components/illustrative-tag";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Enter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { IndiaMap } from "@/components/india-map";
import { cities, classHref, fleet, heroPhoto, photos, serviceGroups } from "@/lib/site";
import { PageTransition } from "@/components/page-transition";

// Home only shows classes that have a photo.
const withPhoto = (slug: string) => {
  const v = fleet.find((x) => x.slug === slug);
  return v?.image ? { ...v, image: v.image, imageAlt: v.imageAlt ?? v.name } : undefined;
};
// Same order as the fleet page: luxury cars, executive cabs, SUVs and MPVs first.
const preview = fleet
  .map((v) => withPhoto(v.slug))
  .filter((v) => v !== undefined);
// Wedding band photo: the white Rolls-Royce Ghost decorated with flowers. (The decorated line-up from above was tried
// on phones, but its cars sit at the bottom of the photo, under the text, and a tall crop can't move them up.)
const weddingPhoto = photos.ghostFlowers;

// The quote-form link under each group name (occasion names match lib/site.ts `occasions`).
const groupLinks: Record<string, { label: string; href: string }> = {
  "Weddings & events": { label: "Ask about wedding cars", href: "/contact?occasion=Wedding" },
  "Corporate & VIP": { label: "Ask about corporate travel", href: "/contact?occasion=Corporate%20%2F%20VIP" },
  "Personal travel": { label: "Book a chauffeur", href: "/contact" },
};

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <PageTransition>
        <main>
          {/* Hero */}
          <section className="relative flex min-h-[min(100svh,880px)] flex-col overflow-hidden bg-ink-deep text-cream">
            <Photo
              src={heroPhoto}
              alt="A car from the Jhajj'z fleet"
              fill
              dark
              priority
              sizes="100vw"
              className="animate-hero-zoom object-cover object-center"
            />
            <div
              aria-hidden="true"
              // Phones: the text spans the full width, so darken from the bottom up instead of from the left.
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,9,0.88)_0%,rgba(10,10,9,0.7)_40%,rgba(10,10,9,0.15)_70%,rgba(10,10,9,0)_100%)] md:bg-[linear-gradient(90deg,rgba(10,10,9,0.85)_0%,rgba(10,10,9,0.45)_45%,rgba(10,10,9,0)_75%)]"
            />
            <div className="relative mx-auto mt-auto w-full max-w-[1200px] px-6 pt-36 pb-16 md:pb-20">
              <Enter delay={0.15}>
                <h1 className="max-w-[720px] font-serif text-[clamp(38px,4.8vw,60px)] leading-[1.1] tracking-[-0.01em]">
                  {/* nowrap keeps the hyphenated words from splitting across lines */}
                  From a <span className="whitespace-nowrap">Rolls-Royce</span> to a Volvo coach,{" "}
                  <span className="whitespace-nowrap">chauffeur-driven</span>{" "}
                  <span className="whitespace-nowrap">since 1998.</span>
                </h1>
              </Enter>
              <Enter delay={0.3}>
                <p className="mt-6 max-w-[480px] text-lg text-on-dark-hero">
                  Weddings, VIP visits, corporate travel and airport transfers. Head office in Chandigarh, serving
                  pan-India.
                </p>
              </Enter>
              <Enter delay={0.45} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button asChild>
                  <Link href="/contact">Get a quote</Link>
                </Button>
                <ContactDialog channel="whatsapp">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center text-[15px] font-medium text-cream/90 underline decoration-white/40 underline-offset-[6px] transition-colors hover:text-cream hover:decoration-cream"
                  >
                    or talk to us on WhatsApp
                  </button>
                </ContactDialog>
              </Enter>
            </div>
          </section>

          {/* Booking bar */}
          <section className="border-b border-stone bg-white">
            <Enter delay={0.6} y={12}>
              <BookingBar />
            </Enter>
          </section>

          {/* Fleet preview */}
          <section id="fleet" className="py-[72px] md:py-28">
            <div className="mx-auto max-w-[1200px] px-6">
              <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">The cars and coaches we run</h2>
                <Link href="/fleet" className="group inline-flex min-h-11 items-center gap-2 font-medium text-gold-deep">
                  See all vehicles
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Reveal>
              {/* Swipeable row on phones; on desktop the first class gets a large tile. */}
              <Stagger className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-8 md:overflow-visible md:px-0 md:pb-0">
                {preview.map((v, i) => (
                  <StaggerItem
                    key={v.slug}
                    className={i === 0 ? "w-[82%] shrink-0 snap-start md:col-span-2 md:row-span-2 md:w-auto" : "w-[82%] shrink-0 snap-start md:w-auto"}
                  >
                    <Link href={classHref(v.slug)} className="group flex h-full flex-col gap-3.5">
                      <div
                        className={`relative aspect-[3/2] overflow-hidden ${v.imageCutout ? "bg-sand" : "bg-stone"} ${i === 0 ? "md:aspect-auto md:min-h-[360px] md:flex-1" : ""}`}
                      >
                        <div className={`absolute inset-0 ${v.imageCutout ? "mix-blend-multiply" : ""}`} style={{ transform: v.imageZoom ? `scale(${v.imageZoom})` : undefined }}>
                          <Photo
                            src={v.image}
                            alt={v.imageAlt}
                            fill
                            sizes={i === 0 ? "(max-width: 768px) 85vw, 800px" : "(max-width: 768px) 85vw, 400px"}
                            className={v.imageCutout ? "object-contain p-5 md:p-8" : "object-cover"}
                          />
                        </div>
                        {v.imagePlaceholder && <IllustrativeTag />}
                      </div>
                      <div>
                        <h3 className={i === 0 ? "text-[19px] font-semibold md:font-serif md:text-[28px] md:font-normal" : "text-[19px] font-semibold"}>{v.name}</h3>
                        <p className="mt-1 text-[15px] text-muted">{v.text}</p>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Weddings */}
          <section id="weddings" className="relative isolate flex min-h-[560px] scroll-mt-16 items-end overflow-hidden bg-ink text-cream md:min-h-[640px]">
            <Photo
              src={weddingPhoto}
              alt="White Rolls-Royce Ghost decorated with flowers"
              fill
              dark
              skeletonClassName="-z-20"
              sizes="100vw"
              // Phones crop the sides: shift right so the whole grille and the flowers are in frame.
              className="-z-20 object-cover object-[62%_center] md:object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(10,10,9,0.88)_0%,rgba(10,10,9,0.55)_45%,rgba(10,10,9,0.05)_100%)]"
            />
            <Reveal className="mx-auto w-full max-w-[1200px] px-6 py-[72px] md:py-20">
              <h2 className="max-w-[640px] font-serif text-[clamp(34px,4.6vw,56px)] leading-[1.08] tracking-[-0.01em]">
                Cars for your wedding
              </h2>
              <p className="mt-5 max-w-[520px] text-[17px] text-on-dark-strong">
                We&apos;ve done wedding cars for over 25 years. Pick a car for the couple, cars for family, and coaches
                for the baraat and guests. We handle decoration, timings and chauffeurs on the day.
              </p>
              <Button asChild className="mt-8">
                <Link href="/contact?occasion=Wedding">Plan wedding cars</Link>
              </Button>
            </Reveal>
          </section>

          {/* Services */}
          <section id="services" className="scroll-mt-16 py-[72px] md:py-28">
            <div className="mx-auto max-w-[1200px] px-6">
              <Reveal className="grid items-end gap-x-16 gap-y-5 md:grid-cols-2">
                <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">Who we drive for</h2>
                <p className="max-w-[420px] text-[17px] text-muted md:justify-self-end">
                  Families, companies, hotels, airlines and delegations. If yours isn&apos;t listed, ask us.
                </p>
              </Reveal>
              {/* Laid out like a printed rate card: one row per group, name and link left, services right. */}
              <Stagger className="mt-12 border-b border-ink/80">
                {serviceGroups.map((g) => {
                  const link = groupLinks[g.title];
                  return (
                    <StaggerItem
                      key={g.title}
                      className="grid gap-x-16 gap-y-5 border-t border-ink/80 py-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:py-10"
                    >
                      <div>
                        <h3 className="font-serif text-[28px] leading-tight md:text-[32px]">{g.title}</h3>
                        {link && (
                          <Link
                            href={link.href}
                            className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-gold-deep"
                          >
                            <span className="underline decoration-gold-deep/30 underline-offset-[5px] transition-colors duration-300 group-hover:decoration-gold-deep">
                              {link.label}
                            </span>
                          </Link>
                        )}
                        <div className="relative mt-5 aspect-[3/2] max-w-[420px] overflow-hidden bg-stone">
                          <Photo src={g.photo.src} alt={g.photo.alt} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                        </div>
                      </div>
                      <ul className="grid content-start gap-x-10 gap-y-5 sm:grid-cols-2 md:pt-2">
                        {g.items.map((s) => (
                          <li key={s.title}>
                            <span className="block text-[16px] font-semibold">{s.title}</span>
                            <span className="mt-0.5 block text-[15px] text-muted">{s.text}</span>
                          </li>
                        ))}
                      </ul>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </section>

          {/* About */}
          <section id="about" className="scroll-mt-16 bg-sand py-[72px] md:py-28">
            <div className="mx-auto flex max-w-[1200px] flex-wrap gap-x-16 gap-y-12 px-6">
              <Reveal className="min-w-0 flex-[1_1_440px]">
                <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">Chandigarh, since 1998</h2>
                <p className="mt-5 max-w-[520px] text-[17px] text-body">
                  We started in Chandigarh in 1998. Today we run luxury cars, SUVs, coaches and mini vans across India,
                  with trained chauffeurs and a station manager you can call directly.
                </p>
                <p className="mt-4 max-w-[520px] text-[17px] text-body">
                  Need a car for a month or longer? Ask about long-term hire.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="ink">
                    <Link href="/contact">Get a quote</Link>
                  </Button>
                  <ContactDialog channel="call">
                    <Button type="button" variant="outline">
                      Call us
                    </Button>
                  </ContactDialog>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="min-w-0 flex-[1_1_400px]">
                <h3 className="font-serif text-2xl">Pan-India, including</h3>
                <div className="mt-6 grid items-start gap-x-10 gap-y-8 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
                  <IndiaMap className="mx-auto w-full max-w-[300px] sm:max-w-none" />
                  <div>
                    <ul className="grid grid-cols-2 gap-x-6 border-t border-ink/15">
                      {cities.map((c) => (
                        <li key={c} className="border-b border-ink/15 py-2.5 text-[16px] text-body">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[15px] text-muted">Travelling somewhere else in India? Ask us.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
