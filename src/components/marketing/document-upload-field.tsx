"use client";

import { useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { useFileUpload } from "@/lib/storage/use-file-upload";
import { MAX_DOCUMENT_SIZE_BYTES } from "@/lib/validation/application.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

export type UploadedDoc = { url: string; fileName: string };

interface DocumentUploadFieldProps {
  fieldName: string;
  folder: string;
  accept: string;
  multiple: boolean;
  errors?: string[];
  docs: UploadedDoc[];
  onChange: (docs: UploadedDoc[]) => void;
}

// Uploads applicant documents straight from the browser to Cloudinary (via the
// signed-upload flow already used by the admin CMS) instead of routing raw file
// bytes through the submitApplication server action — Vercel hard-caps a Server
// Action's request body at 4.5MB, which even one real certificate scan can exceed.
export function DocumentUploadField({ fieldName, folder, accept, multiple, errors, docs, onChange }: DocumentUploadFieldProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useFileUpload();

  async function handleFiles(files: FileList) {
    setUploadError(null);
    const oversized = Array.from(files).find((f) => f.size > MAX_DOCUMENT_SIZE_BYTES);
    if (oversized) {
      setUploadError(`${oversized.name} is larger than 10MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const next = multiple ? [...docs] : [];
    for (const file of Array.from(files)) {
      const result = await upload(file, folder);
      if (result) {
        next.push({ url: result.url, fileName: result.fileName });
      } else {
        setUploadError(`Failed to upload ${file.name}. Please try again.`);
      }
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeDoc(index: number) {
    onChange(docs.filter((_, i) => i !== index));
  }

  return (
    <div>
      {docs.map((doc, index) => (
        <input key={doc.url + index} type="hidden" name={fieldName} value={JSON.stringify(doc)} />
      ))}

      {docs.length > 0 && (
        <div className="mb-2 flex flex-col gap-1.5">
          {docs.map((doc, index) => (
            <div key={doc.url + index} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{doc.fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeDoc(index)}
                aria-label={`Remove ${doc.fileName}`}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {(multiple || docs.length === 0) && (
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
          }}
        />
      )}

      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      {uploadError && <FieldError>{uploadError}</FieldError>}
      <FieldError errors={errors?.map((message) => ({ message }))} />
    </div>
  );
}
