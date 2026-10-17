import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Privacy policy" };

// TODO(client): copy the privacy policy text from jhajjz.in/privacy-policy.
export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-6 pt-[160px] pb-28">
        <h1 className="font-serif text-[clamp(36px,5vw,56px)] leading-[1.1]">Privacy policy</h1>
        <p className="mt-6 text-[17px] text-muted">[PRIVACY POLICY TEXT FROM THE CURRENT SITE]</p>
      </main>
      <SiteFooter />
    </>
  );
}
