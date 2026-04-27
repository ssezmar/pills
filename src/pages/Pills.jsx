import { useMemo, useState } from 'react';
import { Plus, Check, Trash2, Pill, Clock, Heart } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Sheet } from '../components/Sheet.jsx';
import { dateKey } from '../lib/date.js';

function timeUntil(time) {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);
  const diff = target - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours === 0) return `через ${minutes}м`;
  return `через ${hours}ч ${minutes}м`;
}

export function PillsPage({ ownerName }) {
  const [pills, setPills] = useLocalStorage('hub-pills', []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', dosage: '', time: '09:00' });

  const today = dateKey();

  const sorted = useMemo(() => {
    return [...pills].sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [pills]);

  const addPill = () => {
    if (!draft.name.trim() || !draft.time) return;
    setPills([
      ...pills,
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        dosage: draft.dosage.trim(),
        time: draft.time,
        history: {},
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft({ name: '', dosage: '', time: '09:00' });
    setSheetOpen(false);
  };

  const markTaken = (id) => {
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

  const remove = (id) => setPills(pills.filter((p) => p.id !== id));

  const taken = pills.filter((p) => p.history?.[today]).length;

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <p className="section-eyebrow">Pills · {ownerName || 'персональный режим'}</p>
          <div className="page-header-row">
            <div>
              <h1 className="page-title">
                Таблетки {ownerName && <span style={{ color: 'var(--accent-pink)' }}>♡</span>}
              </h1>
              <p className="page-subtitle">
                {ownerName
                  ? `Расписание для ${ownerName}. Сегодня принято: ${taken}/${pills.length}.`
                  : `Сегодня принято: ${taken}/${pills.length}.`}
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Добавить
            </button>
          </div>
        </div>

        {pills.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Pill /></div>
            <h3 className="empty-title">Список пуст</h3>
            <p className="empty-desc">
              Добавь первую таблетку — название, дозировку и время приёма.
            </p>
            <button className="btn btn-primary" onClick={() => setSheetOpen(true)}>
              <Plus /> Добавить таблетку
            </button>
          </div>
        ) : (
          <div className="item-list">
            {sorted.map((p) => {
              const isTaken = !!p.history?.[today];
              return (
                <div key={p.id} className={`item-card ${isTaken ? 'is-done' : ''}`}>
                  <button
                    className={`check ${isTaken ? 'is-checked' : ''}`}
                    onClick={() => markTaken(p.id)}
                    aria-label={isTaken ? 'Отменить приём' : 'Отметить как принятое'}
                  >
                    <Check />
                  </button>
                  <div className="item-main">
                    <p className="item-title">{p.name}</p>
                    <div className="item-sub">
                      <span className="tag">
                        <Clock size={11} /> {p.time}
                      </span>
                      {p.dosage && <span className="tag tag-pink">{p.dosage}</span>}
                      {!isTaken && (
                        <span className="tag tag-muted">{timeUntil(p.time)}</span>
                      )}
                      {isTaken && (
                        <span className="tag tag-green">
                          <Check size={11} /> Принято
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="icon-btn is-danger"
                      onClick={() => remove(p.id)}
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

        {ownerName && pills.length > 0 && (
          <div className="card" style={{ marginTop: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'color-mix(in srgb, var(--accent-pink) 18%, var(--bg))',
                color: 'var(--accent-pink)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Heart />
            </div>
            <div>
              <p className="card-title" style={{ fontSize: 16 }}>Заботься о себе, {ownerName}</p>
              <p className="card-meta">Просто отмечай галочки — данные хранятся только на этом устройстве.</p>
            </div>
          </div>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Новая таблетка"
        description="Название, дозировка и время приёма."
      >
        <div className="sheet-form">
          <div className="field">
            <label className="field-label">Название</label>
            <input
              className="input"
              placeholder="Например: Магний"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Время</label>
              <input
                type="time"
                className="input"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field-label">Дозировка</label>
              <input
                className="input"
                placeholder="1 таблетка"
                value={draft.dosage}
                onChange={(e) => setDraft({ ...draft, dosage: e.target.value })}
              />
            </div>
          </div>
          <div className="sheet-actions">
            <button className="btn btn-ghost" onClick={() => setSheetOpen(false)}>Отмена</button>
            <button
              className="btn btn-primary"
              onClick={addPill}
              disabled={!draft.name.trim() || !draft.time}
            >
              <Plus /> Добавить
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  );
}
