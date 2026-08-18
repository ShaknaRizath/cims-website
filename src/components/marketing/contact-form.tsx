"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/action-state";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitContactMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error && !state?.fieldErrors) {
      toast.success("Message sent — we'll get back to you shortly.");
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  const err = (field: string) => state?.fieldErrors?.[field]?.map((message) => ({ message }));

  return (
    <form ref={formRef} action={formAction}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input id="contact-name" name="name" required />
            <FieldError errors={err("name")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-mobile">Mobile</FieldLabel>
            <Input id="contact-mobile" name="mobile" type="tel" required />
            <FieldError errors={err("mobile")} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input id="contact-email" name="email" type="email" required />
          <FieldError errors={err("email")} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input id="contact-subject" name="subject" required />
          <FieldError errors={err("subject")} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea id="contact-message" name="message" rows={4} required />
          <FieldError errors={err("message")} />
        </Field>

        {state?.error && <FieldError>{state.error}</FieldError>}

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          {pending ? "Sending..." : "Submit"}
        </Button>
      </FieldGroup>
    </form>
  );
}
