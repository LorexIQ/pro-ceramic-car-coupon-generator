import { watch } from 'vue';
import type { FactoryOpts } from 'imask';
import { state } from '../store';
import { useMaskedInput } from './useMaskedInput';

const LATIN_TO_CYR: Record<string, string> = {
  A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н',
  O: 'О', P: 'Р', C: 'С', T: 'Т', Y: 'У', X: 'Х'
};

// Формат: Б ЦЦЦ ББ РР(Р); латиница-двойник приводится к кириллице посимвольно.
const PLATE_MASK: FactoryOpts = {
  mask: 'S 000 SS 00[0]',
  definitions: { S: /[АВЕКМНОРСТУХ]/ },
  prepareChar: (ch: string) => {
    const up = ch.toUpperCase();
    return LATIN_TO_CYR[up] ?? up;
  }
};

export function usePlate() {
  const { display, unmasked, onInput } = useMaskedInput(PLATE_MASK);
  if (state.plateRaw) onInput(state.plateRaw);

  watch(unmasked, (raw) => { state.plateRaw = raw; });

  return { display, onInput };
}
