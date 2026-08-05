"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import { useFileUpload } from "@/lib/storage/use-file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

interface FileUploadFieldProps {
  name: string;
  label: string;
  folder: string;
  defaultUrl?: string | null;
  accept?: string;
  description?: string;
  kind?: "image" | "file";
  errors?: string[];
}

export function FileUploadField({
  name,
  label,
  folder,
  defaultUrl,
  accept = "image/*",
  description,
  kind = "image",
  errors,
}: FileUploadFieldProps) {
  const [file, setFile] = useState<{ url: string; name: string } | null>(
    defaultUrl ? { url: defaultUrl, name: defaultUrl.split("/").pop() ?? defaultUrl } : null,
  );
  const { upload, uploading, error } = useFileUpload();

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <input type="hidden" name={name} value={file?.url ?? ""} />

      {file && (
        <div className="flex items-center gap-3 rounded-lg border p-2">
          {kind === "image" ? (
            <Image
              src={file.url}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-md object-cover"
              unoptimized
            />
          ) : (
            <FileText className="size-8 text-muted-foreground" />
          )}
          <span className="flex-1 truncate text-sm text-muted-foreground">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setFile(null)}
            aria-label={`Remove ${label}`}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {!file && (
        <Input
          id={name}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={async (e) => {
            const selected = e.target.files?.[0];
            if (!selected) return;
            const result = await upload(selected, folder);
            if (result) setFile({ url: result.url, name: result.fileName });
          }}
        />
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      {error && <FieldError>{error}</FieldError>}
      <FieldError errors={errors?.map((message) => ({ message }))} />
    </Field>
  );
}
