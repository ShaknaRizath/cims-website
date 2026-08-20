import type { Metadata } from "next";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions | CIMS Campus",
  description: "Terms and conditions for the use of the CIMS Campus website.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        description="The rules and regulations for using the CIMS Campus website."
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          These terms and conditions outline the rules and regulations for the use of CIMS&apos;s Website, located
          at cims.lk.
        </p>

        <p className="text-muted-foreground">
          By accessing this website we assume you accept these terms and conditions. Do not continue to use CIMS
          Campus if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <p className="text-muted-foreground">
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice
          and all Agreements: &quot;Client&quot;, &quot;You&quot; and &quot;Your&quot; refers to you, the person log
          on this website and compliant to the Company&apos;s terms and conditions. &quot;The Company&quot;,
          &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our Company.
          &quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and ourselves. All
          terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of
          our assistance to the Client in the most appropriate manner for the express purpose of meeting the
          Client&apos;s needs in respect of provision of the Company&apos;s stated services, in accordance with and
          subject to, prevailing law of Sri Lanka. Any use of the above terminology or other words in the singular,
          plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to
          same.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground">Cookies</h2>
        <p className="text-muted-foreground">
          We employ the use of cookies. By accessing CIMS Campus, you agreed to use cookies in agreement with the
          CIMS&apos;s Privacy Policy.
        </p>
        <p className="text-muted-foreground">
          Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit. Cookies
          are used by our website to enable the functionality of certain areas to make it easier for people
          visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </p>

        <h2 className="font-heading text-xl font-semibold text-foreground">License</h2>
        <p className="text-muted-foreground">
          Unless otherwise stated, CIMS and/or its licensors own the intellectual property rights for all material
          on CIMS Campus. All intellectual property rights are reserved. You may access this from CIMS Campus for
          your own personal use subjected to restrictions set in these terms and conditions. You must not:
        </p>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Republish material from CIMS Campus</li>
          <li>Sell, rent or sub-license material from CIMS Campus</li>
          <li>Reproduce, duplicate or copy material from CIMS Campus</li>
          <li>Redistribute content from CIMS Campus</li>
        </ul>

        <p className="text-muted-foreground">
          Parts of this website offer an opportunity for users to post and exchange opinions and information in
          certain areas of the website. CIMS does not filter, edit, publish or review Comments prior to their
          presence on the website. Comments do not reflect the views and opinions of CIMS, its agents and/or
          affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To
          the extent permitted by applicable laws, CIMS shall not be liable for the Comments or for any liability,
          damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance
          of the Comments on this website.
        </p>

        <div className="text-muted-foreground">
          <p className="font-semibold text-foreground">Submit your inquiries to:</p>
          <p>Head of Program Operations</p>
          <p>CIMS Campus,</p>
          <p>Lake Crescent, Cotta Road,</p>
          <p>Rajagiriya, Sri Lanka.</p>
          <p>077 359 0505</p>
          <p>info@cims.lk</p>
        </div>
      </Reveal>
      </div>
    </>
  );
}
