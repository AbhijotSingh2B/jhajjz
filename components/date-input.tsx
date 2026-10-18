"use client";

import { useState } from "react";
import { cn, formatDate, minToday } from "@/lib/utils";

/**
 * Date field that always reads dd/mm/yyyy. Browsers show <input type="date"> in their own locale (Chrome set to
 * US English shows mm/dd/yyyy), so the input's text is hidden (`.date-input` in globals.css) and the date is written
 * over it. The native picker stays: tapping opens it on phones, and a click anywhere opens it on desktop.
 */
export function DateInput({
  id,
  name,
  defaultValue = "",
  onChange,
  className,
  textClassName,
  placeholderClassName,
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
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="date"
        ref={minToday}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onClick={(e) => {
          if (matchMedia("(pointer: coarse)").matches) return;
          try {
            e.currentTarget.showPicker();
          } catch {}
        }}
        className={cn("date-input", className)}
      />
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-y-0 left-0 flex items-center", textClassName, !value && placeholderClassName)}
      >
        {value ? formatDate(value) : "dd/mm/yyyy"}
      </span>
    </div>
  );
}
