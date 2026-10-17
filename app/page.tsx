import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Enter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cities, contact, fleet, heroImage, serviceGroups } from "@/lib/site";

const preview = ["luxury-cars", "wedding-cars", "suvs", "vintage-cars", "luxury-coaches", "mini-vans"]
  .map((slug) => fleet.find((v) => v.slug === slug)!)
  .filter(Boolean);

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[min(100svh,880px)] flex-col overflow-hidden bg-[#0e0e0d] text-cream">
          <Image
            src={heroImage}
            alt="A car from the Jhajj'z fleet"
            fill
            priority
            sizes="100vw"
            className="animate-hero-zoom object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,9,0.85)_0%,rgba(10,10,9,0.45)_45%,rgba(10,10,9,0)_75%)]"
          />
          <div className="relative mx-auto mt-auto w-full max-w-[1200px] px-6 pt-36 pb-16 md:pb-20">
            <Enter delay={0.15}>
              <h1 className="max-w-[720px] font-serif text-[clamp(38px,4.8vw,60px)] leading-[1.1] tracking-[-0.01em]">
                Luxury cars and coaches, chauffeur-driven since 1998.
              </h1>
            </Enter>
            <Enter delay={0.3}>
              <p className="mt-6 max-w-[480px] text-lg text-[#dad5cb]">
                Weddings, VIP visits, corporate travel and airport transfers. Based in Mohali, available in 14 cities
                across India.
              </p>
            </Enter>
            <Enter delay={0.45} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild>
                <Link href="/contact">Get a quote</Link>
              </Button>
              <a
                href={contact.whatsapp}
                className="inline-flex min-h-11 items-center text-[15px] font-medium text-cream/90 underline decoration-white/40 underline-offset-[6px] transition-colors hover:text-cream hover:decoration-cream"
              >
                or WhatsApp us
              </a>
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
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">Our fleet</h2>
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
                  <Link href={`/fleet#${v.slug}`} className="group flex h-full flex-col gap-3.5">
                    <div className={i === 0 ? "relative aspect-[3/2] overflow-hidden bg-stone md:aspect-auto md:min-h-[360px] md:flex-1" : "relative aspect-[3/2] overflow-hidden bg-stone"}>
                      <Image
                        src={v.image}
                        alt={v.imageAlt}
                        fill
                        sizes={i === 0 ? "(max-width: 768px) 85vw, 800px" : "(max-width: 768px) 85vw, 400px"}
                        className="object-cover saturate-[0.85] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100"
                      />
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
        <section id="weddings" className="scroll-mt-16 bg-ink py-[72px] text-cream md:py-28">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12 px-6">
            <Reveal className="relative aspect-[4/5] max-h-[600px] min-w-0 flex-[1_1_460px] overflow-hidden bg-ink-soft">
              <Image
                src={fleet.find((v) => v.slug === "wedding-cars")!.image}
                alt="Decorated wedding car from the Jhajj'z fleet"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={0.1} className="min-w-0 flex-[1_1_400px]">
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">Wedding cars</h2>
              <p className="mt-5 max-w-[480px] text-[17px] text-[#cfcac0]">
                We&apos;ve done wedding cars for over 25 years. Pick a car for the couple, cars for family, and coaches
                for the baraat and guests. We handle decoration, timings and chauffeurs on the day.
              </p>
              <Button asChild className="mt-8">
                <Link href="/contact?occasion=Wedding">Plan wedding cars</Link>
              </Button>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-16 py-[72px] md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal>
              <h2 className="mb-10 font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">What we do</h2>
            </Reveal>
            <Stagger className="grid gap-x-12 gap-y-12 md:grid-cols-3">
              {serviceGroups.map((g) => (
                <StaggerItem key={g.title}>
                  <h3 className="border-b border-ink/80 pb-3 font-serif text-2xl">{g.title}</h3>
                  <ul>
                    {g.items.map((s) => (
                      <li key={s.title} className="border-b border-line py-4">
                        <h4 className="text-[17px] font-semibold">{s.title}</h4>
                        <p className="mt-1 text-[15px] text-muted">{s.text}</p>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-16 bg-sand py-[72px] md:py-28">
          <div className="mx-auto flex max-w-[1200px] flex-wrap gap-x-16 gap-y-12 px-6">
            <Reveal className="min-w-0 flex-[1_1_440px]">
              <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em]">About Jhajj&apos;z</h2>
              <p className="mt-5 max-w-[520px] text-[17px] text-[#45423c]">
                We started in Chandigarh in 1998. Today we run luxury cars, SUVs, coaches and mini vans from stations
                across India, each with trained chauffeurs and a station manager you can call directly.
              </p>
              <p className="mt-4 max-w-[520px] text-[17px] text-[#45423c]">
                Need a car for a month or longer? Ask about long-term hire.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="ink">
                  <Link href="/contact">Get a quote</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={contact.phones[0].href}>Call {contact.phones[0].label}</a>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="min-w-0 flex-[1_1_400px]">
              <h3 className="mb-3 text-[15px] font-semibold">Where we operate</h3>
              <p className="text-[17px] leading-[1.9] text-[#45423c]">
                {cities.slice(0, -1).join(", ")} and {cities.at(-1)}.
              </p>
            </Reveal>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
