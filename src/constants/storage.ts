// Все ключи браузерных хранилищ в одном месте.
// Инвариант: гос номер НЕ сохраняется нигде (см. AGENTS.md).
export const STORAGE_KEYS = {
  /** localStorage: до 10 цифр телефона без кода страны */
  phone: 'pcc:phone',
  /** localStorage: TitleState текущего заголовка */
  title: 'pcc:title',
  /** localStorage: пользовательские пресеты TitlePreset[] */
  userPresets: 'pcc:userPresets',
  /** IndexedDB (idb-keyval): JSON файла подписи */
  signatureKey: 'pcc:sigkey',
} as const;
