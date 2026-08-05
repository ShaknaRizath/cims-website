"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/action-state";
import { updateSiteSettings } from "@/lib/actions/admin/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { FileUploadField } from "@/components/admin/file-upload-field";

export interface SiteSettingsFormDefaults {
  heroHeadline: string;
  heroSubheadline: string | null;
  heroImageUrl: string | null;
  aboutSummary: string | null;
  chairmanMessageHtml: string | null;
  chairmanPhotoUrl: string | null;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  lmsUrl: string;
  certificateVerifyUrl: string;
  onlinePaymentUrl: string;
}

export function SiteSettingsForm({ defaultValues }: { defaultValues?: SiteSettingsFormDefaults }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateSiteSettings, undefined);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error && !state?.fieldErrors) {
      toast.success("Settings saved.");
    }
    wasPending.current = pending;
  }, [pending, state]);

  const err = (field: string) => state?.fieldErrors?.[field]?.map((message) => ({ message }));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="heroHeadline">Headline</FieldLabel>
              <Input id="heroHeadline" name="heroHeadline" defaultValue={defaultValues?.heroHeadline} required />
              <FieldError errors={err("heroHeadline")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="heroSubheadline">Subheadline</FieldLabel>
              <Textarea id="heroSubheadline" name="heroSubheadline" defaultValue={defaultValues?.heroSubheadline ?? ""} rows={2} />
            </Field>
            <FileUploadField name="heroImageUrl" label="Hero image" folder="settings" defaultUrl={defaultValues?.heroImageUrl} />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About & Chairman&apos;s Message</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="aboutSummary">About summary</FieldLabel>
              <Textarea id="aboutSummary" name="aboutSummary" defaultValue={defaultValues?.aboutSummary ?? ""} rows={4} />
            </Field>
            <Field>
              <FieldLabel htmlFor="chairmanMessageHtml">Chairman&apos;s message</FieldLabel>
              <Textarea id="chairmanMessageHtml" name="chairmanMessageHtml" defaultValue={defaultValues?.chairmanMessageHtml ?? ""} rows={5} />
            </Field>
            <FileUploadField name="chairmanPhotoUrl" label="Chairman's photo" folder="settings" defaultUrl={defaultValues?.chairmanPhotoUrl} />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="contactPhone">Phone</FieldLabel>
                <Input id="contactPhone" name="contactPhone" defaultValue={defaultValues?.contactPhone} required />
                <FieldError errors={err("contactPhone")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="contactEmail">Email</FieldLabel>
                <Input id="contactEmail" name="contactEmail" type="email" defaultValue={defaultValues?.contactEmail} required />
                <FieldError errors={err("contactEmail")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="contactAddress">Address</FieldLabel>
              <Textarea id="contactAddress" name="contactAddress" defaultValue={defaultValues?.contactAddress} rows={2} required />
              <FieldError errors={err("contactAddress")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="whatsappNumber">WhatsApp number</FieldLabel>
              <Input id="whatsappNumber" name="whatsappNumber" defaultValue={defaultValues?.whatsappNumber ?? ""} placeholder="+94773590505" />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="facebookUrl">Facebook</FieldLabel>
                <Input id="facebookUrl" name="facebookUrl" defaultValue={defaultValues?.facebookUrl ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="instagramUrl">Instagram</FieldLabel>
                <Input id="instagramUrl" name="instagramUrl" defaultValue={defaultValues?.instagramUrl ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="linkedinUrl">LinkedIn</FieldLabel>
                <Input id="linkedinUrl" name="linkedinUrl" defaultValue={defaultValues?.linkedinUrl ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="youtubeUrl">YouTube</FieldLabel>
                <Input id="youtubeUrl" name="youtubeUrl" defaultValue={defaultValues?.youtubeUrl ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="tiktokUrl">TikTok</FieldLabel>
                <Input id="tiktokUrl" name="tiktokUrl" defaultValue={defaultValues?.tiktokUrl ?? ""} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LMS integration links</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="lmsUrl">Online Learning Portal URL</FieldLabel>
              <Input id="lmsUrl" name="lmsUrl" defaultValue={defaultValues?.lmsUrl} required />
              <FieldError errors={err("lmsUrl")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="certificateVerifyUrl">Certificate Verification URL</FieldLabel>
              <Input id="certificateVerifyUrl" name="certificateVerifyUrl" defaultValue={defaultValues?.certificateVerifyUrl} required />
              <FieldError errors={err("certificateVerifyUrl")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="onlinePaymentUrl">Online Payment URL</FieldLabel>
              <Input id="onlinePaymentUrl" name="onlinePaymentUrl" defaultValue={defaultValues?.onlinePaymentUrl} required />
              <FieldError errors={err("onlinePaymentUrl")} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state?.error && <FieldError>{state.error}</FieldError>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
