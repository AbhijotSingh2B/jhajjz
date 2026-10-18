"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { carColours, carName, carTitle, carYears, cars, carsInClass, cityOptions, fleet, occasions, otherCity } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DateInput } from "@/components/date-input";
import { ContactDialog } from "@/components/contact-dialog";

const NOT_SURE = "Not sure";
const OTHER_VEHICLE = "Other";
const OTHER_OCCASION = "Other";
const ANY_CAR = "No preference";
const OTHER_CAR = "Other";

/**
 * Quote request form. Pre-fills from the booking bar's query params.
 * Submitting opens the WhatsApp popup with the details already written, so the
 * visitor sends them in the chat. Nothing is stored on a server.
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
  // The exact car, by slug (car pages link here with ?car=<slug>), or OTHER_CAR to type it in. Optional; "" = none.
  const [car, setCar] = useState(() => (cars.some((c) => c.slug === params.get("car")) ? params.get("car")! : ""));
  const [city, setCity] = useState(pick("city", cityOptions));
  const vehicleClass = fleet.find((v) => v.name === vehicle);
  // Cars in the chosen class; all cars when no class (or "Not sure"/"Other") is chosen.
  const carOptions = vehicleClass && carsInClass(vehicleClass.slug).length > 0 ? carsInClass(vehicleClass.slug) : cars;
  const chosenCar = cars.find((c) => c.slug === car);
  // Colour picked on the car page (?colour=White), kept only while that car is chosen and has the colour.
  const colourParam = params.get("colour") ?? "";
  const colour = chosenCar && carColours(chosenCar.photos).includes(colourParam) ? colourParam : "";
  // "Other" in both dropdowns needs only one text box: the vehicle one ("Which vehicle are you looking for?").
  const bothOther = vehicle === OTHER_VEHICLE && car === OTHER_CAR;

  const occasionOther = useRef<HTMLInputElement>(null);
  const vehicleOther = useRef<HTMLInputElement>(null);
  const carOther = useRef<HTMLInputElement>(null);
  const cityOther = useRef<HTMLInputElement>(null);
  const justPicked = useRef("");

  function choose(set: (v: string) => void, v: string) {
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
    <div className="relative">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              // Trimmed, so a stray space doesn't end up in the message (or a box of spaces as a value).
              const get = (key: string) => String(f.get(key) ?? "").trim();
              const line = (label: string, v: string) => (v ? `${label}: ${v}` : "");
              // "Other" plus whatever the visitor typed in its box, e.g. "Other (Amritsar)".
              const withOther = (v: string, other: string, key: string) => (v === other && get(key) ? `${v} (${get(key)})` : v);
              setMessage(
                [
                  "Hello Jhajj'z, I'd like a quote.",
                  line("Name", get("name")),
                  line("Phone", get("phone")),
                  line("Occasion", withOther(occasion, OTHER_OCCASION, "occasionOther")),
                  line("Vehicle", withOther(vehicle, OTHER_VEHICLE, "vehicleOther")),
                  line("Exact vehicle", chosenCar ? carTitle(chosenCar) + (colour ? ` (${colour.toLowerCase()})` : "") : car === OTHER_CAR && !bothOther ? get("carOther") || OTHER_CAR : ""),
                  line("City", withOther(city, otherCity, "cityOther")),
                  line("Date", formatDate(get("date"))),
                  line("Notes", get("notes")),
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
              <input id="q-name" name="name" required pattern=".*\S.*" title="Please enter your name" autoComplete="name" className={inputClass} />
            </DarkField>
            <DarkField label="Phone (optional)" id="q-phone">
              <input id="q-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
            </DarkField>
            <DarkField label="Occasion" id="q-occasion">
              <Select value={occasion} onValueChange={(v) => choose(setOccasion, v)} name="occasion">
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
              <Select
                value={vehicle}
                onValueChange={(v) => {
                  choose(setVehicle, v);
                  // Drop an exact car that isn't in the newly chosen class.
                  const cls = fleet.find((f) => f.name === v);
                  if (cls && chosenCar && chosenCar.fleetClass !== cls.slug && carsInClass(cls.slug).length > 0) setCar("");
                }}
                name="vehicle"
              >
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
            <DarkField label="Exact vehicle (optional)" id="q-car">
              <Select
                value={car}
                onValueChange={(v) => {
                  const picked = cars.find((c) => c.slug === v);
                  choose(setCar, picked || v === OTHER_CAR ? v : "");
                  // Picking a car fills in its class when none (or "Not sure") was chosen.
                  const cls = picked && fleet.find((f) => f.slug === picked.fleetClass);
                  if (cls && (vehicle === "" || vehicle === NOT_SURE)) setVehicle(cls.name);
                }}
              >
                <SelectTrigger id="q-car" tone="dark">
                  <SelectValue placeholder={ANY_CAR} />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => focusOther(e, OTHER_CAR, vehicle === OTHER_VEHICLE ? vehicleOther : carOther)}>
                  <SelectItem value={ANY_CAR}>{ANY_CAR}</SelectItem>
                  {carOptions.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {carName(c)}
                      {c.years && <span className="ml-2 opacity-60">{carYears(c)}</span>}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_CAR}>{OTHER_CAR}</SelectItem>
                </SelectContent>
              </Select>
              {colour && <p className="mt-2 text-[15px] text-on-dark-strong">Colour: {colour}</p>}
              <OtherField
                show={car === OTHER_CAR && !bothOther}
                inputRef={carOther}
                id="q-car-other"
                name="carOther"
                label="Make, model, colour or year"
                className={inputClass}
              />
            </DarkField>
            <DarkField label="City" id="q-city">
              <Select value={city} onValueChange={(v) => choose(setCity, v)} name="city">
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
              <DateInput
                id="q-date"
                name="date"
                defaultValue={params.get("date") ?? ""}
                className={`${inputClass} [color-scheme:dark]`}
                textClassName="text-[17px] text-cream"
                placeholderClassName="text-muted-dark"
                clearClassName="right-0 text-muted-dark hover:text-cream"
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
              Next, your details open in a WhatsApp chat with us, ready to send.
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
