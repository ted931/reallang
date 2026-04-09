const MAX_DIMENSION = 2048;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function validateMimeType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

export async function processImage(file: File): Promise<{
  base64: string;
  mediaType: string;
}> {
  if (!validateMimeType(file)) {
    throw new Error("PNG, JPEG, WebP, GIF 형식만 지원합니다.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("이미지 크기는 5MB 이하만 가능합니다.");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mediaType: "image/webp" });
      };
      img.onerror = () => reject(new Error("이미지 로드에 실패했습니다."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
    reader.readAsDataURL(file);
  });
}

export function imageFromClipboard(clipboardData: DataTransfer): File | null {
  for (const item of Array.from(clipboardData.items)) {
    if (item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }
  return null;
}
