"use client";

import { useState } from "react";
import { Photo } from "@/components/photo";
import { IllustrativeTag } from "@/components/illustrative-tag";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { carName, carTitle, carYears, carsInClass as carsIn, classHref, contact, fleet, fleetGroups, type Car, type FleetGroup, type Vehicle } from "@/lib/site";
import { Confirm } from "@/components/confirm";
import { ShareButton } from "@/components/share-button";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function FleetBrowser() {
  const [filter, setFilter] = useState<"all" | FleetGroup>("all");
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  // Relevance: each search word scores by the best place it appears (name over class over description); every
  // word has to appear somewhere (else 0). `direct`: every word is in the car's own name, make or model (weight 3+).
  const score = (fields: [text: string, weight: number][]) => {
    const best = terms.map((t) => Math.max(0, ...fields.filter(([text]) => text.toLowerCase().includes(t)).map(([, w]) => w)));
    return best.includes(0) ? { score: 0, direct: false } : { score: best.reduce((a, b) => a + b, 0), direct: best.every((b) => b >= 3) };
  };
  // No search: one card per class. Searching: one card per matching car, labelled with its class ("suv" lists
  // every SUV; a word only in a description still finds the car, lower down), plus the classes that have no car
  // pages yet (coaches) when the class matches. Best matches first, otherwise in fleet order.
  const shown = fleet
    .filter((v) => filter === "all" || v.group === filter)
    .flatMap((v): Scored[] => {
      const classCars = carsIn(v.slug);
      if (terms.length === 0) return [{ kind: "class", v, score: 0, direct: true }];
      if (classCars.length === 0) return [{ kind: "class" as const, v, ...score([[v.name, 4], [v.text, 1]]) }];
      return classCars.map((car) => ({
        kind: "car" as const,
        car,
        v,
        ...score([[carName(car), 4], [`${car.brand} ${car.model} ${car.years ?? ""}`, 3], [v.name, 2], [car.text, 1], [v.text, 1]]),
      }));
    })
    .filter((r) => terms.length === 0 || r.score > 0)
    .sort((a, b) => b.score - a.score);
  // "rolls royce": the Ghost on top, then the cars that only mention it (the rest of the luxury class) under a
  // divider. When nothing matches by name (e.g. "wedding"), everything is shown together.
  const direct = shown.filter((r) => r.direct);
  const [top, more] = direct.length > 0 && direct.length < shown.length ? [direct, shown.filter((r) => !r.direct)] : [shown, []];

  const grid = (list: Result[], offset: number, spacing = "mt-10") => (
    <motion.div layout className={cn("grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-6 gap-y-10", spacing)}>
      <AnimatePresence mode="popLayout">
        {list.map((r, j) => {
          const i = offset + j;
          return (
            <motion.article
              key={r.kind === "car" ? `car-${r.car.slug}` : r.v.slug}
              id={r.kind === "class" ? r.v.slug : undefined}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: Math.min(i, 8) * 0.05 } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              className="group relative scroll-mt-28"
            >
              {r.kind === "car" ? <CarCard car={r.car} fleetClass={r.v} /> : <ClassCard v={r.v} priority={i < 3} />}
            </motion.article>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <>
      <div className="relative mb-6 max-w-[480px]">
        <label htmlFor="fleet-search" className="sr-only">
          Search the fleet
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
        <input
          id="fleet-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by brand or type"
          className="h-12 w-full border border-line bg-white pr-12 pl-11 text-base text-ink outline-none transition-colors hover:border-ink/40 focus:border-ink [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div role="group" aria-label="Filter the fleet" className="flex flex-wrap gap-2">
        {fleetGroups.map((g) => {
          const active = g.id === filter;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(g.id)}
              className={cn(
                "relative isolate h-11 px-5 text-[15px] font-medium transition-colors duration-300",
                active ? "text-cream" : "text-ink hover:bg-ink/5",
              )}
            >
              {active && (
                <motion.span
                  layoutId="fleet-tab"
                  className="absolute inset-0 -z-10 bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              {!active && <span aria-hidden="true" className="absolute inset-0 -z-10 border border-ink/25" />}
              {g.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status">
        {shown.length} {shown.length === 1 ? "vehicle" : "vehicles"} shown
      </p>
      {grid(top, 0)}
      {more.length > 0 && (
        <>
          <div className="mt-16 border-t border-ink/15 pt-8">
            <h2 className="font-serif text-[clamp(26px,3vw,32px)] leading-tight">You might also consider</h2>
          </div>
          {grid(more, top.length, "mt-8")}
        </>
      )}
      {shown.length === 0 && (
        <div className="mt-10 max-w-[560px]">
          <h2 className="font-serif text-[28px] leading-tight">Nothing matches &ldquo;{query.trim()}&rdquo;</h2>
          <p className="mt-3 text-[17px] text-muted">
            This page only shows our featured cars. Talk to us about the car you want and we&apos;ll tell you what we can
            arrange.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/contact?occasion=Other&notes=${encodeURIComponent(query.trim())}`}
              className="inline-flex min-h-11 items-center bg-ink px-6 text-[15px] font-semibold text-cream"
            >
              Ask about this car
            </Link>
            <a href={contact.whatsapp} className="inline-flex min-h-11 items-center px-2 text-[15px] font-semibold underline underline-offset-[6px]">
              Talk to us on WhatsApp
            </a>
          </div>
        </div>
      )}
      {shown.length > 0 && (
        <p className="mt-12 max-w-[560px] text-[15px] text-muted">
          These are our featured cars. Looking for something else? Talk to us and we&apos;ll tell you what we can
          arrange.{" "}
          <Link href="/contact" className="font-semibold text-ink underline underline-offset-[6px]">
            Talk to us
          </Link>
        </p>
      )}
    </>
  );
}

type Result = { kind: "class"; v: Vehicle } | { kind: "car"; car: Car; v: Vehicle };
type Scored = Result & { score: number; direct: boolean };

function ClassCard({ v, priority }: { v: Vehicle; priority: boolean }) {
  return (
    <>
      <div className={`relative flex aspect-[3/2] items-center justify-center overflow-hidden ${v.imageCutout ? "bg-sand" : "bg-stone"}`}>
        {v.image ? (
          <div className={`absolute inset-0 ${v.imageCutout ? "mix-blend-multiply" : ""}`} style={{ transform: v.imageZoom ? `scale(${v.imageZoom})` : undefined }}>
            <Photo
              src={v.image}
              alt={v.imageAlt ?? v.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 400px"
              className={v.imageCutout ? "card-roll object-contain p-5" : "card-zoom object-cover"}
            />
          </div>
        ) : (
          <span className="text-[15px]">
            <Confirm>photo</Confirm>
          </span>
        )}
        {v.image && v.imagePlaceholder && <IllustrativeTag />}
      </div>
      {/* The title link's ::after stretches over the whole card, so the photo opens the class too. A class
          without car pages yet (coaches) has no page; its card goes to the quote form instead. */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <h2 className="pt-1 font-serif text-[28px] leading-tight">
          {carsIn(v.slug).length > 0 ? (
            <Link
              href={`/fleet/${v.slug}`}
              className="card-name after:absolute after:inset-0"
            >
              {v.name}
            </Link>
          ) : (
            v.name
          )}
        </h2>
        {/* Above the card-wide link, like the car names. */}
        <ShareButton path={classHref(v.slug)} name={v.name} iconOnly className="relative z-10 -mr-3" />
      </div>
      <p className="mt-1.5 text-[15px] text-muted">{v.text}</p>
      {carsIn(v.slug).length > 0 ? (
        // Above the card-wide link (its ::after), so these stay clickable on their own.
        <ul className="relative z-10 mt-1 flex flex-wrap gap-x-5">
          {carsIn(v.slug).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/fleet/${c.slug}`}
                className="inline-flex min-h-11 items-center text-[15px] text-ink underline decoration-ink/30 underline-offset-[5px] transition-colors hover:decoration-ink"
              >
                {carTitle(c)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Link
          href={`/contact?vehicle=${encodeURIComponent(v.name)}`}
          className="mt-2 inline-flex min-h-11 items-center text-[15px] font-medium text-gold-deep underline decoration-transparent underline-offset-[5px] transition-colors duration-300 group-hover:decoration-gold-deep after:absolute after:inset-0"
        >
          Ask for a quote<span className="sr-only">: {v.name}</span>
        </Link>
      )}
    </>
  );
}

/** A search result: one car, with its class underneath (same card as on the class pages). */
function CarCard({ car, fleetClass }: { car: Car; fleetClass: Vehicle }) {
  const photo = car.photos[0];
  const name = carName(car);
  return (
    <>
      <div className={cn("relative flex aspect-[3/2] items-center justify-center overflow-hidden", photo?.cutout ? "bg-sand" : "bg-stone")}>
        {photo ? (
          // The multiply sits on this wrapper: a scaled (zoomed) element is its own stacking context.
          <div
            className={cn("absolute inset-0", photo.cutout && "mix-blend-multiply")}
            style={{ transform: photo.zoom ? `scale(${photo.zoom})` : undefined }}
          >
            <Photo
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={cn(
                photo.cutout ? "card-roll" : "card-zoom",
                photo.cutout ? "object-contain p-5" : photo.portrait ? "object-contain" : "object-cover",
              )}
              style={{ objectPosition: photo.position }}
            />
          </div>
        ) : (
          <span className="text-[15px]">
            <Confirm>photo</Confirm>
          </span>
        )}
        {photo?.placeholder && <IllustrativeTag />}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h2 className="pt-1 font-serif text-[28px] leading-tight">
          {/* The ::after stretches the link over the whole card, so the photo opens the car too. */}
          <Link
            href={`/fleet/${car.slug}`}
            className="card-name after:absolute after:inset-0"
          >
            {name}
          </Link>
        </h2>
        <ShareButton path={`/fleet/${car.slug}`} name={carTitle(car)} iconOnly className="relative z-10 -mr-3" />
      </div>
      <p className="flex flex-wrap items-center gap-x-2 text-[15px] text-muted">
        {car.years && (
          <>
            <span>{carYears(car)}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        {/* Above the card-wide link, so the class opens on its own. */}
        <Link
          href={classHref(fleetClass.slug)}
          className="relative z-10 inline-flex min-h-11 items-center underline decoration-ink/20 underline-offset-[5px] transition-colors hover:text-ink hover:decoration-ink"
        >
          {fleetClass.name}
        </Link>
      </p>
    </>
  );
}
