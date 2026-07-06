// Код купона: 75 бит = payload 35 бит (минуты от эпохи 26 + nonce 9) + HMAC-SHA256 усечённый до 40 бит.
// Кодировка Crockford Base32, формат PCC-XXXXX-XXXXX-XXXXX.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const EPOCH_UTC = Date.UTC(2026, 0, 1);

export const CODE_RE = /^PCC-[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}$/;

function encodeBits(value: bigint, bits: number): string {
  let out = '';

  for (let shift = bits - 5; shift >= 0; shift -= 5) {
    out += ALPHABET[Number((value >> BigInt(shift)) & 31n)];
  }

  return out;
}

function decodeBits(s: string): bigint | null {
  let v = 0n;

  for (const ch of s) {
    const i = ALPHABET.indexOf(ch);

    if (i < 0) return null;

    v = (v << 5n) | BigInt(i);
  }

  return v;
}

function payloadBytes(payload: bigint): Uint8Array {
  const b = new Uint8Array(8);

  for (let i = 7; i >= 0; i--) {
    b[i] = Number(payload & 0xffn);
    payload >>= 8n;
  }

  return b;
}

async function mac40(key: CryptoKey, payload: bigint): Promise<bigint> {
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, payloadBytes(payload)));
  let m = 0n;

  for (let i = 0; i < 5; i++) m = (m << 8n) | BigInt(sig[i]);

  return m;
}

function format(raw15: string): string {
  return `PCC-${raw15.slice(0, 5)}-${raw15.slice(5, 10)}-${raw15.slice(10, 15)}`;
}

// нормализация Crockford: строчные → прописные, I/L → 1, O → 0
export function normalizeCode(input: string): string {
  const cleaned = input
    .toUpperCase()
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/[^0-9A-Z]/g, '');
  const body = cleaned.startsWith('PCC') ? cleaned.slice(3) : cleaned;

  return body.length === 15 ? format(body) : input.toUpperCase().trim();
}

export async function generateCode(key: CryptoKey): Promise<string> {
  const minutes = BigInt(Math.floor((Date.now() - EPOCH_UTC) / 60_000) & 0x3ffffff); // 26 бит ≈ 127 лет
  const rnd = new Uint32Array(1);

  crypto.getRandomValues(rnd);
  const nonce = BigInt(rnd[0] & 0x1ff); // 9 бит
  const payload = (minutes << 9n) | nonce;
  const mac = await mac40(key, payload);

  return format(encodeBits(payload, 35) + encodeBits(mac, 40));
}

export async function verifyCode(
  key: CryptoKey,
  code: string,
): Promise<{ valid: boolean; issuedAt?: Date }> {
  const norm = normalizeCode(code);

  if (!CODE_RE.test(norm)) return { valid: false };

  const raw = norm.replace(/^PCC-/, '').replaceAll('-', '');
  const payload = decodeBits(raw.slice(0, 7));
  const mac = decodeBits(raw.slice(7));

  if (payload === null || mac === null) return { valid: false };

  const expected = await mac40(key, payload);

  if (expected !== mac) return { valid: false };

  const minutes = Number(payload >> 9n);

  return { valid: true, issuedAt: new Date(EPOCH_UTC + minutes * 60_000) };
}
