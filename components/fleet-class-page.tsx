import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Enter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { ContactDialog } from "@/components/contact-dialog";
import { Confirm } from "@/components/confirm";
import { BreadcrumbStructuredData } from "@/components/structured-data";
import { cn } from "@/lib/utils";
import { carName, carsInClass, inSentence, type Vehicle } from "@/lib/site";

/** One vehicle class (e.g. /fleet/suvs): every car in it, each linking to its own page. */
export function FleetClassPage({ fleetClass }: { fleetClass: Vehicle }) {
  const classCars = carsInClass(fleetClass.slug);
  const path = `/fleet/${fleetClass.slug}`;

  return (
    <>
      <SiteHeader />
      <BreadcrumbStructuredData name={fleetClass.name} path={path} parent={{ name: "Fleet", path: "/fleet" }} />
      <PageTransition>
        <main>
          <section className="pt-[72px] pb-[72px] md:pb-24">
            <div className="mx-auto max-w-[1200px] px-6 pt-8 md:pt-12">
              <nav aria-label="Breadcrumb" className="text-[15px] text-muted">
                <Link href="/fleet" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline">
                  Fleet
                </Link>
              </nav>
              <Enter>
                <h1 className="mt-2 max-w-[720px] font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">
                  {fleetClass.name}
                </h1>
              </Enter>
              <Enter delay={0.12}>
                <p className="mt-5 max-w-[560px] text-[17px] text-muted">{fleetClass.text}</p>
              </Enter>

              <Stagger className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-x-6 gap-y-10">
                {classCars.map((car, i) => {
                  const photo = car.photos[0];
                  const name = carName(car);
                  return (
                    <StaggerItem key={car.slug}>
                      <Link href={`/fleet/${car.slug}`} className="group flex flex-col">
                        <div className={cn("relative aspect-[3/2] overflow-hidden", photo?.cutout ? "bg-sand" : "bg-stone")}>
                          {photo ? (
                            // The multiply sits on this wrapper: a scaled (zoomed) element is its own stacking context.
                            <div
                              className={cn("absolute inset-0", photo.cutout && "mix-blend-multiply")}
                              style={{ transform: photo.zoom ? `scale(${photo.zoom})` : undefined }}
                            >
                              <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                priority={i < 3}
                                sizes="(max-width: 768px) 100vw, 400px"
                                className={cn(
                                  "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                                  photo.cutout ? "object-contain p-5" : photo.portrait ? "object-contain" : "object-cover",
                                )}
                                style={{ objectPosition: photo.position }}
                              />
                            </div>
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-[15px]">
                              <Confirm>photo</Confirm>
                            </span>
                          )}
                        </div>
                        <h2 className="mt-4 font-serif text-[28px] leading-tight underline decoration-transparent underline-offset-[6px] transition-colors duration-300 group-hover:decoration-ink/40">
                          {name}
                        </h2>
                        <p className="mt-1.5 text-[15px] text-muted">{car.text}</p>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </section>

          <section className="bg-sand py-[72px] md:py-24">
            <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-6">
              <div className="min-w-0 flex-[1_1_480px]">
                <h2 className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.1]">Not sure which one?</h2>
                <p className="mt-3 max-w-[480px] text-[17px] text-body">
                  Tell us the date, the city and how many people are travelling, and we&apos;ll suggest the right car.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="ink">
                  <Link href={`/contact?vehicle=${encodeURIComponent(fleetClass.name)}`}>Ask for a quote</Link>
                </Button>
                <ContactDialog channel="whatsapp" message={`Hello, I'd like to ask about your ${inSentence(fleetClass.name)}.`}>
                  <Button type="button" variant="outline">
                    Talk to us on WhatsApp
                  </Button>
                </ContactDialog>
              </div>
            </Reveal>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
