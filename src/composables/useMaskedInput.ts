import IMask, { type FactoryOpts } from 'imask';
import { ref, type Ref } from 'vue';

export interface MaskedInput {
  /** Отформатированная строка для :value у n-input */
  display: Ref<string>;
  /** Значимые символы без литералов маски */
  unmasked: Ref<string>;
  /** Обработчик @update:value — прогоняет всю строку через маску */
  onInput: (raw: string) => void;
}

// imask используется как чистый движок форматирования, без привязки к DOM:
// n-input отдаёт всю строку через update:value, она прогоняется через маску
// целиком, результат возвращается в :value. Так нет конфликта с внутренним
// обработчиком input у naive-ui.
export function useMaskedInput(
  opts: FactoryOpts,
  normalize?: (raw: string) => string,
): MaskedInput {
  const masked = IMask.createMask(opts);
  const display = ref('');
  const unmasked = ref('');

  function onInput(raw: string) {
    masked.resolve(normalize ? normalize(raw) : raw);
    display.value = masked.value;
    unmasked.value = masked.unmaskedValue;
  }

  return { display, unmasked, onInput };
}
