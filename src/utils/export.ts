import { CANVAS_W, CANVAS_H } from '../constants/layout';
import { state } from '../store';

import { downloadBlob } from './download';

async function toDataUri(url: string): Promise<string> {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`asset fetch failed: ${url}`);

  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const r = new FileReader();

    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// Автономный SVG: все <image href> и шрифт — data URI
async function standaloneSvg(): Promise<string> {
  const src = document.getElementById('coupon-svg');

  if (!src) throw new Error('coupon svg not found');

  const clone = src.cloneNode(true) as SVGSVGElement;

  for (const img of Array.from(clone.querySelectorAll('image'))) {
    const href = img.getAttribute('href');

    if (href && !href.startsWith('data:')) img.setAttribute('href', await toDataUri(href));
  }

  const [bahnschriftUri, roadNumbersUri] = await Promise.all([
    toDataUri(`${import.meta.env.BASE_URL}fonts/bahnschrift.ttf`),
    toDataUri(`${import.meta.env.BASE_URL}fonts/roadnumbers.otf`),
  ]);
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');

  style.textContent =
    `@font-face{font-family:'Bahnschrift';src:url('${bahnschriftUri}') format('truetype-variations');font-weight:300 700;font-stretch:75% 100%;}` +
    `@font-face{font-family:'RoadNumbers';src:url('${roadNumbersUri}') format('opentype');font-weight:400;}`;
  clone.insertBefore(style, clone.firstChild);

  return new XMLSerializer().serializeToString(clone);
}

// Вставка pHYs (300 DPI = 11811 точек/метр) после IHDR
function crc32(bytes: Uint8Array): number {
  let c: number;
  const table: number[] = [];

  for (let n = 0; n < 256; n++) {
    c = n;

    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;

    table[n] = c;
  }

  let crc = 0xffffffff;

  for (const b of bytes) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);

  return (crc ^ 0xffffffff) >>> 0;
}

export function withPhys(png: Uint8Array): Uint8Array {
  const ppm = 11811;
  const chunk = new Uint8Array(21); // 4 len + 4 type + 9 data + 4 crc
  const dv = new DataView(chunk.buffer);

  dv.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // 'pHYs'
  dv.setUint32(8, ppm);
  dv.setUint32(12, ppm);
  chunk[16] = 1; // единица: метры
  dv.setUint32(17, crc32(chunk.subarray(4, 17)));
  const insertAt = 33; // 8 сигнатура + 25 IHDR
  const out = new Uint8Array(png.length + 21);

  out.set(png.subarray(0, insertAt));
  out.set(chunk, insertAt);
  out.set(png.subarray(insertAt), insertAt + 21);

  return out;
}

export async function renderPngBlob(): Promise<Blob> {
  await document.fonts.ready;
  const svgText = await standaloneSvg();
  const svgUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));

  try {
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('svg render failed'));
      img.src = svgUrl;
    });
    const canvas = document.createElement('canvas');

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.getContext('2d')!.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    const raw: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
    );
    const withDpi = withPhys(new Uint8Array(await raw.arrayBuffer()));

    return new Blob([withDpi], { type: 'image/png' });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function fileName(): string {
  const title = (state.title.lines[0]?.text ?? '').replace(/[\\/:*?"<>|]/g, '').trim() || 'Купон';

  return `ProCeramicCar Coupon ${title}.png`;
}

export async function exportPng(): Promise<void> {
  downloadBlob(await renderPngBlob(), fileName());
}

export async function printCoupon(): Promise<void> {
  const blob = await renderPngBlob();
  const url = URL.createObjectURL(blob);
  const img = document.createElement('img');

  img.id = 'print-coupon';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('print image load failed'));
    img.src = url;
  });
  document.body.appendChild(img);
  await new Promise<void>((resolve) => {
    const done = () => {
      window.removeEventListener('afterprint', done);
      resolve();
    };

    window.addEventListener('afterprint', done);
    window.print();
  });
  document.body.removeChild(img);
  URL.revokeObjectURL(url);
}
