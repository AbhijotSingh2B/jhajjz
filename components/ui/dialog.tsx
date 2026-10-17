"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

/** Bottom sheet on phones, centred card from `sm` up. */
export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-ink/60 backdrop-blur-[3px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300",
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[90svh] overflow-y-auto bg-paper text-ink shadow-[0_-24px_60px_rgba(0,0,0,0.25)] outline-none",
          "pb-[env(safe-area-inset-bottom)]",
          "sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[min(520px,calc(100vw-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0 sm:shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
          "ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=closed]:animate-out data-[state=closed]:duration-200",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:data-[state=open]:fade-in-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-4",
          "sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:slide-out-to-bottom-2",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-3 right-3 flex size-11 items-center justify-center text-muted transition-[color,transform] duration-300 hover:rotate-90 hover:text-ink"
          aria-label="Close"
        >
          <X className="size-5" aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
