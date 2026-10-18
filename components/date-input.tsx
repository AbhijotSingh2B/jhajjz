"use client";

import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn, formatDate, minToday } from "@/lib/utils";

/**
 * Date field that always reads dd/mm/yyyy. Browsers show <input type="date"> in their own locale (Chrome set to
 * US English shows mm/dd/yyyy), so the input's text is hidden (`.date-input` in globals.css) and the date is written
 * over it. The native picker stays: tapping opens it on phones, and a click anywhere opens it on desktop.
 * The × clears it, since the Reset button in the iPhone picker does nothing (Nirmal).
 *
 * Where there's no calendar to pick from (TV browsers, old browsers), it becomes Day / Month / Year dropdowns
 * instead, which a remote can work. See `needsFallback`.
 */
export function DateInput({
  id,
  name,
  defaultValue = "",
  onChange,
  className,
  textClassName,
  placeholderClassName,
  clearClassName,
}: {
  id: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** The input's box: size, border, padding. */
  className?: string;
  /** The written date: same padding and font as the input, plus its colour. */
  textClassName?: string;
  placeholderClassName?: string;
  /** The clear button's colour and right offset. */
  clearClassName?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const fallback = useSyncExternalStore(noSubscribe, needsFallback, () => false);
  const update = (v: string) => {
    setValue(v);
    onChange?.(v);
  };
  if (fallback) return <DateSelects id={id} name={name} value={value} onChange={update} className={className} placeholderClassName={placeholderClassName} />;
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="date"
        ref={minToday}
        value={value}
        onChange={(e) => update(e.target.value)}
        onClick={(e) => {
          if (matchMedia("(pointer: coarse)").matches) return;
          try {
            e.currentTarget.showPicker();
          } catch {}
        }}
        className={cn("date-input", className, "pr-12")}
      />
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-y-0 left-0 flex items-center", textClassName, !value && placeholderClassName)}
      >
        {value ? formatDate(value) : "dd/mm/yyyy"}
      </span>
      {value && (
        <button
          type="button"
          onClick={() => update("")}
          aria-label="Clear date"
          className={cn(
            "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center transition-colors",
            clearClassName,
          )}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

const noSubscribe = () => () => {};

/**
 * No date input at all (the browser shows a plain text box), or no calendar: a computer browser without
 * `showPicker` (TV browsers, which run old Chromium builds, and browsers from before 2022). Phones and tablets
 * (coarse pointer) always have their own picker, even on older versions.
 */
function needsFallback() {
  const test = document.createElement("input");
  test.type = "date";
  if (test.type !== "date") return true;
  return !("showPicker" in HTMLInputElement.prototype) && !matchMedia("(pointer: coarse)").matches;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Day / Month / Year dropdowns in the same box style; the form still gets one "yyyy-mm-dd" value (hidden input). */
function DateSelects({
  id,
  name,
  value,
  onChange,
  className,
  placeholderClassName,
}: {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholderClassName?: string;
}) {
  // Kept separately so a half-picked date (day and month, no year yet) isn't lost; the value is set once all three are.
  const [initY, initM, initD] = value ? value.split("-") : ["", "", ""];
  const [parts, setParts] = useState({ d: initD, m: initM, y: initY });
  const thisYear = new Date().getFullYear();
  const years = [thisYear, thisYear + 1, thisYear + 2].map(String);
  const daysInMonth = parts.m ? new Date(Number(parts.y || thisYear), Number(parts.m), 0).getDate() : 31;

  function set(key: "d" | "m" | "y", v: string) {
    const next = { ...parts, [key]: v };
    // 31 doesn't exist in every month: drop the day if the new month or year is too short for it.
    if (next.d && next.m && Number(next.d) > new Date(Number(next.y || thisYear), Number(next.m), 0).getDate()) next.d = "";
    setParts(next);
    onChange(next.d && next.m && next.y ? `${next.y}-${next.m}-${next.d}` : "");
  }

  // Greyed like a placeholder until picked.
  const select = (v: string) => cn(className, "min-w-0 appearance-auto px-2", !v && placeholderClassName);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1.3fr)] gap-2">
      <select id={id} aria-label="Day" value={parts.d} onChange={(e) => set("d", e.target.value)} className={select(parts.d)}>
        <option value="">Day</option>
        {Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
          <option key={d} value={d}>
            {Number(d)}
          </option>
        ))}
      </select>
      <select aria-label="Month" value={parts.m} onChange={(e) => set("m", e.target.value)} className={select(parts.m)}>
        <option value="">Month</option>
        {months.map((label, i) => (
          <option key={label} value={String(i + 1).padStart(2, "0")}>
            {label}
          </option>
        ))}
      </select>
      <select aria-label="Year" value={parts.y} onChange={(e) => set("y", e.target.value)} className={select(parts.y)}>
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
