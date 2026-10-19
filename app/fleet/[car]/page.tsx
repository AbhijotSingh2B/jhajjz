import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Enter, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { Confirm } from "@/components/confirm";
import { ShareButton } from "@/components/share-button";
import { CarPhotos } from "@/components/car-photos";
import { CarColourProvider, CarQuoteButtons, ColourPicker } from "@/components/car-colour";
import { CarPreview } from "@/components/car-preview";
import { BreadcrumbStructuredData, CarStructuredData } from "@/components/structured-data";
import { FleetClassPage } from "@/components/fleet-class-page";
import { carColours, carName, carTitle, carYears, cars, carsInClass, classHref, fleet, inSentence, otherYears } from "@/lib/site";
import { openGraphBase } from "@/lib/seo";

type Props = { params: Promise<{ car: string }> };

// This route serves both class pages (/fleet/suvs) and car pages (/fleet/rolls-royce-ghost); slugs never overlap.
const classWithCars = (slug: string) => fleet.find((v) => v.slug === slug && carsInClass(slug).length > 0);

export function generateStaticParams() {
  return [...fleet.filter((v) => classWithCars(v.slug)), ...cars].map((x) => ({ car: x.slug }));
}

async function getCar(params: Props["params"]) {
  const { car: slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();
  return { car, fleetClass: fleet.find((v) => v.slug === car.fleetClass) };
}

function classMetadata(v: NonNullable<ReturnType<typeof classWithCars>>): Metadata {
  const names = carsInClass(v.slug).map(carTitle).join(", ");
  const description = `${v.text} Chauffeur-driven ${inSentence(v.name)} from Jhajj'z: ${names}. Head office in Chandigarh, serving pan-India.`;
  const path = `/fleet/${v.slug}`;
  return {
    title: `${v.name} on Rent with Chauffeur`,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      url: path,
      title: `${v.name} with chauffeur | Jhajj'z`,
      description,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = classWithCars((await params).car);
  if (v) return classMetadata(v);
  const { car } = await getCar(params);
  const name = carTitle(car);
  const description = `Hire a chauffeur-driven ${name} from Jhajj'z for weddings, business and special occasions. Head office in Chandigarh, serving pan-India.`;
  const path = `/fleet/${car.slug}`;
  return {
    title: `${name} on Rent with Chauffeur`,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      url: path,
      title: `${name} with chauffeur | Jhajj'z`,
      description,
    },
  };
}

export default async function CarPage({ params }: Props) {
  const v = classWithCars((await params).car);
  if (v) return <FleetClassPage fleetClass={v} />;
  const { car, fleetClass } = await getCar(params);
  const name = carName(car);
  const years = carYears(car);
  const siblings = otherYears(car);
  // Only details we actually know; unknown ones are left out rather than shown as blanks.
  const known = car.details.filter((d) => d.value);
  // Other generations of this model first, then the rest of its class.
  const sameClass = [...siblings, ...cars.filter((c) => c.fleetClass === car.fleetClass && c.slug !== car.slug && !siblings.includes(c))];

  return (
    <>
      <SiteHeader />
      <BreadcrumbStructuredData name={carTitle(car)} path={`/fleet/${car.slug}`} parent={{ name: "Fleet", path: "/fleet" }} />
      <CarStructuredData car={car} />
      <PageTransition>
        <main>
          <section className="pt-[72px] pb-[72px] md:pb-28">
            <div className="mx-auto max-w-[1200px] px-6 pt-8 md:pt-12">
              <div className="flex items-start justify-between gap-4">
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
                            href={classHref(fleetClass.slug)}
                            className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline"
                          >
                            {fleetClass.name}
                          </Link>
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
                <ShareButton path={`/fleet/${car.slug}`} name={name} className="shrink-0 text-muted hover:text-ink" />
              </div>

              <CarColourProvider>
              <div className="mt-4 grid gap-x-16 gap-y-10 md:mt-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                <Enter>
                  {car.photos.length > 0 ? (
                    <CarPhotos photos={car.photos} label={`Photos of the ${carTitle(car)}`} sizes="(max-width: 1024px) 100vw, 680px" />
                  ) : (
                    <div className="flex aspect-[3/2] items-center justify-center bg-sand p-6 text-center text-[15px]">
                      <Confirm>photos of our {name}</Confirm>
                    </div>
                  )}
                </Enter>

                <Enter delay={0.12}>
                  <h1 className="font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">{name}</h1>
                  {years && <p className="mt-2 text-[17px] text-muted">{years}</p>}
                  <p className="mt-5 max-w-[520px] text-[17px] text-body">{car.text}</p>

                  {known.length > 0 && (
                    <dl className="mt-8 border-t border-ink/15">
                      {known.map((d) => (
                        <div key={d.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-ink/15 py-3 text-[16px]">
                          <dt className="text-muted">{d.label}</dt>
                          {/* Passengers never count the chauffeur; say so, or "6" reads as a 6-seater. */}
                          <dd className="text-ink">{d.label === "Passengers" ? `${d.value}, plus the chauffeur` : d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <ColourPicker colours={carColours(car.photos)} />
                  <CarQuoteButtons params={{ ...(fleetClass && { vehicle: fleetClass.name }), car: car.slug }} title={carTitle(car)} />

                  {siblings.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-[16px] font-semibold">Also in our fleet</h2>
                      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[400px]">
                        {siblings.map((c) => (
                          <li key={c.slug}>
                            <CarPreview car={c} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Enter>
              </div>
              </CarColourProvider>

            </div>
          </section>

          {fleetClass && (
            <section className="bg-sand py-[72px] md:py-24">
              <Reveal className="mx-auto max-w-[1200px] px-6">
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
                  <div className="min-w-0 flex-[1_1_480px]">
                    <h2 className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.1]">Looking at other cars?</h2>
                    <p className="mt-3 max-w-[480px] text-[17px] text-body">{fleetClass.text}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={classHref(fleetClass.slug)}>See all {inSentence(fleetClass.name)}</Link>
                  </Button>
                </div>
                {sameClass.length > 0 && (
                  // Phones: a row to swipe through. Wider screens: a grid.
                  <ul className="-mx-6 mt-10 flex snap-x scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-x-6 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                    {sameClass.map((c) => (
                      <li key={c.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
                        <CarPreview car={c} frame="bg-paper" />
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </section>
          )}
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
