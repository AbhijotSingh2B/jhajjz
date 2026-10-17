"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shares a page on this site: the phone's own share sheet where there is one (iPhone, Android), otherwise copies
 * the link and says so. `path` is resolved against the current host, so preview links stay on the preview.
 * `name` is what's shared, e.g. "SUVs" (shared as "SUVs | Jhajj'z").
 * `iconOnly` is the quiet version for card titles: a 44px icon button, "Link copied" appears beside it.
 */
export function ShareButton({
  path,
  name,
  iconOnly = false,
  className,
}: {
  path: string;
  name: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const title = `${name} | Jhajj'z`;

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Closing the share sheet rejects; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={share}
        aria-label={`Share ${name}`}
        className={cn("relative flex size-11 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink", className)}
      >
        {copied ? <Check className="size-[18px] text-gold-deep" aria-hidden="true" /> : <Share2 className="size-[18px]" aria-hidden="true" />}
        <span aria-live="polite" className={cn("absolute right-full bg-paper pl-2 text-[13px] whitespace-nowrap text-gold-deep", !copied && "sr-only")}>
          {copied ? "Link copied" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-[5px] transition-colors hover:decoration-ink",
        className,
      )}
    >
      {copied ? <Check className="size-4 text-gold-deep" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      {!copied && <span className="sr-only">{name}</span>}
    </button>
  );
}
