import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { CertificateVerificationForm } from "@/components/marketing/certificate-verification-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Certificate Verification | CIMS Campus",
  description: "Submit a request to verify a CIMS Campus graduate's certificate.",
};

export default function CertificateVerificationPage() {
  return (
    <>
      <PageHero
        title="Certificate Verification"
        description="Please fill the below details and submit the request for certificate verification."
      />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <Card>
          <CardContent className="p-6">
            <CertificateVerificationForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
