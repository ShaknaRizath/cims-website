import type { Area } from "react-easy-crop";
import { MAX_OUTPUT_DIMENSION, loadImage, canvasToOutputFile } from "@/lib/image/canvas-utils";

// Draws the selected crop region onto an offscreen canvas and returns it as a
// File, ready to hand to the existing upload flow unchanged. A crop region taken
// from a high-resolution source (e.g. a modern phone photo) can still be several
// thousand pixels wide, so the *output* dimensions are capped too.
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

  return canvasToOutputFile(canvas, ctx, fileName, mimeType);
}
