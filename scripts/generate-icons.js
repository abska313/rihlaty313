import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Function to generate a real, valid RGBA PNG using node zlib
function createPng(width, height, drawFn) {
  // Color type 6 (RGBA), 8 bits per channel
  const rowSize = width * 4;
  const rawData = Buffer.alloc((1 + rowSize) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowSize);
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ (byte >> j)) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);

    return Buffer.concat([lenBuf, combined, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Shader / painter for ABSKA dark & maroon luxury emblem
function painter(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = w * 0.48;

  // Background gradient: #0B0B0D to #3B0A18 to #6D1028
  const normDist = Math.min(dist / (w * 0.7), 1);
  let r = Math.round(109 * (1 - normDist * 0.8) + 11 * (normDist * 0.8));
  let g = Math.round(16 * (1 - normDist) + 11 * normDist);
  let b = Math.round(40 * (1 - normDist) + 13 * normDist);

  // Octagon crest ring
  const angle = Math.atan2(dy, dx);
  const octR = (Math.abs(Math.cos(angle * 4)) * 0.15 + 0.85) * (w * 0.32);
  const isRing = Math.abs(dist - octR) < (w * 0.02);
  if (isRing) {
    r = 146; // #922D48
    g = 45;
    b = 72;
  }

  // Center crest emblem
  if (dist < w * 0.18) {
    const isCore = dist < w * 0.06;
    if (isCore) {
      r = 244; // #F4F0F1
      g = 240;
      b = 241;
    } else {
      r = 109; // #6D1028
      g = 16;
      b = 40;
    }
  }

  return [r, g, b, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192, 512x512, apple-touch-icon 180x180, and maskable 512x512
const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'pwa-maskable-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  const buf = createPng(size, size, painter);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Generated ${name} (${size}x${size}, ${buf.length} bytes)`);
}
