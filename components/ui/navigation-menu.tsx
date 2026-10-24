"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationMenu({
  className,
  viewportClassName,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  /** Where the dropdown sits; by default under the menu's left edge. */
  viewportClassName?: string;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative z-20 flex items-center", className)}
      {...props}
    >
      {children}
      <div className={cn("absolute top-full left-0 flex justify-start pt-3", viewportClassName)}>
        <NavigationMenuPrimitive.Viewport
          className={cn(
            "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) overflow-hidden",
            "border border-line bg-cream text-ink shadow-[0_24px_60px_-20px_rgba(21,21,20,0.45)]",
            "origin-top transition-[width,height] duration-300 ease-out",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "duration-200",
          )}
        />
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List className={cn("flex list-none items-center gap-1", className)} {...props} />;
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn("group inline-flex h-11 items-center gap-1.5 px-3 text-[15px] transition-colors", className)}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 opacity-70 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "top-0 left-0 w-full md:absolute md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8",
        "data-[motion=to-end]:slide-out-to-right-8 data-[motion=to-start]:slide-out-to-left-8",
        "duration-300 ease-out",
        className,
      )}
      {...props}
    />
  );
}

export const NavigationMenuLink = NavigationMenuPrimitive.Link;
