import { useMemo, useState } from 'react';
import { Plus, Check, Trash2, Repeat, Flame } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Sheet } from '../components/Sheet.jsx';
import { dateKey, weekDates, shortDayName, lastNDays } from '../lib/date.js';

function calcStreak(history) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (history?.[dateKey(d)]) streak += 1;
    else if (i === 0) continue; // сегодня не считаем как разрыв
    else break;
  }
  return streak;
}

export function HabitsPage() {
  const [habits, setHabits] = useLocalStorage('hub-habits', []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', emoji: '✨' });

  const today = dateKey();
  const week = useMemo(() => weekDates(), []);

  const addHabit = () => {
    if (!draft.name.trim()) return;
    setHabits([
      ...habits,
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        emoji: draft.emoji || '✨',
        history: {},
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft({ name: '', emoji: '✨' });
    setSheetOpen(false);
  };

  const toggleDay = (id, key) => {
    setHabits(
      habits.map((h) => {
        if (h.id !== id) return h;
        const next = { ...(h.history || {}) };
        if (next[key]) delete next[key];
        else next[key] = true;
        return { ...h, history: next };
      })
    );
  };

  const remove = (id) => setHabits(habits.filter((h) => h.id !== id));

  const dayCompletion = (key) => {
    if (habits.length === 0) return 0;
    const done = habits.filter((h) => h.history?.[key]).length;
    return done / habits.length;
  };

  const todayDone = habits.filter((h) => h.history?.[today]).length;

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <p className="section-eyebrow">Habits</p>
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Привычки</h1>
              <p className="page-subtitle">
                Отмечай каждый день — серия не должна прерваться. Сегодня: {todayDone}/{habits.length}.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Новая привычка
            </button>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Repeat /></div>
            <h3 className="empty-title">Привычек пока нет</h3>
            <p className="empty-desc">
              Добавь первую — например, «выпить воду», «зарядка» или «прочитать 10 страниц».
            </p>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Добавить привычку
            </button>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <p className="card-eyebrow">Последние 7 дней — общая активность</p>
              <div className="habit-week">
                {lastNDays(7).map((d) => {
                  const k = dateKey(d);
                  const pct = Math.round(dayCompletion(k) * 100);
                  return (
                    <div key={k} className="habit-day">
                      <div
                        className="habit-dot"
                        style={{
                          background: pct
                            ? `color-mix(in srgb, var(--accent-blue) ${20 + pct * 0.8}%, var(--bg-subtle))`
                            : undefined,
                          color: pct >= 50 ? '#fff' : 'var(--text-muted)',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                        }}
                      >
                        {pct}%
                      </div>
                      <span>{shortDayName(d)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="item-list">
              {habits.map((h) => {
                const streak = calcStreak(h.history);
                return (
                  <div key={h.id} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ fontSize: 28 }}>{h.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="item-title">{h.name}</p>
                        <p className="item-sub">
                          <span className="tag tag-amber">
                            <Flame size={11} /> {streak} {streak === 1 ? 'день' : 'дней'} подряд
                          </span>
                        </p>
                      </div>
                      <button
                        className="icon-btn is-danger"
                        onClick={() => remove(h.id)}
                        aria-label="Удалить привычку"
                      >
                        <Trash2 />
                      </button>
                    </div>
                    <div className="habit-week">
                      {week.map((d) => {
                        const k = dateKey(d);
                        const done = !!h.history?.[k];
                        const isToday = k === today;
                        return (
                          <div key={k} className="habit-day">
                            <button
                              className={`habit-dot ${done ? 'is-done' : ''} ${isToday ? 'is-today' : ''}`}
                              onClick={() => toggleDay(h.id, k)}
                              aria-label={`${shortDayName(d)} ${k}`}
                            >
                              <Check />
                            </button>
                            <span>{shortDayName(d)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Новая привычка"
        description="Что-то, что хочешь делать каждый день."
      >
        <div className="sheet-form">
          <div className="field-row">
            <div className="field">
              <label className="field-label">Эмодзи</label>
              <input
                className="input"
                value={draft.emoji}
                onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                maxLength={4}
              />
            </div>
            <div className="field" style={{ gridColumn: 'span 1' }}>
              <label className="field-label">Название</label>
              <input
                className="input"
                placeholder="Например: 8 стаканов воды"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                autoFocus
              />
            </div>
          </div>
          <div className="sheet-actions">
            <button className="btn btn-ghost" onClick={() => setSheetOpen(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={addHabit} disabled={!draft.name.trim()}>
              <Plus /> Добавить
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  );
}
