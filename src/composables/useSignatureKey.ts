import { get, set, del } from 'idb-keyval';
import { state } from '../store';
import { STORAGE_KEYS } from '../constants/storage';
import { downloadBlob } from '../utils/download';
import { generateCode } from '../utils/couponCode';

interface KeyFile {
  v: 1;
  alg: 'HMAC-SHA256';
  key: string; // base64, 32 байта
}

let cachedKey: CryptoKey | null = null;
let initPromise: Promise<void> | null = null;

async function importKey(json: KeyFile): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(json.key), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

function parseKeyFile(text: string): KeyFile | null {
  try {
    const j = JSON.parse(text) as KeyFile;
    if (j.v === 1 && j.alg === 'HMAC-SHA256' && typeof j.key === 'string' && atob(j.key).length === 32) return j;
  } catch { /* не наш файл */ }
  return null;
}

async function restoreFromIdb(): Promise<void> {
  const stored = await get<string>(STORAGE_KEYS.signatureKey);
  if (!stored) return;
  const parsed = parseKeyFile(stored);
  if (!parsed) return;
  cachedKey = await importKey(parsed);
  state.keyLoaded = true;
}

export function useSignatureKey() {
  // восстановление из IndexedDB запускается один раз при первом использовании
  initPromise ??= restoreFromIdb().catch(() => { initPromise = null; });

  async function getCryptoKey(): Promise<CryptoKey | null> {
    await initPromise;
    return cachedKey;
  }

  async function regenerateCode() {
    state.couponCode = cachedKey ? await generateCode(cachedKey) : '';
  }

  async function createAndDownloadKey() {
    const raw = new Uint8Array(32);
    crypto.getRandomValues(raw);
    const file: KeyFile = { v: 1, alg: 'HMAC-SHA256', key: btoa(String.fromCharCode(...raw)) };
    const text = JSON.stringify(file);
    await set(STORAGE_KEYS.signatureKey, text);
    cachedKey = await importKey(file);
    state.keyLoaded = true;
    downloadBlob(new Blob([text], { type: 'application/json' }), 'ProCeramicCar.sig');
  }

  async function loadKeyFile(file: File): Promise<boolean> {
    let text: string;
    try {
      text = await file.text();
    } catch {
      return false;
    }
    const parsed = parseKeyFile(text);
    if (!parsed) return false;
    await set(STORAGE_KEYS.signatureKey, text);
    cachedKey = await importKey(parsed);
    state.keyLoaded = true;
    return true;
  }

  async function forgetKey() {
    await del(STORAGE_KEYS.signatureKey);
    cachedKey = null;
    state.keyLoaded = false;
    state.couponCode = '';
  }

  return { getCryptoKey, createAndDownloadKey, loadKeyFile, forgetKey, regenerateCode };
}
