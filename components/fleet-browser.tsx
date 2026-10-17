"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { fleet, fleetGroups, type FleetGroup } from "@/lib/site";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function FleetBrowser() {
  const [filter, setFilter] = useState<"all" | FleetGroup>("all");
  const shown = fleet.filter((v) => filter === "all" || v.group === filter);

  return (
    <>
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
              <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                <Image
                  src={v.image}
                  alt={v.imageAlt}
                  fill
                  priority={i < 3}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover saturate-[0.85] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100"
                />
              </div>
              <h2 className="mt-4 font-serif text-[28px] leading-tight">{v.name}</h2>
              <p className="mt-1.5 text-[15px] text-muted">{v.text}</p>
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
    </>
  );
}
