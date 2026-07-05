// Глубокая копия plain-данных (title, пресеты) — без функций/дат, поэтому JSON достаточно
export const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
