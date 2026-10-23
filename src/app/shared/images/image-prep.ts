/** Longest edge kept for course photos: sharp on a retina cover, light enough to upload from a phone. */
const MAX_EDGE = 2000;
/** Originals above this are refused before decoding (a phone photo is usually 3–8 MB). */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export class ImagePrepError extends Error {
  constructor(public readonly reason: 'not-image' | 'too-large' | 'unreadable') {
    super(reason);
  }
}

/**
 * Turns a picked or dropped file into what the gallery stores: upright (EXIF orientation applied),
 * at most {@link MAX_EDGE}px on its long side and re-encoded as WebP (JPEG where the browser
 * can't write WebP). Re-encoding also drops the photo's metadata, GPS position included.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new ImagePrepError('not-image');
  if (file.size > MAX_SOURCE_BYTES) throw new ImagePrepError('too-large');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new ImagePrepError('unreadable');
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await toBlob(canvas, 'image/webp', 0.84);
  if (webp?.type === 'image/webp') return webp;
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.86);
  if (!jpeg) throw new ImagePrepError('unreadable');
  return jpeg;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}
