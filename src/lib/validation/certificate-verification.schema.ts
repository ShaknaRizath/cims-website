import { z } from "zod";

export const certificateVerificationRequestSchema = z.object({
  verifierName: z.string().min(2, { error: "Name must be at least 2 characters." }),
  verifierInstitution: z.string().min(2, { error: "Institution must be at least 2 characters." }),
  verifierDepartment: z.string().min(2, { error: "Department must be at least 2 characters." }),
  verifierMobile: z.string().min(7, { error: "Enter a valid mobile number." }),
  verifierEmail: z.email({ error: "Enter a valid email address." }),
  purpose: z.string().min(5, { error: "Purpose must be at least 5 characters." }),
  studentName: z.string().min(2, { error: "Student name must be at least 2 characters." }),
  certificateNumber: z.string().min(2, { error: "Enter a valid certificate number." }),
});

export type CertificateVerificationRequestInput = z.infer<typeof certificateVerificationRequestSchema>;
