import { readFile } from 'fs/promises';
import path from 'path';

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

export async function loadFonts() {
  if (fontCache) return fontCache;

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const [regular, bold] = await Promise.all([
    readFile(path.join(fontsDir, 'Pretendard-Regular.otf')),
    readFile(path.join(fontsDir, 'Pretendard-Bold.otf')),
  ]);

  fontCache = {
    regular: regular.buffer as ArrayBuffer,
    bold: bold.buffer as ArrayBuffer,
  };
  return fontCache;
}
