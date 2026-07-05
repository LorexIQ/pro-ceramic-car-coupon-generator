import { computed, ref } from 'vue';
import { BUILTIN_PRESETS } from '../constants/layout';
import { STORAGE_KEYS } from '../constants/storage';
import { resetTitle, state } from '../store';
import { deepClone } from '../utils/clone';
import { readLocal, writeLocal } from '../utils/storage';
import type { TitlePreset } from '../types';

function load(): TitlePreset[] {
  try {
    const raw = readLocal(STORAGE_KEYS.userPresets);
    const parsed = raw ? (JSON.parse(raw) as (TitlePreset & { title: { offsetY?: number } })[]) : [];
    if (!Array.isArray(parsed)) return [];
    // миграция старого формата: offsetY блока вносим в отступ первой строки
    for (const p of parsed) {
      if (typeof p.title?.offsetY === 'number' && p.title.lines?.[0]) {
        p.title.lines[0].spacingBefore += p.title.offsetY;
      }
      delete p.title?.offsetY;
    }
    return parsed;
  } catch {
    return [];
  }
}

const userPresets = ref<TitlePreset[]>(load());

function persist() {
  writeLocal(STORAGE_KEYS.userPresets, JSON.stringify(userPresets.value));
}

export function usePresets() {
  const all = computed<TitlePreset[]>(() => [...BUILTIN_PRESETS, ...userPresets.value]);

  function apply(p: TitlePreset) {
    resetTitle(p.title);
  }

  function saveCurrent(name: string) {
    const trimmed = name.trim();
    if (!trimmed || BUILTIN_PRESETS.some((p) => p.name === trimmed)) return; // встроенные не перезаписать
    const preset: TitlePreset = { name: trimmed, builtin: false, title: deepClone(state.title) };
    const i = userPresets.value.findIndex((p) => p.name === trimmed);
    if (i >= 0) userPresets.value[i] = preset;
    else userPresets.value.push(preset);
    persist();
  }

  function remove(name: string) {
    userPresets.value = userPresets.value.filter((p) => p.name !== name);
    persist();
  }

  return { all, apply, saveCurrent, remove };
}
