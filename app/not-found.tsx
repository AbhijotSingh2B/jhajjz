import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactDialog } from "@/components/contact-dialog";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main className="flex min-h-[calc(100svh-180px)] flex-col justify-center pt-[72px]">
          <section className="mx-auto max-w-[1200px] px-6 py-[72px] md:py-28">
            <h1 className="max-w-[640px] font-serif text-[clamp(38px,4.8vw,56px)] leading-[1.08] tracking-[-0.01em]">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-5 max-w-[480px] text-[17px] text-muted">
              It may have moved when we rebuilt the site. Head back to the home page, or call us and we&apos;ll help.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="ink">
                <Link href="/">Back to home</Link>
              </Button>
              <ContactDialog channel="call">
                <Button type="button" variant="outline">
                  Call us
                </Button>
              </ContactDialog>
            </div>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
