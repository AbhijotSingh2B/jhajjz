"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shares a page on this site: the phone's own share sheet where there is one (iPhone, Android), otherwise copies
 * the link and says so. `path` is resolved against the current host, so preview links stay on the preview.
 */
export function ShareButton({ path, title, className }: { path: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

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
      {!copied && <span className="sr-only">{title}</span>}
    </button>
  );
}
