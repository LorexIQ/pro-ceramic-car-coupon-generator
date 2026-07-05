<script setup lang="ts">
// ЧИСТЫЙ рендер купона: store → SVG #coupon-svg.
// Экспорт PNG и печать клонируют этот же узел — расхождение превью/экспорт структурно невозможно.
import { computed } from 'vue';
import { state } from '../../store';
import {
  CANVAS_W, CANVAS_H, IMAGES, STATIC_TEXTS, PHONE_TEXT, DEFAULT_PHONE,
  PLATE_SLOTS, PLATE_IMAGE, TITLE_BASE_BASELINE,
  TITLE_CENTER_X, TITLE_LEFT_X, TITLE_RIGHT_X, COUPON_CODE_POS
} from '../../constants/layout';
import type { Align, SvgTextSpec } from '../../types';
import { formatPhone, plateChars } from '../../utils/format';
import CouponText from './CouponText.vue';

const TITLE_X: Record<Align, number> = { left: TITLE_LEFT_X, center: TITLE_CENTER_X, right: TITLE_RIGHT_X };
const TITLE_ANCHOR: Record<Align, 'start' | 'middle' | 'end'> = { left: 'start', center: 'middle', right: 'end' };

const phoneText = computed<SvgTextSpec>(() => ({
  ...PHONE_TEXT,
  text: state.phoneDigits.length === 10 ? formatPhone(state.phoneDigits) : DEFAULT_PHONE
}));

// Заголовок: базовая линия каждой строки = предыдущая + её spacingBefore
const titleTexts = computed<{ id: string; spec: SvgTextSpec }[]>(() => {
  let baseline = TITLE_BASE_BASELINE;
  return state.title.lines.map((l) => {
    baseline += l.spacingBefore;
    return {
      id: l.id,
      spec: {
        text: l.text,
        x: TITLE_X[l.align],
        y: baseline,
        size: l.size,
        weight: l.weight,
        width: l.width,
        tracking: l.tracking,
        opacity: l.opacity,
        color: l.color,
        anchor: TITLE_ANCHOR[l.align],
        underline: l.underline
      }
    };
  });
});

// Гос номер: null, пока номер не введён полностью
const plateTexts = computed<SvgTextSpec[] | null>(() => {
  const chars = plateChars(state.plateRaw);
  if (!chars) return null;
  return chars.map(({ char, slot }) => ({
    text: char,
    x: PLATE_SLOTS[slot].cx,
    y: PLATE_SLOTS[slot].y,
    size: PLATE_SLOTS[slot].size,
    family: 'RoadNumbers',
    tracking: 10,
    color: '#000000',
    anchor: 'middle' as const
  }));
});

const plateImageHref = computed(() => (plateTexts.value ? PLATE_IMAGE.filled : PLATE_IMAGE.empty));

const codeText = computed<SvgTextSpec | null>(() =>
  state.couponCode
    ? { ...COUPON_CODE_POS, text: state.couponCode, weight: 300, anchor: 'middle' }
    : null
);
</script>

<template>
  <svg
    id="coupon-svg"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${CANVAS_W} ${CANVAS_H}`"
    :width="CANVAS_W"
    :height="CANVAS_H"
  >
    <image
      v-for="img in IMAGES"
      :key="img.href"
      :href="img.href"
      :x="img.x"
      :y="img.y"
      :width="img.w"
      :height="img.h"
      :opacity="img.opacity"
    />

    <!-- Плашка гос номера: с разметкой слотов, пока номер не введён полностью -->
    <image
      :href="plateImageHref"
      :x="PLATE_IMAGE.x"
      :y="PLATE_IMAGE.y"
      :width="PLATE_IMAGE.w"
      :height="PLATE_IMAGE.h"
      :opacity="PLATE_IMAGE.opacity"
    />

    <coupon-text v-for="t in STATIC_TEXTS" :key="t.text" :spec="t" />

    <!-- Заголовок -->
    <coupon-text v-for="l in titleTexts" :key="l.id" :spec="l.spec" />

    <!-- Телефон -->
    <coupon-text :spec="phoneText" />

    <!-- Гос номер (только если полный) -->
    <template v-if="plateTexts">
      <coupon-text v-for="(t, i) in plateTexts" :key="i" :spec="t" />
    </template>

    <!-- Код подписи -->
    <coupon-text v-if="codeText" :spec="codeText" />
  </svg>
</template>
