"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { carName, cars, contact, fleet, fleetGroups, type FleetGroup } from "@/lib/site";
import { Confirm } from "@/components/confirm";

const ease = [0.2, 0.7, 0.2, 1] as const;

const carsIn = (slug: string) => cars.filter((c) => c.fleetClass === slug);

export function FleetBrowser() {
  const [filter, setFilter] = useState<"all" | FleetGroup>("all");
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = fleet.filter(
    (v) =>
      (filter === "all" || v.group === filter) &&
      terms.every((t) => `${v.name} ${v.text} ${carsIn(v.slug).map(carName).join(" ")}`.toLowerCase().includes(t)),
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
          placeholder="Search by brand or type, e.g. Rolls-Royce"
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
      <div role="tablist" aria-label="Filter the fleet" className="flex flex-wrap gap-2">
        {fleetGroups.map((g) => {
          const active = g.id === filter;
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={active}
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
      <motion.div layout className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-6 gap-y-10">
        <AnimatePresence mode="popLayout">
          {shown.map((v, i) => (
            <motion.article
              key={v.slug}
              id={v.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.05 } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              className="group relative scroll-mt-28"
            >
              <div className={`relative flex aspect-[3/2] items-center justify-center overflow-hidden ${v.imageCutout ? "bg-sand" : "bg-stone"}`}>
                {v.image ? (
                  <div className={`absolute inset-0 ${v.imageCutout ? "mix-blend-multiply" : ""}`} style={{ transform: v.imageZoom ? `scale(${v.imageZoom})` : undefined }}>
                    <Image
                      src={v.image}
                      alt={v.imageAlt ?? v.name}
                      fill
                      priority={i < 3}
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={`transition-transform duration-700 ease-out group-hover:scale-[1.03] ${v.imageCutout ? "object-contain p-5" : "object-cover"}`}
                    />
                  </div>
                ) : (
                  <span className="text-[15px]">
                    <Confirm>photo</Confirm>
                  </span>
                )}
              </div>
              <h2 className="mt-4 font-serif text-[28px] leading-tight">{v.name}</h2>
              <p className="mt-1.5 text-[15px] text-muted">{v.text}</p>
              {carsIn(v.slug).length > 0 && (
                // Above the card-wide quote link (its ::after), so these stay clickable on their own.
                <ul className="relative z-10 mt-1 flex flex-wrap gap-x-5">
                  {carsIn(v.slug).map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/fleet/${c.slug}`}
                        className="inline-flex min-h-11 items-center text-[15px] text-ink underline decoration-ink/30 underline-offset-[5px] transition-colors hover:decoration-ink"
                      >
                        {carName(c)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {/* The ::after stretches the link over the whole card, so the photo is clickable too. */}
              <Link
                href={`/contact?vehicle=${encodeURIComponent(v.name)}`}
                className="mt-3 inline-flex min-h-11 items-center text-[15px] font-medium text-gold-deep underline decoration-transparent underline-offset-[5px] transition-colors duration-300 group-hover:decoration-gold-deep after:absolute after:inset-0"
              >
                Ask for a quote<span className="sr-only">: {v.name}</span>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
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
