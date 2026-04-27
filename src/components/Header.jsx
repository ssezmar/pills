import { LayoutDashboard, ListChecks, Repeat, Pill, Settings } from 'lucide-react';

export function buildNav(showPills) {
  const base = [
    { href: '/', label: 'Дашборд', icon: LayoutDashboard },
    { href: '/tasks', label: 'Задачи', icon: ListChecks },
    { href: '/habits', label: 'Привычки', icon: Repeat },
  ];
  if (showPills) base.push({ href: '/pills', label: 'Таблетки', icon: Pill });
  base.push({ href: '/settings', label: 'Настройки', icon: Settings });
  return base;
}

function isActive(route, href) {
  if (href === '/') return route === '/' || route === '';
  return route === href || route.startsWith(href + '/');
}

export function Header({ route, navigate, showPills }) {
  const nav = buildNav(showPills);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a
            href="#/"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <span className="brand-mark">H</span>
            <span className="brand-name">Life Hub</span>
          </a>
          <nav className="nav nav-desktop">
            {nav.map((item) => {
              const Icn = item.icon;
              return (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  className={`nav-link ${isActive(route, item.href) ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                >
                  <Icn />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <nav className="mobile-tabbar" aria-label="Основная навигация">
        {nav.map((item) => {
          const Icn = item.icon;
          return (
            <a
              key={item.href}
              href={`#${item.href}`}
              className={`nav-link ${isActive(route, item.href) ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
            >
              <Icn />
              {item.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}
