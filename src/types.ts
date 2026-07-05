export type FontWeight = 300 | 400 | 600 | 700;
export type FontWidth = 75 | 87.5 | 100; // font-stretch, %
export type Align = 'left' | 'center' | 'right';

export interface TitleLine {
  id: string;
  text: string;
  weight: FontWeight;
  width: FontWidth;
  size: number;         // px (эффективный, как в PSD)
  opacity: number;      // 0..1
  color: string;        // hex
  underline: boolean;
  tracking: number;     // единицы Photoshop (1/1000 em)
  spacingBefore: number; // px, смещение базовой линии от предыдущей строки
  align: Align;
}

export interface TitleState {
  lines: TitleLine[];
}

export interface TitlePreset {
  name: string;
  builtin: boolean;
  title: TitleState;
}

// Универсальный спек текстового узла купона — единый рендер через CouponText.vue.
// Дефолты (см. CouponText): Bahnschrift, weight 400, width 100%, tracking 0, opacity 1, #ffffff, anchor start.
export interface SvgTextSpec {
  text: string;
  x: number;
  y: number; // базовая линия
  size: number;
  family?: string;
  weight?: number;
  width?: number;    // font-stretch %
  tracking?: number; // единицы Photoshop (1/1000 em)
  opacity?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  underline?: boolean;
}

export interface PsdText {
  text: string;
  x: number;
  y: number; // базовая линия
  size: number;
  family: 'Bahnschrift' | 'Arial';
  weight: number;
  width: number;      // font-stretch %
  tracking: number;
  opacity: number;
  color: string;
  anchor: 'start' | 'middle' | 'end';
}

export interface PsdImage {
  href: string;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
}
