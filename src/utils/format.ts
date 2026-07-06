// letter-spacing в px: tracking (1/1000 em) × размер шрифта
export const letterSpacing = (tracking: number, size: number) => (tracking / 1000) * size;

// 10 цифр → '+7 (900) 123-00-32'; меньше — частичная маска для поля ввода
export function formatPhone(digits: string): string {
  const d = digits.slice(0, 10);

  if (!d) return '';

  let out = `+7 (${d.slice(0, 3)}`;

  if (d.length >= 3) out += ')';

  if (d.length > 3) out += ` ${d.slice(3, 6)}`;

  if (d.length > 6) out += `-${d.slice(6, 8)}`;

  if (d.length > 8) out += `-${d.slice(8, 10)}`;

  return out;
}

// 'О515ТА32' → символы по слотам PLATE_SLOTS; регион 3-й цифрой идёт в слот 6.
// null, если номер не полный (< 8 символов).
export function plateChars(raw: string): { char: string; slot: number }[] | null {
  if (raw.length < 8) return null;

  const chars = raw.split('');
  const result = chars.slice(0, 6).map((char, i) => ({ char, slot: i }));

  result.push({ char: chars.slice(6).join(''), slot: 6 }); // регион целиком в слот 6

  return result;
}
