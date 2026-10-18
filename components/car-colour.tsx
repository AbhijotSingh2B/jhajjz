"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/contact-dialog";
import { cn } from "@/lib/utils";

/**
 * Colour choice on a car page, for cars the client has in more than one colour (`colour` on the photos). The picker
 * sits above the quote buttons (Nirmal); the photos show the chosen colour, and the quote and "Talk to us" message
 * carry it. "" = All: every photo, no colour in the quote.
 */
const ColourContext = createContext<{ colour: string; setColour: (c: string) => void }>({ colour: "", setColour: () => {} });

export const useCarColour = () => useContext(ColourContext).colour;

export function CarColourProvider({ children }: { children: ReactNode }) {
  const [colour, setColour] = useState("");
  return <ColourContext.Provider value={{ colour, setColour }}>{children}</ColourContext.Provider>;
}

export function ColourPicker({ colours }: { colours: string[] }) {
  const { colour, setColour } = useContext(ColourContext);
  if (colours.length === 0) return null;
  return (
    <div role="radiogroup" aria-label="Colour" className="mt-8 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-[15px] text-muted">Colour</span>
      {["", ...colours].map((c) => {
        const active = c === colour;
        return (
          <button
            key={c || "all"}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setColour(c)}
            className={cn(
              "h-11 border px-5 text-[15px] font-medium transition-colors duration-300",
              active ? "border-ink bg-ink text-cream" : "border-ink/25 text-ink hover:bg-ink/5",
            )}
          >
            {c || "All"}
          </button>
        );
      })}
    </div>
  );
}

/** "Ask for a quote" (to the form, with the car and any chosen colour) and "Talk to us". */
export function CarQuoteButtons({ params, title }: { params: Record<string, string>; title: string }) {
  const colour = useCarColour();
  const query = new URLSearchParams({ ...params, ...(colour && { colour }) });
  const what = colour ? `${title} in ${colour.toLowerCase()}` : title;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button asChild variant="ink">
        <Link href={`/contact?${query}`}>Ask for a quote</Link>
      </Button>
      <ContactDialog channel="all" message={`Hello, I'd like to ask about the ${what}.`}>
        <Button type="button" variant="outline">
          Talk to us
        </Button>
      </ContactDialog>
    </div>
  );
}
