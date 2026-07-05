import type { PsdImage, PsdText, TitlePreset } from '../types';

export const CANVAS_W = 1752;
export const CANVAS_H = 2486;

const A = (f: string) => `${import.meta.env.BASE_URL}assets/${f}`;

export const IMAGES: PsdImage[] = [
  { href: A('background.png'), x: 0, y: 0, w: 1752, h: 2486, opacity: 1 },
  { href: A('car.png'), x: 509, y: -246, w: 2039, h: 3622, opacity: 1 },
  { href: A('qr.png'), x: 94, y: 1194, w: 480, h: 480, opacity: 1 },
  { href: A('painting.png'), x: 88, y: 1845, w: 785, h: 527, opacity: 0.851 },
  { href: A('stamp.png'), x: 90, y: 1896, w: 500, h: 500, opacity: 0.851 },
  { href: A('phone-icon.png'), x: 900, y: 2285, w: 63, h: 89, opacity: 0.851 }
];

// Плашка гос номера: filled — чистая под введённый номер, empty — с разметкой слотов
export const PLATE_IMAGE = {
  filled: A('plate.png'),
  empty: A('plate-empty.png'),
  x: 756, y: 2025, w: 906, h: 195, opacity: 1
} as const;

// Статичные тексты. y — базовая линия (transform из PSD), size — эффективный (fontSize × scale).
export const STATIC_TEXTS: PsdText[] = [
  { text: 'ProCeramicCar', x: 442.36, y: 258.76, size: 132.6, family: 'Arial', weight: 400, width: 100, tracking: -40, opacity: 0.902, color: '#ffffff', anchor: 'start' },
  { text: 'салон детейлинга', x: 595.36, y: 291.76, size: 30, family: 'Arial', weight: 400, width: 100, tracking: 680, opacity: 0.902, color: '#ffffff', anchor: 'start' },
  { text: 'наши работы', x: 340.28, y: 1153.71, size: 67.8, family: 'Bahnschrift', weight: 700, width: 100, tracking: -40, opacity: 0.851, color: '#ffffff', anchor: 'middle' },
  { text: '@potencycar_32', x: 340.18, y: 1751.81, size: 71.2, family: 'Bahnschrift', weight: 300, width: 75, tracking: -40, opacity: 0.851, color: '#ffffff', anchor: 'middle' },
  { text: 'ВЛАДЕЛЕЦ КУПОНА', x: 961.07, y: 1989.87, size: 51, family: 'Bahnschrift', weight: 700, width: 100, tracking: 10, opacity: 0.851, color: '#ffffff', anchor: 'start' }
];

export const DEFAULT_PHONE = '+7 (000) 000-00-00';

export const PHONE_TEXT = {
  x: 984.53,
  y: 2362.82,
  size: 84.8,
  weight: 300,
  width: 75,
  tracking: 10,
  opacity: 0.851,
  color: '#ffffff'
} as const;

// Гос номер: 7 слотов (Б ЦЦЦ ББ + регион). cx — центр слота (из PSD), y — базовая линия (из PSD).
// size — под шрифт RoadNumbers: плашка 906px = 520мм ГОСТ (1мм = 1.742px);
// цифры 76мм при высоте глифа 646/1000em → 205; буквы 58мм при 498/1000em → 203;
// цифры региона 58мм → 156.
export const PLATE_SLOTS = [
  { cx: 853.5, y: 2182.9, size: 203 },  // буква 1
  { cx: 955, y: 2182.1, size: 200 },    // цифра 1
  { cx: 1051, y: 2182.1, size: 200 },   // цифра 2
  { cx: 1151, y: 2182.7, size: 200 },   // цифра 3
  { cx: 1257, y: 2182.1, size: 203 },   // буква 2
  { cx: 1355.5, y: 2182.4, size: 203 }, // буква 3
  { cx: 1547.5, y: 2151.9, size: 150 }  // регион (2-3 цифры)
] as const;

export const TITLE_BASE_BASELINE = 537; // базовая линия первой строки при spacingBefore=0
export const TITLE_CENTER_X = 876;
export const TITLE_LEFT_X = 266;
export const TITLE_RIGHT_X = 1486;

export const COUPON_CODE_POS = { x: 876, y: 2452, size: 28, opacity: 0.5 } as const;

let idCounter = 0;
export const lineId = () => `line-${Date.now()}-${idCounter++}`;

const line = (p: { text: string; weight: 300 | 700; size: number; spacingBefore: number }) => ({
  id: lineId(),
  text: p.text,
  weight: p.weight as 300 | 700,
  width: (p.weight === 700 ? 100 : 75) as 75 | 100,
  size: p.size,
  opacity: 0.85,
  color: '#ffffff',
  underline: false,
  tracking: -40,
  spacingBefore: p.spacingBefore,
  align: 'center' as const
});

// Базовые линии PSD: П1 = 650.9 / 731.5; П2 = 536.9 / 857.5 / 952.5; П3 = 534.9 / 753.8 / 845.5.
export const BUILTIN_PRESETS: TitlePreset[] = [
  {
    name: 'Сертификат на тонировку',
    builtin: true,
    title: {
      lines: [
        line({ text: 'ПОДАРОЧНЫЙ СЕРТИФИКАТ', weight: 300, size: 149.9, spacingBefore: 113.9 }),
        line({ text: 'на тонировку автомобиля', weight: 300, size: 81.2, spacingBefore: 80.6 })
      ]
    }
  },
  {
    name: 'Купон 5000',
    builtin: true,
    title: {
      lines: [
        line({ text: 'ПОДАРОЧНЫЙ КУПОН', weight: 300, size: 107.4, spacingBefore: 0 }),
        { ...line({ text: '5000', weight: 700, size: 384.4, spacingBefore: 320.6 }), opacity: 1 },
        line({ text: 'рублей на любые услуги', weight: 300, size: 81.2, spacingBefore: 95 })
      ]
    }
  },
  {
    name: 'Именной купон',
    builtin: true,
    title: {
      lines: [
        // spacingBefore -2 вместо прежнего offsetY: -2 — базовая линия та же (534.9 по PSD)
        line({ text: 'ПОДАРОЧНЫЙ КУПОН', weight: 300, size: 107.4, spacingBefore: -2 }),
        { ...line({ text: 'ВИКТОРУ', weight: 700, size: 250, spacingBefore: 218.9 }), opacity: 1 },
        line({ text: 'на сумму 10 000 рублей', weight: 300, size: 81.2, spacingBefore: 91.7 })
      ]
    }
  }
];
