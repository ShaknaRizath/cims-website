"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import { useFileUpload } from "@/lib/storage/use-file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  // Reports the field's current uploaded URL (or null once removed) — for forms
  // that need to derive something else from this image (e.g. a separately
  // cropped thumbnail) without re-reading it back out of the DOM.
  onUploaded?: (url: string | null) => void;
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
  onUploaded,
}: FileUploadFieldProps) {
  const [file, setFile] = useState<{ url: string; name: string } | null>(
    defaultUrl ? { url: defaultUrl, name: defaultUrl.split("/").pop() ?? defaultUrl } : null,
  );
  const [pendingImage, setPendingImage] = useState<{ src: string; name: string; type: string } | null>(null);
  // Per-upload opt-out of the crop dialog — distinct from the `disableCrop` prop,
  // which removes cropping entirely for fields that never want it (e.g. logos).
  // This lets the same field crop photos but skip cropping for posters/flyers,
  // which often aren't the field's usual aspect ratio and shouldn't be cut down to it.
  const [skipCrop, setSkipCrop] = useState(false);
  const { upload, uploading, error } = useFileUpload();

  function resetFileInput() {
    const input = document.getElementById(name) as HTMLInputElement | null;
    if (input) input.value = "";
  }

  async function handleFileSelected(selected: File) {
    if (kind !== "image" || disableCrop || skipCrop) {
      const result = await upload(selected, folder);
      if (result) {
        setFile({ url: result.url, name: result.fileName });
        onUploaded?.(result.url);
      }
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
    if (result) {
      setFile({ url: result.url, name: result.fileName });
      onUploaded?.(result.url);
    }
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
            onClick={() => {
              setFile(null);
              onUploaded?.(null);
            }}
            aria-label={`Remove ${label}`}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {!file && (
        <>
          {kind === "image" && !disableCrop && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={skipCrop} onCheckedChange={setSkipCrop} />
              Skip cropping (use the image as uploaded — for posters/flyers)
            </label>
          )}
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
        </>
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
