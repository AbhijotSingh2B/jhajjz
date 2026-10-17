"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cities, fleet, occasions } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/** Quick availability check under the hero. Hands its choices to /contact as query params. */
export function BookingBar() {
  const router = useRouter();
  const [occasion, setOccasion] = useState(occasions[0]);
  const [city, setCity] = useState(cities[0]);
  const [vehicle, setVehicle] = useState(fleet[0].name);
  const [date, setDate] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ occasion, city, vehicle, ...(date ? { date } : {}) });
    router.push(`/contact?${q.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      aria-label="Check availability"
      className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] items-end gap-4 px-6 py-6"
    >
      <Field label="Occasion" id="bb-occasion">
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger id="bb-occasion">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {occasions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="City" id="bb-city">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger id="bb-city">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Date" id="bb-date">
        <input
          id="bb-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 w-full border border-line bg-white px-3 text-base text-ink transition-colors outline-none hover:border-ink/40 focus:border-ink"
        />
      </Field>
      <Field label="Vehicle" id="bb-vehicle">
        <Select value={vehicle} onValueChange={setVehicle}>
          <SelectTrigger id="bb-vehicle">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fleet.map((v) => (
              <SelectItem key={v.slug} value={v.name}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button type="submit" variant="ink" size="default">
        Check availability
      </Button>
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
