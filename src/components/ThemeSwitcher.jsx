import { Icon } from './Icon.jsx';

const OPTIONS = [
  { id: 'light', icon: 'sun', label: 'Светлая тема' },
  { id: 'dark', icon: 'moon', label: 'Тёмная тема' },
  { id: 'midnight', icon: 'midnight', label: 'Тёмно-синяя тема' },
  { id: 'forest', icon: 'leaf', label: 'Зелёная тема' },
  { id: 'crimson', icon: 'flame', label: 'Красная тема' },
];

export function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div className="theme-switch" role="tablist" aria-label="Тема оформления">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={theme === opt.id}
          aria-label={opt.label}
          title={opt.label}
          data-active={theme === opt.id}
          onClick={() => setTheme(opt.id)}
        >
          <Icon name={opt.icon} />
        </button>
      ))}
    </div>
  );
}
