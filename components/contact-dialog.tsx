"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, ChevronRight, Copy, FileText, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contact, whatsappUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ease = [0.2, 0.7, 0.2, 1] as const;

export type ContactChannel = "call" | "whatsapp" | "email";
type View = ContactChannel | "all";

const defaultMessage = "Hello Jhajj'z, I'd like a quote.";
const icons = { call: Phone, whatsapp: MessageCircle, email: Mail };

/**
 * Wrap any button to open the contact popup on one channel:
 *
 *   <ContactDialog channel="call"><button>Call us</button></ContactDialog>
 *
 * Each channel ends with "Other ways to reach us", which lists every option.
 *
 * To open it from code (e.g. after a form submit) leave out the trigger and control it:
 *
 *   <ContactDialog channel="whatsapp" open={open} onOpenChange={setOpen} message="Hello, ..." />
 *
 * `message` prefills the WhatsApp chat and the email body.
 */
export function ContactDialog({
  channel,
  children,
  open,
  onOpenChange,
  message,
}: {
  channel: ContactChannel;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  message?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <Panel channel={channel} message={message} />
      </DialogContent>
    </Dialog>
  );
}

/** Mounted only while the dialog is open, so it starts on the requested channel every time. */
function Panel({ channel, message }: { channel: ContactChannel; message?: string }) {
  const [view, setView] = useState<View>(channel);
  // +1 when moving to the "all" list, -1 when coming back, so the slide direction matches.
  const [dir, setDir] = useState(1);

  function go(next: View) {
    setDir(next === "all" ? 1 : -1);
    setView(next);
  }

  return (
    <AutoHeight>
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={view}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: 24 * d }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: -24 * d }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease }}
          className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8"
        >
          {view === "all" ? (
            <AllOptions onPick={go} onBack={() => go(channel)} />
          ) : (
            <ChannelView channel={view} message={message} onOther={() => go("all")} />
          )}
        </motion.div>
      </AnimatePresence>
    </AutoHeight>
  );
}

function ChannelView({ channel, message, onOther }: { channel: ContactChannel; message?: string; onOther: () => void }) {
  const content = {
    call: {
      title: "Call us",
      text: "Either number reaches the Jhajj'z team.",
      rows: contact.phones.map((p) => (
        <Row key={p.href} value={p.label} href={p.href} copy={p.label} action="Call" actionIcon={Phone} />
      )),
    },
    whatsapp: {
      title: "Talk on WhatsApp",
      text: message
        ? "Your details are filled in. Pick a number to open the chat and send them."
        : "Pick a number to open the chat. Send the date, city and occasion and we'll reply with a quote.",
      rows: contact.phones.map((p) => (
        <Row
          key={p.href}
          value={p.label}
          href={whatsappUrl(p.href, message ?? defaultMessage)}
          copy={p.label}
          action="Open chat"
          actionIcon={MessageCircle}
          external
        />
      )),
    },
    email: {
      title: "Email us",
      text: "Tell us what you need and we'll reply with a quote.",
      rows: [
        <Row
          key="mail"
          value={contact.email}
          href={`mailto:${contact.email}?subject=${encodeURIComponent("Quote request")}${message ? `&body=${encodeURIComponent(message)}` : ""}`}
          copy={contact.email}
          action="Write email"
          actionIcon={Mail}
          small
          stack
        />,
      ],
    },
  }[channel];

  return (
    <>
      <Heading icon={icons[channel]} title={content.title} text={content.text} />
      <ul className="mt-6 border-t border-line">
        {content.rows.map((row, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease }}
            className="border-b border-line"
          >
            {row}
          </motion.li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="default" className="mt-8 w-full" onClick={onOther}>
        Other ways to reach us
      </Button>
    </>
  );
}

function AllOptions({ onPick, onBack }: { onPick: (v: ContactChannel) => void; onBack: () => void }) {
  const itemClass =
    "group flex min-h-16 w-full items-center gap-4 px-2 py-3 text-left transition-colors duration-200 hover:bg-sand";
  const inner = (Icon: typeof Phone, label: string, sub: string) => (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center bg-sand text-gold-deep transition-colors duration-200 group-hover:bg-paper">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold">{label}</span>
        <span className="block truncate text-[14px] text-muted">{sub}</span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );

  const items = [
    <button key="call" type="button" className={itemClass} onClick={() => onPick("call")}>
      {inner(Phone, "Call", contact.phones.map((p) => p.label).join(" · "))}
    </button>,
    <button key="wa" type="button" className={itemClass} onClick={() => onPick("whatsapp")}>
      {inner(MessageCircle, "WhatsApp", contact.phones[0].label)}
    </button>,
    <button key="mail" type="button" className={itemClass} onClick={() => onPick("email")}>
      {inner(Mail, "Email", contact.email)}
    </button>,
    <DialogClose key="form" asChild>
      <Link href="/contact" className={itemClass}>
        {inner(FileText, "Quote form", "Send the details and we'll reply")}
      </Link>
    </DialogClose>,
    <a key="map" href={contact.mapsUrl} target="_blank" rel="noreferrer" className={itemClass}>
      {inner(MapPin, "Visit our office", `${contact.address[0]}, Mohali`)}
    </a>,
  ];

  return (
    <>
      <Heading title="Get in touch" text="Pick whichever is easiest for you." />
      <ul className="mt-6 border-t border-line">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.045, duration: 0.4, ease }}
            className="border-b border-line"
          >
            {item}
          </motion.li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </button>
    </>
  );
}

function Heading({ icon: Icon, title, text }: { icon?: typeof Phone; title: string; text: string }) {
  return (
    <div className="pr-10">
      {Icon && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.05 }}
          className="mb-5 flex size-12 items-center justify-center bg-ink text-gold"
        >
          <Icon className="size-5" aria-hidden="true" />
        </motion.span>
      )}
      <DialogTitle className="font-serif text-[32px] leading-[1.1]">{title}</DialogTitle>
      <DialogDescription className="mt-2 text-[15px] text-muted">{text}</DialogDescription>
    </div>
  );
}

function Row({
  value,
  href,
  copy,
  action,
  actionIcon: ActionIcon,
  external = false,
  small = false,
  stack = false,
}: {
  value: string;
  href: string;
  copy: string;
  action: string;
  actionIcon: typeof Phone;
  external?: boolean;
  small?: boolean;
  /** Single-row channels: on phones the action button takes the full width under the value. */
  stack?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4">
      <a
        href={href}
        {...ext}
        className={`min-w-0 font-serif tabular-nums transition-colors hover:text-gold-deep ${small ? "text-[20px] break-all" : "text-[26px]"}`}
      >
        {value}
      </a>
      <div className={`flex shrink-0 items-center gap-2 ${stack ? "w-full sm:w-auto" : ""}`}>
        <CopyButton value={copy} />
        <Button asChild variant="ink" size="sm" className={`h-11 ${stack ? "flex-1 sm:flex-none" : ""}`}>
          <a href={href} {...ext}>
            <ActionIcon aria-hidden="true" />
            {action}
          </a>
        </Button>
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (http, old browsers). The value is still on screen to select.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${value}`}
      className="flex size-11 items-center justify-center border border-line text-muted transition-colors duration-200 hover:border-ink/40 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={copied ? "text-gold-deep" : undefined}
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

/** Animates its height when the content inside changes size (view switches). */
function AutoHeight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div animate={{ height }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}
