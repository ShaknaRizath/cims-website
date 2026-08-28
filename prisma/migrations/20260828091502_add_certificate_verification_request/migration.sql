-- CreateTable
CREATE TABLE "CertificateVerificationRequest" (
    "id" TEXT NOT NULL,
    "verifierName" TEXT NOT NULL,
    "verifierInstitution" TEXT NOT NULL,
    "verifierDepartment" TEXT NOT NULL,
    "verifierMobile" TEXT NOT NULL,
    "verifierEmail" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateVerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CertificateVerificationRequest_isRead_createdAt_idx" ON "CertificateVerificationRequest"("isRead", "createdAt");
