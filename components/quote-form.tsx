"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cityOptions, fleet, occasions, otherCity } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const NOT_SURE = "Not sure — recommend one";
const OTHER_VEHICLE = "Other";
const OTHER_OCCASION = "Other";

/**
 * Quote request form. Pre-fills from the booking bar's query params.
 * TODO(client): `submit` only shows a thank-you state. Wire it to email /
 * WhatsApp / a form service before launch (see CLAUDE.md, "Open items").
 */
export function QuoteForm() {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);
  const [occasion, setOccasion] = useState(params.get("occasion") ?? "");
  const [vehicle, setVehicle] = useState(params.get("vehicle") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const occasionOther = useRef<HTMLInputElement>(null);
  const vehicleOther = useRef<HTMLInputElement>(null);
  const cityOther = useRef<HTMLInputElement>(null);
  const justPicked = useRef("");

  function pick(set: (v: string) => void, v: string) {
    justPicked.current = v;
    set(v);
  }
  // When "Other" was just picked, send focus to its text box instead of back to the dropdown.
  function focusOther(e: Event, other: string, ref: React.RefObject<HTMLInputElement | null>) {
    if (justPicked.current === other && ref.current) {
      e.preventDefault();
      ref.current.focus();
    }
    justPicked.current = "";
  }

  const inputClass =
    "h-12 w-full border-b border-white/30 bg-transparent text-[17px] text-cream outline-none transition-colors placeholder:text-muted-dark hover:border-white/60 focus:border-gold";

  return (
    <div className="relative min-h-[560px]">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex min-h-[560px] flex-col justify-center gap-4"
            role="status"
          >
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Thank you. We&apos;ll call you shortly.</h2>
            <p className="max-w-sm text-[#cfcac0]">Our team will confirm the vehicle, timing and price.</p>
            <Button type="button" variant="outlineLight" className="mt-4 self-start" onClick={() => setSent(false)}>
              Send another enquiry
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            aria-label="Quote request"
            className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-7"
          >
            <DarkField label="Full name" id="q-name">
              <input id="q-name" name="name" required autoComplete="name" className={inputClass} />
            </DarkField>
            <DarkField label="Phone" id="q-phone">
              <input id="q-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
            </DarkField>
            <DarkField label="Occasion" id="q-occasion">
              <Select value={occasion} onValueChange={(v) => pick(setOccasion, v)} name="occasion">
                <SelectTrigger id="q-occasion" tone="dark">
                  <SelectValue placeholder="Choose an occasion" />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => focusOther(e, OTHER_OCCASION, occasionOther)}>
                  {occasions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <OtherField
                show={occasion === OTHER_OCCASION}
                inputRef={occasionOther}
                id="q-occasion-other"
                name="occasionOther"
                label="What's the occasion?"
                className={inputClass}
              />
            </DarkField>
            <DarkField label="Vehicle" id="q-vehicle">
              <Select value={vehicle} onValueChange={(v) => pick(setVehicle, v)} name="vehicle">
                <SelectTrigger id="q-vehicle" tone="dark">
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => focusOther(e, OTHER_VEHICLE, vehicleOther)}>
                  <SelectItem value={NOT_SURE}>{NOT_SURE}</SelectItem>
                  {fleet.map((v) => (
                    <SelectItem key={v.slug} value={v.name}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_VEHICLE}>{OTHER_VEHICLE}</SelectItem>
                </SelectContent>
              </Select>
              <OtherField
                show={vehicle === OTHER_VEHICLE}
                inputRef={vehicleOther}
                id="q-vehicle-other"
                name="vehicleOther"
                label="Which vehicle are you looking for?"
                className={inputClass}
              />
            </DarkField>
            <DarkField label="City" id="q-city">
              <Select value={city} onValueChange={(v) => pick(setCity, v)} name="city">
                <SelectTrigger id="q-city" tone="dark">
                  <SelectValue placeholder="Choose a city" />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => focusOther(e, otherCity, cityOther)}>
                  {cityOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <OtherField
                show={city === otherCity}
                inputRef={cityOther}
                id="q-city-other"
                name="cityOther"
                label="Which city or town?"
                className={inputClass}
              />
            </DarkField>
            <DarkField label="Date" id="q-date">
              <input
                id="q-date"
                name="date"
                type="date"
                defaultValue={params.get("date") ?? ""}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </DarkField>
            <div className="col-span-full">
              <DarkField label="Anything else" id="q-notes">
                <textarea
                  id="q-notes"
                  name="notes"
                  defaultValue={params.get("notes") ? `I'm looking for: ${params.get("notes")}` : ""}
                  rows={4}
                  className="w-full resize-y border border-white/30 bg-transparent p-3 text-base text-cream outline-none transition-colors hover:border-white/60 focus:border-gold"
                />
              </DarkField>
            </div>
            <Button type="submit" variant="gold" className="col-span-full h-14">
              Request a quote
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function DarkField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-muted-dark">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Text box that slides open under a dropdown when "Other" is chosen. */
function OtherField({
  show,
  inputRef,
  id,
  name,
  label,
  className,
}: {
  show: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  id: string;
  name: string;
  label: string;
  className: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="overflow-hidden"
        >
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <input ref={inputRef} id={id} name={name} placeholder={label} className={`${className} mt-1`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
