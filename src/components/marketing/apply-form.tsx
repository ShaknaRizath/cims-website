"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, FileText } from "lucide-react";
import { submitApplication, type ApplyActionState } from "@/lib/actions/apply.actions";
import { DOCUMENT_SLOTS } from "@/lib/validation/application.schema";
import { DocumentUploadField, type UploadedDoc } from "@/components/marketing/document-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Student Details", "Programme Selection", "Qualifications", "Documents", "Review & Submit"];
const REVIEW_STEP = STEP_LABELS.length - 1;

export function ApplyForm({ programmes }: { programmes: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<ApplyActionState, FormData>(submitApplication, undefined);
  const [step, setStep] = useState(0);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [reviewData, setReviewData] = useState<FormData | null>(null);
  const [slotDocs, setSlotDocs] = useState<Record<string, UploadedDoc[]>>({});
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (step === REVIEW_STEP && formRef.current) {
      setReviewData(new FormData(formRef.current));
    }
  }, [step]);

  const err = (field: string) => (docErrors[field] ? [{ message: docErrors[field] }] : state?.fieldErrors?.[field]?.map((message) => ({ message })));

  // Validating the whole form (formRef.current.reportValidity()) blocks silently on required
  // fields in later, CSS-hidden steps — the browser can't focus/show a bubble on a
  // display:none element, so "Next" would just do nothing. Only check the visible step.
  // Documents live outside native <input type=file> now (they're uploaded ahead of
  // submit to keep the eventual Server Action request tiny), so required slots are
  // checked against slotDocs instead of relying on checkValidity().
  function goNext() {
    const container = stepRefs.current[step];
    const fields = container?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (fields) {
      for (const field of Array.from(fields)) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }
    }

    if (step === 3) {
      const nextDocErrors: Record<string, string> = {};
      for (const slot of DOCUMENT_SLOTS) {
        if (slot.required && !(slotDocs[slot.key]?.length > 0)) {
          nextDocErrors[slot.fieldName] = `${slot.label} is required.`;
        }
      }
      setDocErrors(nextDocErrors);
      if (Object.keys(nextDocErrors).length > 0) return;
    }

    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  if (state?.success) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border bg-card p-10 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">Application Submitted</h2>
        <p className="mt-3 text-muted-foreground">
          Thank you for applying to CIMS Campus. Our admissions team will review your application and get in touch
          with you by email or phone shortly.
        </p>
      </div>
    );
  }

  const selectedProgramme = programmes.find((p) => p.id === reviewData?.get("programmeId"));

  return (
    <div>
      <div className="mx-auto max-w-5xl">
        <StepIndicator currentStep={step} onStepClick={(index) => index <= step && setStep(index)} />
      </div>

      <form ref={formRef} action={formAction} className="mx-auto mt-10 max-w-3xl rounded-xl border bg-card p-6 sm:p-8">
        {/* Step 1: Student Details */}
        <div ref={(el) => { stepRefs.current[0] = el; }} className={cn(step !== 0 && "hidden")}>
          <h2 className="font-heading text-xl font-semibold text-foreground">Student Details</h2>
          <FieldGroup className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input id="fullName" name="fullName" required />
                <FieldError errors={err("fullName")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nameWithInitials">Name with Initials</FieldLabel>
                <Input id="nameWithInitials" name="nameWithInitials" required />
                <FieldError errors={err("nameWithInitials")} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                <FieldError errors={err("dateOfBirth")} />
              </Field>
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <div className="flex items-center gap-6 py-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="gender" value="MALE" required className="accent-primary" />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="gender" value="FEMALE" required className="accent-primary" />
                    Female
                  </label>
                </div>
                <FieldError errors={err("gender")} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="nicOrPassport">NIC / Passport Number</FieldLabel>
                <Input id="nicOrPassport" name="nicOrPassport" required />
                <FieldError errors={err("nicOrPassport")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                <Input id="nationality" name="nationality" required />
                <FieldError errors={err("nationality")} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input id="email" name="email" type="email" required />
                <FieldError errors={err("email")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
                <Input id="mobileNumber" name="mobileNumber" type="tel" required />
                <FieldError errors={err("mobileNumber")} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Textarea id="address" name="address" rows={3} required />
              <FieldError errors={err("address")} />
            </Field>
          </FieldGroup>
        </div>

        {/* Step 2: Programme Selection */}
        <div ref={(el) => { stepRefs.current[1] = el; }} className={cn(step !== 1 && "hidden")}>
          <h2 className="font-heading text-xl font-semibold text-foreground">Programme Selection</h2>
          <FieldGroup className="mt-6">
            <Field>
              <FieldLabel htmlFor="programmeId">Programme</FieldLabel>
              <Select name="programmeId" required items={programmes.map((p) => ({ value: p.id, label: p.name }))}>
                <SelectTrigger id="programmeId" className="w-full">
                  <SelectValue placeholder="Select the programme you're applying for" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map((programme) => (
                    <SelectItem key={programme.id} value={programme.id}>
                      {programme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={err("programmeId")} />
            </Field>
          </FieldGroup>
        </div>

        {/* Step 3: Qualifications */}
        <div ref={(el) => { stepRefs.current[2] = el; }} className={cn(step !== 2 && "hidden")}>
          <h2 className="font-heading text-xl font-semibold text-foreground">Educational / Qualification Details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Just finished school? Use your G.C.E. A/L or O/L results and school name below.
          </p>
          <FieldGroup className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="highestQualification">Highest Qualification</FieldLabel>
                <Input
                  id="highestQualification"
                  name="highestQualification"
                  placeholder="e.g. G.C.E. Advanced Level"
                  required
                />
                <FieldError errors={err("highestQualification")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="institution">Institution / School</FieldLabel>
                <Input id="institution" name="institution" placeholder="e.g. Royal College, Colombo" required />
                <FieldError errors={err("institution")} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="yearCompleted">Year Completed</FieldLabel>
              <Input id="yearCompleted" name="yearCompleted" type="number" placeholder="2024" />
              <FieldError errors={err("yearCompleted")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="additionalQualifications">Additional Qualifications (optional)</FieldLabel>
              <Textarea id="additionalQualifications" name="additionalQualifications" rows={3} />
            </Field>
          </FieldGroup>
        </div>

        {/* Step 4: Documents */}
        <div ref={(el) => { stepRefs.current[3] = el; }} className={cn(step !== 3 && "hidden")}>
          <h2 className="font-heading text-xl font-semibold text-foreground">Document Upload</h2>
          <FieldGroup className="mt-6">
            {DOCUMENT_SLOTS.map((slot) => (
              <Field key={slot.key}>
                <FieldLabel htmlFor={slot.fieldName}>
                  {slot.label} {slot.required ? "*" : <span className="text-muted-foreground">(optional)</span>}
                </FieldLabel>
                <DocumentUploadField
                  fieldName={slot.fieldName}
                  folder="cims-website/applications"
                  accept={slot.accept}
                  multiple={slot.multiple}
                  docs={slotDocs[slot.key] ?? []}
                  onChange={(docs) => {
                    setSlotDocs((prev) => ({ ...prev, [slot.key]: docs }));
                    setDocErrors((prev) => {
                      if (!prev[slot.fieldName]) return prev;
                      const next = { ...prev };
                      delete next[slot.fieldName];
                      return next;
                    });
                  }}
                  errors={err(slot.fieldName)?.map((e) => e.message)}
                />
                <FieldDescription>
                  {slot.multiple ? "You can select multiple files." : "One file only."} Max 10MB per file.
                </FieldDescription>
              </Field>
            ))}
          </FieldGroup>
        </div>

        {/* Step 5: Review & Submit */}
        <div className={cn(step !== 4 && "hidden")}>
          <h2 className="font-heading text-xl font-semibold text-foreground">Review & Submit</h2>
          {reviewData && (
            <div className="mt-6 flex flex-col gap-6">
              <ReviewSection title="Student Details">
                <ReviewRow label="Full Name" value={reviewData.get("fullName")} />
                <ReviewRow label="Name with Initials" value={reviewData.get("nameWithInitials")} />
                <ReviewRow label="Date of Birth" value={reviewData.get("dateOfBirth")} />
                <ReviewRow
                  label="Gender"
                  value={reviewData.get("gender") === "MALE" ? "Male" : reviewData.get("gender") === "FEMALE" ? "Female" : ""}
                />
                <ReviewRow label="NIC / Passport" value={reviewData.get("nicOrPassport")} />
                <ReviewRow label="Nationality" value={reviewData.get("nationality")} />
                <ReviewRow label="Email" value={reviewData.get("email")} />
                <ReviewRow label="Mobile" value={reviewData.get("mobileNumber")} />
                <ReviewRow label="Address" value={reviewData.get("address")} />
              </ReviewSection>

              <ReviewSection title="Programme Selection">
                <ReviewRow label="Programme" value={selectedProgramme?.name ?? "Not selected"} />
              </ReviewSection>

              <ReviewSection title="Qualifications">
                <ReviewRow label="Highest Qualification" value={reviewData.get("highestQualification")} />
                <ReviewRow label="Institution" value={reviewData.get("institution")} />
                <ReviewRow label="Year Completed" value={reviewData.get("yearCompleted")} />
                <ReviewRow label="Additional Qualifications" value={reviewData.get("additionalQualifications")} />
              </ReviewSection>

              <ReviewSection title="Documents">
                {DOCUMENT_SLOTS.map((slot) => {
                  const docs = slotDocs[slot.key] ?? [];
                  return (
                    <div key={slot.key} className="flex flex-col gap-1 py-1.5 text-sm">
                      <span className="text-muted-foreground">{slot.label}</span>
                      {docs.length === 0 ? (
                        <span className="text-foreground">Not provided</span>
                      ) : (
                        docs.map((doc, index) => (
                          <span key={index} className="flex items-center gap-1.5 text-foreground">
                            <FileText className="size-3.5 shrink-0" /> {doc.fileName}
                          </span>
                        ))
                      )}
                    </div>
                  );
                })}
              </ReviewSection>

              <Field>
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox
                    name="declaration"
                    checked={declarationChecked}
                    onCheckedChange={setDeclarationChecked}
                    className="mt-0.5"
                  />
                  I confirm that the information and documents provided in this application are accurate and
                  complete to the best of my knowledge.
                </label>
                <FieldError errors={err("declaration")} />
              </Field>
            </div>
          )}
        </div>

        {state?.error && <FieldError className="mt-6">{state.error}</FieldError>}

        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || pending}>
            Back
          </Button>
          {step < REVIEW_STEP ? (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={pending || !declarationChecked}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {pending ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (index: number) => void;
}) {
  return (
    <ol className="flex flex-nowrap items-center justify-center gap-1 sm:gap-2">
      {STEP_LABELS.map((label, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        return (
          <li key={label} className="flex min-w-0 shrink items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              className={cn(
                "flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium transition-colors sm:text-sm",
                (isActive || isComplete) && "text-foreground",
                !isActive && !isComplete && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary text-primary",
                  !isActive && !isComplete && "border-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="hidden truncate sm:inline">{label}</span>
            </button>
            {index < STEP_LABELS.length - 1 && <span className="h-px w-3 shrink-0 bg-border sm:w-6" />}
          </li>
        );
      })}
    </ol>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 divide-y rounded-lg border">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: FormDataEntryValue | null | undefined }) {
  const display = typeof value === "string" && value.trim() ? value : "—";
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground sm:text-right">{display}</span>
    </div>
  );
}
