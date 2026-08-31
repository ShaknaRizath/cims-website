// Shared by crop-image.ts (cropped uploads) and compress-image.ts (as-uploaded /
// "skip cropping" uploads) — keeps output well under Cloudinary's free-plan
// 10MB limit regardless of how large the source image was.
export const MAX_OUTPUT_DIMENSION = 1600;
export const JPEG_QUALITY = 0.85;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

export function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

// PNG doesn't compress photographic content well — re-encode as JPEG unless the
// source needs transparency (a PNG with actual alpha, e.g. a logo).
export async function canvasToOutputFile(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  fileName: string,
  sourceMimeType: string,
): Promise<File> {
  const needsTransparency = sourceMimeType === "image/png" && hasTransparency(ctx, canvas.width, canvas.height);
  const outputType = needsTransparency ? "image/png" : "image/jpeg";
  const outputName = needsTransparency ? fileName : fileName.replace(/\.[^./]+$/, "") + ".jpg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? JPEG_QUALITY : undefined),
  );
  if (!blob) throw new Error("Could not export the image.");

  return new File([blob], outputName, { type: outputType });
}
