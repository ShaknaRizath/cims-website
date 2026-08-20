import type { Metadata } from "next";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Refund Policy | CIMS Campus",
  description: "CIMS Campus's refund policy for programme fees.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        title="Refund Policy"
        description="How CIMS Campus handles refund requests for programme fees, across all campuses."
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          CIMS refund policy will be applicable at all locations where CIMS operations are present, and refund of
          any fee paid to CIMS will be considered under special circumstances case by case as follows:
        </p>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Category 1</h2>
          <p className="text-muted-foreground">
            CIMS will refund 100% the fee paid, where the request of refund must be made before commencement of the
            program or within 14 days of commencement of the program and where participant not attended any
            lectures.
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>CIMS discontinued the program for unavoidable circumstances.</li>
            <li>CIMS decided not to commence the scheduled batch.</li>
            <li>
              CIMS postponed and informed to the participants, where the participant not willing to wait till the
              program commences.
            </li>
            <li>
              CIMS changed the class schedule for which the participant registered, and participant cannot attend
              the lectures.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Category 2</h2>
          <p className="text-muted-foreground">
            Participants&apos; change the decision of continuing the program. Under this category participant will
            not be able to receive full refund, amount of refund will be decided by the Board of Management.
            Minimum of LKR 10,000 will be deducted from the payment made as the processing charge. Refund under
            this category is acceptable only if such request is made in writing, prior to the scheduled
            commencement of the program. Evidence will be required to support the refund.
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Participant decided to migrate overseas.</li>
            <li>Participant facing unforeseen financial crisis.</li>
            <li>Participants&apos; job schedule is clashing with program schedule.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Category 3</h2>
          <p className="text-muted-foreground">
            Medical Reasons. Participant decided to refund, refund will be possible with enough evidence as follows
            and the refund amount will be determined by the Board of Management of CIMS.
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Participant is unable to continue the course due to personal medical reasons of a serious nature, or
              due to medical reasons of a serious nature of the supporting guardian / parent.
            </li>
            <li>Death of the participant or the guardian / parent.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Important Notes</h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Any payment made to external awarding bodies / Universities / Higher Educational Institutions cannot
              be refunded, as this is beyond the CIMS.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Refund Procedure</h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              A request for a refund of programme fees must be submitted in writing (please use the Refund Request
              form) by the student and / or the guardian wishing to obtain the refund.
            </li>
            <li>
              A refund will be granted according to the categories listed above in the refund policy of CIMS. Any
              request that is not listed above will be referred to the Board of Management for its consideration
              and the final decision will be taken by them.
            </li>
            <li>Refunds (if any) will be made within four to eight weeks upon receiving a completed refund application.</li>
            <li>Refund payments will be made only in Sri Lankan Rupees (LKR).</li>
            <li>
              Refund payments will be made by cheque and will be made out in the name of the registered student or
              the relevant guardian. Payments will not be released to third parties.
            </li>
          </ul>
        </div>

        <div className="text-muted-foreground">
          <p className="font-semibold text-foreground">Submit your refund request to:</p>
          <p>Head of Program Operations</p>
          <p>CIMS Campus,</p>
          <p>Lake Crescent, Cotta Road,</p>
          <p>Rajagiriya, Sri Lanka.</p>
        </div>
      </Reveal>
      </div>
    </>
  );
}
