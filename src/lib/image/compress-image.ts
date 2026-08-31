import { MAX_OUTPUT_DIMENSION, loadImage, canvasToOutputFile } from "@/lib/image/canvas-utils";

// Stay comfortably under Cloudinary's free-plan 10MB upload limit — small
// files and non-images pass through untouched.
const SAFE_SIZE_BYTES = 8 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Downscales and recompresses an image file if it's large enough to risk
// exceeding Cloudinary's upload limit — used for uploads that skip the crop
// step (e.g. "Skip cropping" for posters/flyers uploaded as-is), where
// getCroppedImageFile's own size cap never runs.
export async function compressImageIfLarge(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SAFE_SIZE_BYTES) return file;

  const image = await loadImage(await readAsDataUrl(file));

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(image, 0, 0, width, height);

  return canvasToOutputFile(canvas, ctx, file.name, file.type);
}
