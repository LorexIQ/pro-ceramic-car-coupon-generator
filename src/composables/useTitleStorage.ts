import { watch } from 'vue';
import { state } from '../store';
import { STORAGE_KEYS } from '../constants/storage';
import { readLocal, writeLocal } from '../utils/storage';
import type { TitleState } from '../types';

export function useTitleStorage() {
  try {
    const saved = readLocal(STORAGE_KEYS.title);
    if (saved) {
      const parsed = JSON.parse(saved) as TitleState & { offsetY?: number };
      if (Array.isArray(parsed.lines) && parsed.lines.length > 0) {
        // миграция старого формата: offsetY блока вносим в отступ первой строки
        if (typeof parsed.offsetY === 'number' && parsed.offsetY !== 0) {
          parsed.lines[0].spacingBefore += parsed.offsetY;
        }
        delete parsed.offsetY;
        state.title = parsed;
      }
    }
  } catch { /* битый JSON — остаёмся на дефолте */ }

  watch(() => state.title, (t) => writeLocal(STORAGE_KEYS.title, JSON.stringify(t)), { deep: true });
}
