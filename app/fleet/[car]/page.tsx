import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Enter, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { ContactDialog } from "@/components/contact-dialog";
import { Confirm } from "@/components/confirm";
import { BreadcrumbStructuredData, CarStructuredData } from "@/components/structured-data";
import { carName, cars, fleet } from "@/lib/site";
import { openGraphBase } from "@/lib/seo";

type Props = { params: Promise<{ car: string }> };

export function generateStaticParams() {
  return cars.map((c) => ({ car: c.slug }));
}

async function getCar(params: Props["params"]) {
  const { car: slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();
  return { car, fleetClass: fleet.find((v) => v.slug === car.fleetClass) };
}

/** "Luxury cars" → "luxury cars", but "SUVs" stays "SUVs". */
const inSentence = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { car } = await getCar(params);
  const name = carName(car);
  const description = `Hire a chauffeur-driven ${name} from Jhajj'z for weddings, business and special occasions. Head office in Chandigarh, serving pan-India.`;
  const path = `/fleet/${car.slug}`;
  // Placeholder (CarWale) photos aren't the client's cars, so they don't become the sharing image.
  const ownPhoto = car.photos.find((p) => !p.placeholder);
  return {
    title: `${name} on Rent with Chauffeur`,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      url: path,
      title: `${name} with chauffeur | Jhajj'z`,
      description,
      ...(ownPhoto && { images: [{ url: ownPhoto.src, alt: ownPhoto.alt }] }),
    },
  };
}

export default async function CarPage({ params }: Props) {
  const { car, fleetClass } = await getCar(params);
  const name = carName(car);
  const [photo, ...morePhotos] = car.photos;
  // Only details we actually know; unknown ones are left out rather than shown as blanks.
  const known = car.details.filter((d) => d.value);
  const sameClass = cars.filter((c) => c.fleetClass === car.fleetClass && c.slug !== car.slug);

  return (
    <>
      <SiteHeader />
      <BreadcrumbStructuredData name={name} path={`/fleet/${car.slug}`} parent={{ name: "Fleet", path: "/fleet" }} />
      <CarStructuredData car={car} />
      <PageTransition>
        <main>
          <section className="pt-[72px] pb-[72px] md:pb-28">
            <div className="mx-auto max-w-[1200px] px-6 pt-8 md:pt-12">
              <nav aria-label="Breadcrumb" className="text-[15px] text-muted">
                <ol className="flex flex-wrap items-center gap-x-2">
                  <li>
                    <Link href="/fleet" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline">
                      Fleet
                    </Link>
                  </li>
                  {fleetClass && (
                    <>
                      <li aria-hidden="true">/</li>
                      <li>
                        <Link
                          href={`/fleet#${fleetClass.slug}`}
                          className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline"
                        >
                          {fleetClass.name}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>

              <div className="mt-4 grid gap-x-16 gap-y-10 md:mt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                <Enter>
                  {photo ? (
                    <figure>
                      <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                        <Image src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 1024px) 100vw, 680px" className="object-cover" style={{ objectPosition: photo.position }} />
                      </div>
                      {photo.credit && (
                        <figcaption className="mt-2 text-[13px] text-muted">Representative photo · {photo.credit}</figcaption>
                      )}
                    </figure>
                  ) : (
                    <div className="flex aspect-[3/2] items-center justify-center bg-sand p-6 text-center text-[15px]">
                      <Confirm>photos of our {name}</Confirm>
                    </div>
                  )}
                </Enter>

                <Enter delay={0.12}>
                  <h1 className="font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">{name}</h1>
                  <p className="mt-5 max-w-[520px] text-[17px] text-body">{car.text}</p>

                  {known.length > 0 && (
                    <dl className="mt-8 border-t border-ink/15">
                      {known.map((d) => (
                        <div key={d.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-ink/15 py-3 text-[16px]">
                          <dt className="text-muted">{d.label}</dt>
                          <dd className="text-ink">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild variant="ink">
                      <Link
                        href={`/contact?${new URLSearchParams({ ...(fleetClass && { vehicle: fleetClass.name }), notes: name })}`}
                      >
                        Ask for a quote
                      </Link>
                    </Button>
                    <ContactDialog channel="whatsapp" message={`Hello, I'd like to ask about the ${name}.`}>
                      <Button type="button" variant="outline">
                        Talk to us on WhatsApp
                      </Button>
                    </ContactDialog>
                  </div>
                </Enter>
              </div>

              {morePhotos.length > 0 && (
                <Reveal className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
                  {morePhotos.map((p) => (
                    <figure key={p.src}>
                      <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                        <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 380px" className="object-cover" style={{ objectPosition: p.position }} />
                      </div>
                      {p.credit && <figcaption className="mt-2 text-[13px] text-muted">Representative photo · {p.credit}</figcaption>}
                    </figure>
                  ))}
                </Reveal>
              )}
            </div>
          </section>

          {fleetClass && (
            <section className="bg-sand py-[72px] md:py-24">
              <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-6">
                <div className="min-w-0 flex-[1_1_480px]">
                  <h2 className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.1]">Looking at other cars?</h2>
                  <p className="mt-3 max-w-[480px] text-[17px] text-body">{fleetClass.text}</p>
                  {sameClass.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-x-5">
                      {sameClass.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/fleet/${c.slug}`}
                            className="inline-flex min-h-11 items-center text-[16px] text-ink underline decoration-ink/30 underline-offset-[5px] transition-colors hover:decoration-ink"
                          >
                            {carName(c)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button asChild variant="outline">
                  <Link href={`/fleet#${fleetClass.slug}`}>See all {inSentence(fleetClass.name)}</Link>
                </Button>
              </Reveal>
            </section>
          )}
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
