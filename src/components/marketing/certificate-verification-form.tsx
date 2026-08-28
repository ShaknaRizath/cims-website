"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/action-state";
import { submitCertificateVerificationRequest } from "@/lib/actions/certificate-verification.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

export function CertificateVerificationForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    submitCertificateVerificationRequest,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error && !state?.fieldErrors) {
      toast.success("Verification request submitted — we'll be in touch shortly.");
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  const err = (field: string) => state?.fieldErrors?.[field]?.map((message) => ({ message }));

  return (
    <form ref={formRef} action={formAction}>
      <FieldGroup>
        <div>
          <h2 className="mb-1.5 text-base font-bold text-foreground">Verifier Details</h2>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="verifier-name">Name</FieldLabel>
                <Input id="verifier-name" name="verifierName" required />
                <FieldError errors={err("verifierName")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="verifier-institution">Institution</FieldLabel>
                <Input id="verifier-institution" name="verifierInstitution" required />
                <FieldError errors={err("verifierInstitution")} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="verifier-department">Department</FieldLabel>
                <Input id="verifier-department" name="verifierDepartment" required />
                <FieldError errors={err("verifierDepartment")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="verifier-mobile">Mobile</FieldLabel>
                <Input id="verifier-mobile" name="verifierMobile" type="tel" required />
                <FieldError errors={err("verifierMobile")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="verifier-email">Email</FieldLabel>
              <Input id="verifier-email" name="verifierEmail" type="email" required />
              <FieldError errors={err("verifierEmail")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="verifier-purpose">Purpose</FieldLabel>
              <Textarea id="verifier-purpose" name="purpose" rows={3} required />
              <FieldError errors={err("purpose")} />
            </Field>
          </FieldGroup>
        </div>

        <div>
          <h2 className="mb-1.5 text-base font-bold text-foreground">Student Details</h2>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="student-name">Name</FieldLabel>
                <Input id="student-name" name="studentName" required />
                <FieldError errors={err("studentName")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="certificate-number">Certificate Number</FieldLabel>
                <Input id="certificate-number" name="certificateNumber" required />
                <FieldError errors={err("certificateNumber")} />
              </Field>
            </div>
          </FieldGroup>
        </div>

        {state?.error && <FieldError>{state.error}</FieldError>}

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          {pending ? "Submitting..." : "Submit Request"}
        </Button>
      </FieldGroup>
    </form>
  );
}
