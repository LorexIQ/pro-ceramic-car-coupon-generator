// localStorage может кидать (приватный режим, запрет cookies) — все обращения через эти обёртки

export function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch { /* приватный режим — работаем без persist */ }
}
