import { z } from "zod";
import { optionalTextField } from "@/lib/validation/shared";

export const applicationSchema = z.object({
  fullName: z.string().min(2, { error: "Full name must be at least 2 characters." }),
  nameWithInitials: z.string().min(2, { error: "Enter your name with initials." }),
  dateOfBirth: z.coerce.date({ error: "Enter a valid date of birth." }),
  gender: z.enum(["MALE", "FEMALE"], { error: "Select a gender." }),
  nicOrPassport: z.string().min(5, { error: "Enter a valid NIC or passport number." }),
  email: z.email({ error: "Enter a valid email address." }),
  mobileNumber: z.string().min(7, { error: "Enter a valid mobile number." }),
  address: z.string().min(5, { error: "Enter your address." }),
  nationality: z.string().min(2, { error: "Enter your nationality." }),
  programmeId: z.string().min(1, { error: "Select a programme." }),
  highestQualification: z.string().min(2, { error: "Enter your highest qualification." }),
  institution: z.string().min(2, { error: "Enter the institution name." }),
  yearCompleted: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  additionalQualifications: optionalTextField,
  // Native checkboxes only submit "on" when checked and are absent otherwise
  // — same convention as checkboxField in shared.ts, but required here.
  declaration: z.literal("on", { error: "You must confirm the declaration to submit." }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export type DocumentSlotKey = "NIC_PASSPORT" | "PHOTO" | "CERTIFICATE" | "TRANSCRIPT" | "OTHER";

export interface DocumentSlot {
  key: DocumentSlotKey;
  fieldName: string;
  label: string;
  required: boolean;
  multiple: boolean;
  accept: string;
}

// Drives both the Documents step UI and server-side validation of which
// slots must have at least one file before an application can be submitted.
export const DOCUMENT_SLOTS: DocumentSlot[] = [
  {
    key: "NIC_PASSPORT",
    fieldName: "document_nicPassport",
    label: "NIC / Passport copy",
    required: true,
    multiple: false,
    accept: "image/*,.pdf",
  },
  {
    key: "PHOTO",
    fieldName: "document_photo",
    label: "Passport-size photograph",
    required: true,
    multiple: false,
    accept: "image/*",
  },
  {
    key: "CERTIFICATE",
    fieldName: "document_certificate",
    label: "Educational certificates",
    required: true,
    multiple: true,
    accept: "image/*,.pdf",
  },
  {
    key: "TRANSCRIPT",
    fieldName: "document_transcript",
    label: "Academic transcripts",
    required: false,
    multiple: true,
    accept: "image/*,.pdf",
  },
  {
    key: "OTHER",
    fieldName: "document_other",
    label: "Other supporting documents",
    required: false,
    multiple: true,
    accept: "image/*,.pdf",
  },
];

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file
