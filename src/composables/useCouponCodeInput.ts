import type { FactoryOpts } from 'imask';
import { computed, ref } from 'vue';

import { state } from '../store';
import { verifyCode } from '../utils/couponCode';

import { useMaskedInput } from './useMaskedInput';
import { useSignatureKey } from './useSignatureKey';

// Маска кода купона PCC-XXXXX-XXXXX-XXXXX; 'PCC-' — литералы, дописываются сами
const CODE_MASK: FactoryOpts = {
  mask: 'PCC-#####-#####-#####',
  definitions: { '#': /[0-9A-Z]/ },
};

// Нормализация Crockford до маски: строчные → прописные, I/L → 1, O → 0
function normalizeChars(raw: string): string {
  return raw.toUpperCase().replace(/[IL]/g, '1').replace(/O/g, '0');
}

export function useCouponCodeInput() {
  const { getCryptoKey } = useSignatureKey();
  const { display, unmasked, onInput } = useMaskedInput(CODE_MASK, normalizeChars);

  const result = ref<null | { valid: boolean; issuedAt?: Date }>(null);

  /** true, когда все 15 значимых символов введены */
  const valid = computed(() => unmasked.value.length === 15 && state.keyLoaded);

  /** после валидации содержит в себе дату выпуска сертификата */
  const issuedStr = computed(() =>
    result.value?.issuedAt
      ? result.value.issuedAt.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
  );

  async function updateValue(raw: string) {
    result.value = null;
    onInput(raw);
  }

  async function confirm() {
    const key = await getCryptoKey();

    if (!key) return;

    result.value = await verifyCode(key, unmasked.value);
  }

  return {
    display,
    valid,
    result,
    issuedStr,
    onInput: updateValue,
    confirm,
  };
}
