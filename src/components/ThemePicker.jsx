import { Sun, Moon, Sparkles, Leaf, Flame, Palette, Check } from 'lucide-react';
import { PRESET_THEMES, DEFAULT_CUSTOM } from '../hooks/useTheme.js';

const PRESET_META = {
  light:    { label: 'Светлая',  icon: Sun,      group: 'light',
              swatches: ['#ffffff', '#fafafa', '#171717', '#0a72ef'] },
  dark:     { label: 'Тёмная',    icon: Moon,     group: 'dark',
              swatches: ['#0a0a0a', '#161616', '#ededed', '#3291ff'] },
  midnight: { label: 'Полночь',   icon: Sparkles, group: 'dark',
              swatches: ['#050a18', '#0a1228', '#e6ecff', '#6ea8ff'] },
  forest:   { label: 'Лес',       icon: Leaf,     group: 'dark',
              swatches: ['#06120c', '#0c1f15', '#d8f5e2', '#4ade80'] },
  crimson:  { label: 'Багровая',  icon: Flame,    group: 'dark',
              swatches: ['#14060a', '#1f0a10', '#ffe1e6', '#ff4655'] },
};

const GROUPS = [
  { id: 'light', label: 'Светлые' },
  { id: 'dark',  label: 'Тёмные'  },
];

const QUICK_ACCENTS = [
  '#0a72ef', '#3291ff', '#7c5cff', '#ff5cc8',
  '#de1d8d', '#ff4655', '#fbbf24', '#4ade80',
  '#0bb8a0', '#ff7a45',
];

function ThemeCard({ id, meta, active, onClick }) {
  const Icn = meta.icon;
  return (
    <button type="button" className={`theme-card ${active ? 'is-active' : ''}`} onClick={onClick}>
      <div className="theme-card-preview">
        {meta.swatches.map((c, i) => (
          <span key={i} className="theme-swatch" style={{ background: c }} />
        ))}
        {active && (
          <span className="theme-card-check"><Check /></span>
        )}
      </div>
      <div className="theme-card-meta">
        <Icn size={14} />
        <span>{meta.label}</span>
      </div>
    </button>
  );
}

export function ThemePicker({ theme, setTheme, custom, setCustom }) {
  const setMode = (mode) => setCustom({ ...custom, mode });
  const setAccent = (accent) => setCustom({ ...custom, accent });
  const setAccent2 = (accent2) => setCustom({ ...custom, accent2 });

  const palette = { ...DEFAULT_CUSTOM, ...custom };
  const customSwatches =
    palette.mode === 'light'
      ? ['#ffffff', '#fafafa', '#171717', palette.accent]
      : ['#0a0a0a', '#161616', '#ededed', palette.accent];

  return (
    <div className="theme-picker">
      {GROUPS.map((g) => (
        <div key={g.id} className="theme-group">
          <p className="card-eyebrow" style={{ marginBottom: 10 }}>{g.label}</p>
          <div className="theme-grid">
            {PRESET_THEMES.filter((id) => PRESET_META[id].group === g.id).map((id) => (
              <ThemeCard
                key={id}
                id={id}
                meta={PRESET_META[id]}
                active={theme === id}
                onClick={() => setTheme(id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="theme-group">
        <p className="card-eyebrow" style={{ marginBottom: 10 }}>Своя тема</p>
        <div className="theme-grid">
          <ThemeCard
            id="custom"
            meta={{ label: 'Кастомная', icon: Palette, swatches: customSwatches }}
            active={theme === 'custom'}
            onClick={() => setTheme('custom')}
          />
        </div>

        <div className={`custom-builder ${theme === 'custom' ? '' : 'is-disabled'}`}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">Режим</label>
            <div className="seg">
              <button
                type="button"
                className={`seg-btn ${palette.mode === 'light' ? 'is-active' : ''}`}
                onClick={() => setMode('light')}
              >
                <Sun size={14} /> Светлый
              </button>
              <button
                type="button"
                className={`seg-btn ${palette.mode === 'dark' ? 'is-active' : ''}`}
                onClick={() => setMode('dark')}
              >
                <Moon size={14} /> Тёмный
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">Основной акцент</label>
              <div className="color-input">
                <input
                  type="color"
                  value={palette.accent}
                  onChange={(e) => setAccent(e.target.value)}
                />
                <input
                  className="input mono"
                  value={palette.accent}
                  onChange={(e) => setAccent(e.target.value)}
                />
              </div>
              <div className="quick-colors">
                {QUICK_ACCENTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="quick-color"
                    style={{ background: c }}
                    onClick={() => setAccent(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-label">Дополнительный</label>
              <div className="color-input">
                <input
                  type="color"
                  value={palette.accent2}
                  onChange={(e) => setAccent2(e.target.value)}
                />
                <input
                  className="input mono"
                  value={palette.accent2}
                  onChange={(e) => setAccent2(e.target.value)}
                />
              </div>
              <div className="quick-colors">
                {QUICK_ACCENTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="quick-color"
                    style={{ background: c }}
                    onClick={() => setAccent2(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setCustom(DEFAULT_CUSTOM)}
            style={{ marginTop: 12 }}
          >
            Сбросить к дефолту
          </button>
        </div>
      </div>
    </div>
  );
}
