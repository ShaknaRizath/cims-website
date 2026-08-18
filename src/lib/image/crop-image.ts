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

// Draws the selected crop region onto an offscreen canvas and returns it as a
// File, ready to hand to the existing upload flow unchanged.
export async function getCroppedImageFile(
  imageSrc: string,
  cropPixels: Area,
  fileName: string,
  mimeType: string,
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

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
    cropPixels.width,
    cropPixels.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType));
  if (!blob) throw new Error("Could not export the cropped image.");

  return new File([blob], fileName, { type: mimeType });
}
