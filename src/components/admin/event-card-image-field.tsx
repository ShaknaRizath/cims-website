"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useFileUpload } from "@/lib/storage/use-file-upload";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";

// Bespoke to Events: the poster (coverImageUrl) is uploaded uncropped and shown
// full-size on the event's own page, but the Events listing card needs a definite
// 16:9 region to show — this lets the admin drag/zoom to choose that region from
// the already-uploaded poster, rather than leaving it to an arbitrary center-crop.
export function EventCardImageField({
  posterUrl,
  defaultUrl,
  errors,
}: {
  posterUrl: string | null;
  defaultUrl?: string | null;
  errors?: string[];
}) {
  const [cardImage, setCardImage] = useState<{ url: string; name: string } | null>(
    defaultUrl ? { url: defaultUrl, name: defaultUrl.split("/").pop() ?? defaultUrl } : null,
  );
  const [cropOpen, setCropOpen] = useState(false);
  const { upload, uploading, error } = useFileUpload();

  async function handleCropped(croppedFile: File) {
    setCropOpen(false);
    const result = await upload(croppedFile, "events");
    if (result) setCardImage({ url: result.url, name: result.fileName });
  }

  return (
    <Field>
      <FieldLabel>Card thumbnail</FieldLabel>
      <input type="hidden" name="cardImageUrl" value={cardImage?.url ?? ""} />

      {cardImage && (
        <div className="flex items-center gap-3 rounded-lg border p-2">
          <Image
            src={cardImage.url}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-md object-cover"
            unoptimized
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">{cardImage.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCardImage(null)}
            aria-label="Remove card thumbnail"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={!posterUrl || uploading}
        onClick={() => setCropOpen(true)}
      >
        {uploading ? "Uploading..." : cardImage ? "Choose a different crop" : "Choose card thumbnail"}
      </Button>

      {cropOpen && posterUrl && (
        <ImageCropDialog
          open
          imageSrc={posterUrl}
          fileName="event-card-thumbnail.jpg"
          mimeType="image/jpeg"
          aspectRatio={16 / 9}
          onCancel={() => setCropOpen(false)}
          onCropped={handleCropped}
        />
      )}

      <FieldDescription>
        {posterUrl
          ? "Drag and zoom to pick what shows on the Events listing card. The poster above stays full and uncropped on the event's own page."
          : "Upload a cover image above first."}
      </FieldDescription>
      {error && <FieldError>{error}</FieldError>}
      <FieldError errors={errors?.map((message) => ({ message }))} />
    </Field>
  );
}
