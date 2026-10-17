"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { cityOptions, fleet, occasions } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { minToday } from "@/lib/utils";
import { ContactDialog } from "@/components/contact-dialog";

const NOT_SURE = "Not sure — recommend one";
const OTHER_VEHICLE = "Other";

/**
 * Quote request form. Pre-fills from the booking bar's query params.
 * Submitting opens the WhatsApp popup with the details already written, so the
 * visitor picks a number and sends them. Nothing is stored on a server.
 */
export function QuoteForm() {
  const params = useSearchParams();
  const pick = (key: string, allowed: string[]) => {
    const v = params.get(key) ?? "";
    return allowed.includes(v) ? v : "";
  };
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [occasion, setOccasion] = useState(pick("occasion", occasions));
  const [vehicle, setVehicle] = useState(pick("vehicle", [NOT_SURE, OTHER_VEHICLE, ...fleet.map((v) => v.name)]));
  const [city, setCity] = useState(pick("city", cityOptions));

  const inputClass =
    "h-12 w-full border-b border-white/30 bg-transparent text-[17px] text-cream outline-none transition-colors placeholder:text-muted-dark hover:border-white/60 focus:border-gold";

  return (
    <div className="relative">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const line = (label: string, v: FormDataEntryValue | null) => (v ? `${label}: ${v}` : "");
              setMessage(
                [
                  "Hello Jhajj'z, I'd like a quote.",
                  line("Name", f.get("name")),
                  line("Phone", f.get("phone")),
                  line("Occasion", occasion),
                  line("Vehicle", vehicle),
                  line("City", city),
                  line("Date", f.get("date")),
                  line("Notes", f.get("notes")),
                ]
                  .filter(Boolean)
                  .join("\n"),
              );
              setOpen(true);
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
              <Select value={occasion} onValueChange={setOccasion} name="occasion">
                <SelectTrigger id="q-occasion" tone="dark">
                  <SelectValue placeholder="Choose an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DarkField>
            <DarkField label="Vehicle" id="q-vehicle">
              <Select value={vehicle} onValueChange={setVehicle} name="vehicle">
                <SelectTrigger id="q-vehicle" tone="dark">
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NOT_SURE}>{NOT_SURE}</SelectItem>
                  {fleet.map((v) => (
                    <SelectItem key={v.slug} value={v.name}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_VEHICLE}>{OTHER_VEHICLE}</SelectItem>
                </SelectContent>
              </Select>
            </DarkField>
            <DarkField label="City" id="q-city">
              <Select value={city} onValueChange={setCity} name="city">
                <SelectTrigger id="q-city" tone="dark">
                  <SelectValue placeholder="Choose a city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DarkField>
            <DarkField label="Date" id="q-date">
              <input
                id="q-date"
                name="date"
                type="date"
                defaultValue={params.get("date") ?? ""}
                ref={minToday}
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
            <p className="col-span-full -mt-2 text-[14px] text-muted-dark">
              Next you&apos;ll choose a number to send these details to on WhatsApp.
            </p>
          </motion.form>
      <ContactDialog channel="whatsapp" open={open} onOpenChange={setOpen} message={message} />
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
