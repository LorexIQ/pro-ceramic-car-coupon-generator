import type { FactoryOpts } from 'imask';
import { computed, watch } from 'vue';

import { STORAGE_KEYS } from '../constants/storage';
import { state } from '../store';
import { readLocal, writeLocal } from '../utils/storage';

import { useMaskedInput } from './useMaskedInput';

const PHONE_MASK: FactoryOpts = { mask: '+7 (000) 000-00-00' };

// Из произвольной строки (ввод, вставка, эхо собственной маски) — до 10 значимых цифр.
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (raw.trimStart().startsWith('+7'))
    digits = digits.slice(1); // '7' из префикса маски — не часть номера
  else if (digits.length >= 11 && (digits[0] === '7' || digits[0] === '8'))
    digits = digits.slice(1); // вставка с кодом страны

  return digits.slice(0, 10);
}

export function usePhone() {
  const saved = readLocal(STORAGE_KEYS.phone);

  if (saved && /^\d{0,10}$/.test(saved)) state.phoneDigits = saved;

  const { display, unmasked, onInput } = useMaskedInput(PHONE_MASK, normalizePhone);

  if (state.phoneDigits) onInput(state.phoneDigits);

  watch(unmasked, (digits) => {
    state.phoneDigits = digits;
  });

  watch(
    () => state.phoneDigits,
    (digits) => writeLocal(STORAGE_KEYS.phone, digits),
  );

  const error = computed(() =>
    state.phoneDigits.length > 0 && state.phoneDigits.length < 10 ? 'Номер неполный' : null,
  );

  return { display, onInput, error };
}
