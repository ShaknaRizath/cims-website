import type { Area } from "react-easy-crop";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

// A crop region taken from a high-resolution source (e.g. a modern phone photo)
// can still be several thousand pixels wide — capping the *output* dimensions
// keeps the exported file well under Cloudinary's free-plan 10MB upload limit,
// regardless of how large the original source image was.
const MAX_OUTPUT_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

// Draws the selected crop region onto an offscreen canvas and returns it as a
// File, ready to hand to the existing upload flow unchanged.
export async function getCroppedImageFile(
  imageSrc: string,
  cropPixels: Area,
  fileName: string,
  mimeType: string,
): Promise<File> {
  const image = await loadImage(imageSrc);

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(cropPixels.width, cropPixels.height));
  const outputWidth = Math.round(cropPixels.width * scale);
  const outputHeight = Math.round(cropPixels.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context.");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  // PNG doesn't compress photographic content well and can still produce huge
  // files even at a capped resolution — re-encode as JPEG unless the source
  // needs transparency (a PNG with actual alpha, e.g. a logo).
  const needsTransparency = mimeType === "image/png" && hasTransparency(ctx, outputWidth, outputHeight);
  const outputType = needsTransparency ? "image/png" : "image/jpeg";
  const outputName = needsTransparency ? fileName : fileName.replace(/\.[^./]+$/, "") + ".jpg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? JPEG_QUALITY : undefined),
  );
  if (!blob) throw new Error("Could not export the cropped image.");

  return new File([blob], outputName, { type: outputType });
}

function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}
