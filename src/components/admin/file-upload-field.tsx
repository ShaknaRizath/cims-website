"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import { useFileUpload } from "@/lib/storage/use-file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";

interface FileUploadFieldProps {
  name: string;
  label: string;
  folder: string;
  defaultUrl?: string | null;
  accept?: string;
  description?: string;
  kind?: "image" | "file";
  errors?: string[];
  // Crop box ratio (e.g. 4 / 3, 16 / 9, 1). Defaults to 4 / 3 when unset —
  // react-easy-crop always needs a fixed ratio, there's no freeform mode.
  aspectRatio?: number;
  // Skips the crop dialog entirely — for logos and other pre-sized assets
  // where forcing any fixed aspect ratio would cut off part of the image.
  disableCrop?: boolean;
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
  aspectRatio,
  disableCrop = false,
}: FileUploadFieldProps) {
  const [file, setFile] = useState<{ url: string; name: string } | null>(
    defaultUrl ? { url: defaultUrl, name: defaultUrl.split("/").pop() ?? defaultUrl } : null,
  );
  const [pendingImage, setPendingImage] = useState<{ src: string; name: string; type: string } | null>(null);
  const { upload, uploading, error } = useFileUpload();

  function resetFileInput() {
    const input = document.getElementById(name) as HTMLInputElement | null;
    if (input) input.value = "";
  }

  async function handleFileSelected(selected: File) {
    if (kind !== "image" || disableCrop) {
      const result = await upload(selected, folder);
      if (result) setFile({ url: result.url, name: result.fileName });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage({ src: reader.result as string, name: selected.name, type: selected.type });
    };
    reader.readAsDataURL(selected);
  }

  async function handleCropped(croppedFile: File) {
    setPendingImage(null);
    const result = await upload(croppedFile, folder);
    if (result) setFile({ url: result.url, name: result.fileName });
    resetFileInput();
  }

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
            await handleFileSelected(selected);
          }}
        />
      )}

      {pendingImage && (
        <ImageCropDialog
          open
          imageSrc={pendingImage.src}
          fileName={pendingImage.name}
          mimeType={pendingImage.type}
          aspectRatio={aspectRatio}
          onCancel={() => {
            setPendingImage(null);
            resetFileInput();
          }}
          onCropped={handleCropped}
        />
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      {error && <FieldError>{error}</FieldError>}
      <FieldError errors={errors?.map((message) => ({ message }))} />
    </Field>
  );
}
