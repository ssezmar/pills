// Date helpers — все ключи дат в формате 'YYYY-MM-DD' (локальное время)

export function dateKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

// Неделя по понедельникам
export function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export function endOfWeek(d = new Date()) {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  return endOfDay(x);
}

export function startOfMonth(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  return startOfDay(x);
}

export function endOfMonth(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return endOfDay(x);
}

export function isSameDay(a, b) {
  return dateKey(new Date(a)) === dateKey(new Date(b));
}

export function diffDays(a, b) {
  const ms = startOfDay(b) - startOfDay(a);
  return Math.round(ms / (24 * 3600 * 1000));
}

export function lastNDays(n, ref = new Date()) {
  const out = [];
  const base = startOfDay(ref);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(d);
  }
  return out;
}

export function weekDates(ref = new Date()) {
  const start = startOfWeek(ref);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

const SHORT_DAY = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export function shortDayName(d) {
  return SHORT_DAY[new Date(d).getDay()];
}

export function formatLongDate(d = new Date()) {
  return new Date(d).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatShortDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

export function greeting(d = new Date()) {
  const h = new Date(d).getHours();
  if (h < 5) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}
