import { Pill, Download, Upload, Trash2, Info } from 'lucide-react';

export function SettingsPage({ settings, setSettings }) {
  const togglePills = () => setSettings({ ...settings, pillsEnabled: !settings.pillsEnabled });

  const exportAll = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('hub-tasks') || '[]'),
      habits: JSON.parse(localStorage.getItem('hub-habits') || '[]'),
      pills: JSON.parse(localStorage.getItem('hub-pills') || '[]'),
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAll = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.tasks) localStorage.setItem('hub-tasks', JSON.stringify(data.tasks));
        if (data.habits) localStorage.setItem('hub-habits', JSON.stringify(data.habits));
        if (data.pills) localStorage.setItem('hub-pills', JSON.stringify(data.pills));
        if (data.settings) setSettings(data.settings);
        alert('Импорт выполнен. Перезагружаю страницу.');
        location.reload();
      } catch {
        alert('Не удалось прочитать файл.');
      }
    };
    reader.readAsText(file);
  };

  const wipeAll = () => {
    if (!confirm('Удалить ВСЕ данные? Это нельзя отменить.')) return;
    ['hub-tasks', 'hub-habits', 'hub-pills', 'hub-settings'].forEach((k) =>
      localStorage.removeItem(k)
    );
    location.reload();
  };

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <p className="section-eyebrow">Settings</p>
          <h1 className="page-title">Настройки</h1>
          <p className="page-subtitle">
            Включай разделы и управляй данными. Всё хранится локально в браузере.
          </p>
        </div>

        <p className="card-eyebrow">Разделы</p>
        <div className="settings-list" style={{ marginBottom: 32 }}>
          <div className="settings-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--badge-bg)',
                color: 'var(--badge-text)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Pill />
            </div>
            <div className="settings-row-main">
              <p className="settings-row-title">Раздел «Таблетки»</p>
              <p className="settings-row-desc">
                Включи персональный режим напоминаний о приёме. Можно указать имя.
              </p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={!!settings.pillsEnabled} onChange={togglePills} />
              <span className="toggle-slider" />
            </label>
          </div>

          {settings.pillsEnabled && (
            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <div className="settings-row-main">
                <p className="settings-row-title">Имя владельца таблеток</p>
                <p className="settings-row-desc">Будет показано в шапке раздела.</p>
              </div>
              <input
                className="input"
                placeholder="Например: Маша"
                value={settings.pillsOwnerName || ''}
                onChange={(e) => setSettings({ ...settings, pillsOwnerName: e.target.value })}
              />
            </div>
          )}
        </div>

        <p className="card-eyebrow">Данные</p>
        <div className="settings-list" style={{ marginBottom: 32 }}>
          <div className="settings-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--badge-bg)',
                color: 'var(--badge-text)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Download />
            </div>
            <div className="settings-row-main">
              <p className="settings-row-title">Экспорт</p>
              <p className="settings-row-desc">Скачай резервную копию всех задач, привычек и таблеток.</p>
            </div>
            <button className="btn btn-subtle" onClick={exportAll}>Скачать</button>
          </div>
          <div className="settings-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--badge-bg)',
                color: 'var(--badge-text)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Upload />
            </div>
            <div className="settings-row-main">
              <p className="settings-row-title">Импорт</p>
              <p className="settings-row-desc">Восстанови данные из JSON-файла.</p>
            </div>
            <label className="btn btn-subtle" style={{ cursor: 'pointer' }}>
              Выбрать файл
              <input
                type="file"
                accept="application/json"
                onChange={(e) => e.target.files?.[0] && importAll(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className="settings-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'color-mix(in srgb, var(--accent-red) 14%, var(--bg))',
                color: 'var(--accent-red)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Trash2 />
            </div>
            <div className="settings-row-main">
              <p className="settings-row-title">Очистить всё</p>
              <p className="settings-row-desc">Удалит задачи, привычки, таблетки и настройки.</p>
            </div>
            <button className="btn btn-danger" onClick={wipeAll}>Удалить</button>
          </div>
        </div>

        <p className="card-eyebrow">О приложении</p>
        <div className="settings-list">
          <div className="settings-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Info />
            </div>
            <div className="settings-row-main">
              <p className="settings-row-title">Life Hub · v3.0</p>
              <p className="settings-row-desc">
                PWA — установи на главный экран и открывай как приложение. Работает офлайн.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
