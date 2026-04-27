import { useMemo } from 'react';
import {
  ListChecks,
  Repeat,
  Pill,
  Flame,
  CalendarDays,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { ProgressRing } from '../components/ProgressRing.jsx';
import {
  dateKey,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  formatLongDate,
  greeting,
  weekDates,
  shortDayName,
} from '../lib/date.js';

export function DashboardPage({ navigate, settings }) {
  const [tasks, setTasks] = useLocalStorage('hub-tasks', []);
  const [habits, setHabits] = useLocalStorage('hub-habits', []);
  const [pills, setPills] = useLocalStorage('hub-pills', []);

  const now = new Date();
  const today = dateKey(now);

  const stats = useMemo(() => {
    const tStart = startOfDay(now);
    const tEnd = endOfDay(now);
    const wStart = startOfWeek(now);
    const wEnd = endOfWeek(now);

    const inToday = (t) =>
      t.dueDate &&
      new Date(t.dueDate) >= tStart &&
      new Date(t.dueDate) <= tEnd;
    const inWeek = (t) =>
      t.dueDate &&
      new Date(t.dueDate) >= wStart &&
      new Date(t.dueDate) <= wEnd;

    const todayTasks = tasks.filter(inToday);
    const todayDone = todayTasks.filter((t) => t.completed).length;
    const weekDone = tasks.filter((t) => inWeek(t) && t.completed).length;
    const weekTotal = tasks.filter(inWeek).length;

    const habitsToday = habits.filter((h) => h.history?.[today]).length;
    const pillsToday = pills.filter((p) => p.history?.[today]).length;

    return {
      todayTasks,
      todayDone,
      todayTotal: todayTasks.length,
      taskRing: todayTasks.length ? todayDone / todayTasks.length : 0,
      weekDone,
      weekTotal,
      habitsToday,
      habitsTotal: habits.length,
      habitRing: habits.length ? habitsToday / habits.length : 0,
      pillsToday,
      pillsTotal: pills.length,
      pillRing: pills.length ? pillsToday / pills.length : 0,
    };
  }, [tasks, habits, pills, today]);

  const longestStreak = useMemo(() => {
    let max = 0;
    for (const h of habits) {
      let s = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (h.history?.[dateKey(d)]) s += 1;
        else if (i === 0) continue;
        else break;
      }
      if (s > max) max = s;
    }
    return max;
  }, [habits]);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };
  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) => {
        if (h.id !== id) return h;
        const next = { ...(h.history || {}) };
        if (next[today]) delete next[today];
        else next[today] = true;
        return { ...h, history: next };
      })
    );
  };
  const togglePill = (id) => {
    setPills(
      pills.map((p) => {
        if (p.id !== id) return p;
        const next = { ...(p.history || {}) };
        if (next[today]) delete next[today];
        else next[today] = new Date().toISOString();
        return { ...p, history: next };
      })
    );
  };

  return (
    <section className="section">
      <div className="container">
        <div className="hero-card">
          <div className="hero-card-inner">
            <div>
              <h1 className="hero-greeting">{greeting()}!</h1>
              <p className="hero-date">{formatLongDate()}</p>
            </div>
            <ProgressRing
              value={
                stats.todayTotal + stats.habitsTotal + stats.pillsTotal === 0
                  ? 0
                  : (stats.todayDone + stats.habitsToday + stats.pillsToday) /
                    (stats.todayTotal + stats.habitsTotal + stats.pillsTotal)
              }
            />
          </div>
        </div>

        <div className="dash-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card widget-stat">
            <div className="stat-card-header">
              <div className="stat-card-icon"><ListChecks size={14} /></div>
              Задачи · сегодня
            </div>
            <div className="stat-card-value">{stats.todayDone}/{stats.todayTotal}</div>
            <div className="stat-card-meta">{stats.weekDone} из {stats.weekTotal} за неделю</div>
          </div>

          <div className="stat-card widget-stat">
            <div className="stat-card-header">
              <div className="stat-card-icon"><Repeat size={14} /></div>
              Привычки · сегодня
            </div>
            <div className="stat-card-value">{stats.habitsToday}/{stats.habitsTotal}</div>
            <div className="stat-card-meta">
              {Math.round(stats.habitRing * 100)}% выполнено
            </div>
          </div>

          {settings.pillsEnabled ? (
            <div className="stat-card widget-stat">
              <div className="stat-card-header">
                <div className="stat-card-icon"><Pill size={14} /></div>
                Таблетки · сегодня
              </div>
              <div className="stat-card-value">{stats.pillsToday}/{stats.pillsTotal}</div>
              <div className="stat-card-meta">
                {settings.pillsOwnerName ? `для ${settings.pillsOwnerName}` : 'персональный режим'}
              </div>
            </div>
          ) : (
            <div className="stat-card widget-stat">
              <div className="stat-card-header">
                <div className="stat-card-icon"><CalendarDays size={14} /></div>
                Дата
              </div>
              <div className="stat-card-value">{now.getDate()}</div>
              <div className="stat-card-meta">
                {now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          )}

          <div className="stat-card widget-stat">
            <div className="stat-card-header">
              <div className="stat-card-icon"><Flame size={14} /></div>
              Лучший streak
            </div>
            <div className="stat-card-value">{longestStreak}</div>
            <div className="stat-card-meta">
              {longestStreak === 0 ? 'Начни сегодня' : 'дней подряд'}
            </div>
          </div>
        </div>

        <div className="dash-grid">
          {/* Today's tasks */}
          <div className="card widget-wide">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p className="card-eyebrow">На сегодня</p>
                <h2 className="card-title">Задачи</h2>
              </div>
              <button className="btn btn-subtle" onClick={() => navigate('/tasks')}>
                Все <ArrowRight />
              </button>
            </div>
            {stats.todayTasks.length === 0 ? (
              <div className="empty" style={{ padding: '32px 16px' }}>
                <div className="empty-icon"><ListChecks /></div>
                <h3 className="empty-title">Сегодня свободно</h3>
                <p className="empty-desc">Запланируй что-нибудь на день — даже одна задача уже шаг.</p>
                <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
                  <Plus /> Добавить
                </button>
              </div>
            ) : (
              <div className="item-list">
                {stats.todayTasks.slice(0, 5).map((t) => (
                  <div key={t.id} className={`item-card ${t.completed ? 'is-done' : ''}`}>
                    <button
                      className={`check ${t.completed ? 'is-checked' : ''}`}
                      onClick={() => toggleTask(t.id)}
                    >
                      <Check />
                    </button>
                    <div className="item-main">
                      <p className="item-title">{t.title}</p>
                      {t.notes && <p className="item-sub">{t.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Habits today */}
          <div className="card widget-wide">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p className="card-eyebrow">Привычки</p>
                <h2 className="card-title">Прогресс дня</h2>
              </div>
              <button className="btn btn-subtle" onClick={() => navigate('/habits')}>
                Все <ArrowRight />
              </button>
            </div>
            {habits.length === 0 ? (
              <div className="empty" style={{ padding: '32px 16px' }}>
                <div className="empty-icon"><Repeat /></div>
                <h3 className="empty-title">Нет привычек</h3>
                <p className="empty-desc">Добавь первую — небольшая ежедневная привычка меняет многое.</p>
                <button className="btn btn-primary" onClick={() => navigate('/habits')}>
                  <Plus /> Добавить
                </button>
              </div>
            ) : (
              <div className="item-list">
                {habits.slice(0, 5).map((h) => {
                  const done = !!h.history?.[today];
                  return (
                    <div key={h.id} className={`item-card ${done ? 'is-done' : ''}`}>
                      <button
                        className={`check ${done ? 'is-checked' : ''}`}
                        onClick={() => toggleHabit(h.id)}
                      >
                        <Check />
                      </button>
                      <div className="item-main">
                        <p className="item-title">
                          <span style={{ marginRight: 6 }}>{h.emoji}</span>
                          {h.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pills (if enabled) */}
          {settings.pillsEnabled && (
            <div className="card widget-full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p className="card-eyebrow">
                    Таблетки {settings.pillsOwnerName && `· для ${settings.pillsOwnerName}`}
                  </p>
                  <h2 className="card-title">Расписание на сегодня</h2>
                </div>
                <button className="btn btn-subtle" onClick={() => navigate('/pills')}>
                  Все <ArrowRight />
                </button>
              </div>
              {pills.length === 0 ? (
                <div className="empty" style={{ padding: '32px 16px' }}>
                  <div className="empty-icon"><Pill /></div>
                  <h3 className="empty-title">Список пуст</h3>
                  <p className="empty-desc">Добавь таблетки, чтобы видеть их прямо на дашборде.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/pills')}>
                    <Plus /> Добавить
                  </button>
                </div>
              ) : (
                <div className="item-list">
                  {pills
                    .slice()
                    .sort((a, b) => (a.time > b.time ? 1 : -1))
                    .map((p) => {
                      const done = !!p.history?.[today];
                      return (
                        <div key={p.id} className={`item-card ${done ? 'is-done' : ''}`}>
                          <button
                            className={`check ${done ? 'is-checked' : ''}`}
                            onClick={() => togglePill(p.id)}
                          >
                            <Check />
                          </button>
                          <div className="item-main">
                            <p className="item-title">{p.name}</p>
                            <div className="item-sub">
                              <span className="tag">{p.time}</span>
                              {p.dosage && <span className="tag tag-pink">{p.dosage}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Week strip */}
          <div className="card widget-full">
            <p className="card-eyebrow">Неделя</p>
            <h2 className="card-title" style={{ marginBottom: 16 }}>Активность по дням</h2>
            <div className="habit-week">
              {weekDates().map((d) => {
                const k = dateKey(d);
                const done =
                  habits.filter((h) => h.history?.[k]).length +
                  tasks.filter((t) => t.completed && t.dueDate?.slice(0, 10) === k).length +
                  (settings.pillsEnabled ? pills.filter((p) => p.history?.[k]).length : 0);
                const total =
                  habits.length +
                  tasks.filter((t) => t.dueDate?.slice(0, 10) === k).length +
                  (settings.pillsEnabled ? pills.length : 0);
                const pct = total ? Math.round((done / total) * 100) : 0;
                const isToday = k === today;
                return (
                  <div key={k} className="habit-day">
                    <div
                      className={`habit-dot ${isToday ? 'is-today' : ''}`}
                      style={{
                        background: pct
                          ? `color-mix(in srgb, var(--accent-blue) ${20 + pct * 0.8}%, var(--bg-subtle))`
                          : undefined,
                        color: pct >= 50 ? '#fff' : 'var(--text-muted)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                      }}
                    >
                      {total ? `${pct}%` : '—'}
                    </div>
                    <span>{shortDayName(d)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
