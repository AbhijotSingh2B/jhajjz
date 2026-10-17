"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Mail, Menu, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { classHref, contact, fleet, heroThumb } from "@/lib/site";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ContactDialog } from "@/components/contact-dialog";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const links = [
  { label: "Weddings", href: "/#weddings" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Next skips the navigation when you're already on "/", so a click on the logo
 * or Home (e.g. after jumping to #about) would do nothing: scroll back up instead.
 * Smooth scrolling and its reduced-motion opt-out come from globals.css.
 */
function scrollHomeToTop(e: MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/") return;
  e.preventDefault();
  if (window.location.hash) history.replaceState(history.state, "", "/");
  window.scrollTo({ top: 0 });
}

/**
 * `overlay` = sits transparent on top of a hero photo until the visitor
 * scrolls, then turns solid. Other pages get the solid bar straight away.
 */
/** Every page renders its own header, so this keeps the logo opening to the first page of a visit. */
let logoIntroPlayed = false;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [logoIntro] = useState(() => !logoIntroPlayed);
  const pathname = usePathname();

  useEffect(() => {
    logoIntroPlayed = true;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overlay || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 text-cream transition-[background-color,box-shadow,backdrop-filter] duration-500",
        solid ? "bg-ink/92 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 transition-[height] duration-500",
          solid ? "h-[72px]" : "h-[88px]",
        )}
      >
        <Link
          href="/"
          onClick={scrollHomeToTop}
          aria-label="Jhajj'z home"
          className="font-serif text-[26px] leading-none tracking-tight"
        >
          <Logo animated={logoIntro} />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavItem href="/" label="Home" active={pathname === "/"} />
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "text-cream/85 hover:text-cream data-[state=open]:text-cream",
                    pathname === "/fleet" && "text-cream",
                  )}
                >
                  Fleet
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <FleetMenu />
                </NavigationMenuContent>
              </NavigationMenuItem>
              {links.map((l) => (
                <NavItem key={l.href} href={l.href} label={l.label} active={pathname === l.href} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ContactDialog channel="call">
            <button
              type="button"
              className="ml-4 inline-flex h-11 items-center gap-2 text-[15px] font-medium text-cream transition-colors hover:text-gold"
            >
              <Phone className="size-4" aria-hidden="true" />
              {contact.phones[0].label}
            </button>
          </ContactDialog>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild active={active}>
        <Link
          href={href}
          onClick={href === "/" ? scrollHomeToTop : undefined}
          className="group relative inline-flex h-11 items-center px-3 text-[15px] text-cream/85 transition-colors hover:text-cream data-[active]:text-cream"
        >
          {label}
          <span
            aria-hidden="true"
            className="absolute inset-x-3 bottom-2 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100 group-data-[active]:scale-x-100"
          />
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function FleetMenu() {
  return (
    <div className="grid w-[min(760px,92vw)] grid-cols-[1.2fr_1fr]">
      <ul className="grid grid-cols-2 gap-x-2 p-4">
        {fleet.map((v, i) => (
          <motion.li
            key={v.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <NavigationMenuLink asChild>
              <Link
                href={classHref(v.slug)}
                className="group flex min-h-11 flex-col justify-center px-3 py-2.5 transition-colors duration-200 hover:bg-sand"
              >
                <span className="flex items-center justify-between text-[15px] font-semibold">
                  {v.name}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
              </Link>
            </NavigationMenuLink>
          </motion.li>
        ))}
      </ul>
      <NavigationMenuLink asChild>
        <Link href="/fleet" className="group relative block min-h-[280px] overflow-hidden bg-ink">
          <Image
            src={heroThumb}
            alt=""
            fill
            sizes="320px"
            className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" aria-hidden="true" />
          <span className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <span className="block font-serif text-2xl">See the full fleet</span>
            <span className="mt-1 flex items-center gap-2 text-sm text-cream/80">
              {fleet.length} classes, all chauffeur-driven
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </NavigationMenuLink>
    </div>
  );
}

function MobileMenu() {
  const items = [{ label: "Home", href: "/" }, { label: "Fleet", href: "/fleet" }, ...links];
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="flex size-11 items-center justify-center border border-white/30 transition-colors hover:border-white/70 md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <div className="flex h-full flex-col px-8 pt-24 pb-10">
          <ul className="flex flex-col">
            {items.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                className="border-b border-white/10"
              >
                <SheetClose asChild>
                  <Link
                    href={l.href}
                    onClick={l.href === "/" ? scrollHomeToTop : undefined}
                    className="flex min-h-14 items-center font-serif text-3xl transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </SheetClose>
              </motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-auto flex flex-col gap-1 text-cream/80"
          >
            {(
              [
                ["call", Phone, "Call us"],
                ["whatsapp", WhatsAppIcon, "Talk to us on WhatsApp"],
                ["email", Mail, "Email us"],
              ] as const
            ).map(([channel, Icon, label]) => (
              <ContactDialog key={channel} channel={channel}>
                <button type="button" className="flex min-h-11 items-center gap-3 text-left transition-colors hover:text-cream">
                  <Icon className="size-4 text-gold" aria-hidden="true" />
                  {label}
                </button>
              </ContactDialog>
            ))}
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
