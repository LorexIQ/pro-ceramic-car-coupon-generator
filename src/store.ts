import { reactive } from 'vue';

import { BUILTIN_PRESETS } from './constants/layout';
import type { TitleState } from './types';
import { deepClone } from './utils/clone';

export const state = reactive({
  phoneDigits: '', // до 10 цифр, без кода страны
  plateRaw: '', // символы номера без пробелов, например 'О515ТА32'
  title: deepClone(BUILTIN_PRESETS[0].title) as TitleState,
  couponCode: '' as string, // 'PCC-XXXXX-XXXXX-XXXXX'; генерируется в момент экспорта/печати
  keyLoaded: false,
});

export function resetTitle(t: TitleState) {
  state.title = deepClone(t);
}
