import { useMemo, useState } from 'react';
import { Plus, Check, Trash2, ListChecks, Calendar, Flag } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Sheet } from '../components/Sheet.jsx';
import {
  dateKey,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatShortDate,
} from '../lib/date.js';

const FILTERS = [
  { id: 'today', label: 'Сегодня' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
  { id: 'all', label: 'Все' },
  { id: 'overdue', label: 'Просрочено' },
];

const PRIORITIES = [
  { id: 'low', label: 'Низкий', tag: 'tag-muted' },
  { id: 'normal', label: 'Обычный', tag: '' },
  { id: 'high', label: 'Высокий', tag: 'tag-amber' },
  { id: 'urgent', label: 'Срочный', tag: 'tag-red' },
];

function inRange(taskDue, start, end) {
  if (!taskDue) return false;
  const t = new Date(taskDue).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function TasksPage() {
  const [tasks, setTasks] = useLocalStorage('hub-tasks', []);
  const [filter, setFilter] = useState('today');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', notes: '', dueDate: dateKey(), priority: 'normal' });

  const counts = useMemo(() => {
    const now = new Date();
    const today = { s: startOfDay(now), e: endOfDay(now) };
    const week = { s: startOfWeek(now), e: endOfWeek(now) };
    const month = { s: startOfMonth(now), e: endOfMonth(now) };
    return {
      today: tasks.filter((t) => !t.completed && inRange(t.dueDate, today.s, today.e)).length,
      week: tasks.filter((t) => !t.completed && inRange(t.dueDate, week.s, week.e)).length,
      month: tasks.filter((t) => !t.completed && inRange(t.dueDate, month.s, month.e)).length,
      all: tasks.filter((t) => !t.completed).length,
      overdue: tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < startOfDay(now)).length,
    };
  }, [tasks]);

  const filtered = useMemo(() => {
    const now = new Date();
    let list = [...tasks];
    if (filter === 'today') {
      const s = startOfDay(now);
      const e = endOfDay(now);
      list = list.filter((t) => inRange(t.dueDate, s, e));
    } else if (filter === 'week') {
      const s = startOfWeek(now);
      const e = endOfWeek(now);
      list = list.filter((t) => inRange(t.dueDate, s, e));
    } else if (filter === 'month') {
      const s = startOfMonth(now);
      const e = endOfMonth(now);
      list = list.filter((t) => inRange(t.dueDate, s, e));
    } else if (filter === 'overdue') {
      const s = startOfDay(now);
      list = list.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < s);
    }
    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    });
  }, [tasks, filter]);

  const addTask = () => {
    if (!draft.title.trim()) return;
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: draft.title.trim(),
        notes: draft.notes.trim(),
        dueDate: draft.dueDate || null,
        priority: draft.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft({ title: '', notes: '', dueDate: dateKey(), priority: 'normal' });
    setSheetOpen(false);
  };

  const toggle = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const remove = (id) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <p className="section-eyebrow">Tasks</p>
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Задачи</h1>
              <p className="page-subtitle">
                Планируй на день, неделю, месяц. Всё хранится локально.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Новая задача
            </button>
          </div>
        </div>

        <div className="chip-row">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="chip-count">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><ListChecks /></div>
            <h3 className="empty-title">Задач нет</h3>
            <p className="empty-desc">
              {filter === 'today'
                ? 'На сегодня ничего не запланировано — отдохни или добавь дело.'
                : 'Пусто. Добавь первую задачу, чтобы начать.'}
            </p>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Добавить задачу
            </button>
          </div>
        ) : (
          <div className="item-list">
            {filtered.map((t) => {
              const pri = PRIORITIES.find((p) => p.id === t.priority) || PRIORITIES[1];
              const overdue =
                !t.completed && t.dueDate && new Date(t.dueDate) < startOfDay(new Date());
              return (
                <div key={t.id} className={`item-card ${t.completed ? 'is-done' : ''}`}>
                  <button
                    className={`check ${t.completed ? 'is-checked' : ''}`}
                    onClick={() => toggle(t.id)}
                    aria-label={t.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                  >
                    <Check />
                  </button>
                  <div className="item-main">
                    <p className="item-title">{t.title}</p>
                    <div className="item-sub">
                      {t.dueDate && (
                        <span className={`tag ${overdue ? 'tag-red' : 'tag-muted'}`}>
                          <Calendar size={11} /> {formatShortDate(t.dueDate)}
                        </span>
                      )}
                      {t.priority !== 'normal' && (
                        <span className={`tag ${pri.tag}`}>
                          <Flag size={11} /> {pri.label}
                        </span>
                      )}
                      {t.notes && <span style={{ color: 'var(--text-muted)' }}>{t.notes}</span>}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="icon-btn is-danger"
                      onClick={() => remove(t.id)}
                      aria-label="Удалить"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Новая задача"
        description="Опиши, что нужно сделать."
      >
        <div className="sheet-form">
          <div className="field">
            <label className="field-label">Название</label>
            <input
              className="input"
              placeholder="Например: купить кофе"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              autoFocus
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Дата</label>
              <input
                type="date"
                className="input"
                value={draft.dueDate || ''}
                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field-label">Приоритет</label>
              <select
                className="select"
                value={draft.priority}
                onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Заметка (необязательно)</label>
            <textarea
              className="textarea"
              placeholder="Детали, ссылки, контекст…"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </div>
          <div className="sheet-actions">
            <button className="btn btn-ghost" onClick={() => setSheetOpen(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={addTask} disabled={!draft.title.trim()}>
              <Plus /> Добавить
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  );
}
