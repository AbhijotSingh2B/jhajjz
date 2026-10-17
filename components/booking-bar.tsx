"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cityOptions, occasions } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn, minToday } from "@/lib/utils";

/** Short quote starter under the hero. Hands its choices to /contact as query params. */
export function BookingBar() {
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Only pass on what the visitor actually chose; the quote form shows empty fields for the rest.
    const q = new URLSearchParams(Object.entries({ occasion, city, date }).filter(([, v]) => v));
    router.push(q.size ? `/contact?${q.toString()}` : "/contact");
  }

  return (
    <form
      onSubmit={submit}
      aria-label="Start a quote"
      className="mx-auto grid max-w-[1200px] grid-cols-2 items-end gap-4 px-6 py-6 md:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <Field label="Occasion" id="bb-occasion">
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger id="bb-occasion">
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
      </Field>
      <Field label="City" id="bb-city">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger id="bb-city">
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
      </Field>
      <Field label="Date" id="bb-date" className="col-span-2 md:col-span-1">
        <input
          id="bb-date"
          type="date"
          ref={minToday}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 w-full border border-line bg-white px-3 text-base text-ink transition-colors outline-none hover:border-ink/40 focus:border-ink"
        />
      </Field>
      <Button type="submit" variant="ink" size="default" className="col-span-2 md:col-span-1">
        Start a quote
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  className,
  children,
}: {
  label: string;
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
