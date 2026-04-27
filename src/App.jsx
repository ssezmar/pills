import { useTheme } from './hooks/useTheme.js';
import { useRoute } from './hooks/useRoute.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { Header } from './components/Header.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { TasksPage } from './pages/Tasks.jsx';
import { HabitsPage } from './pages/Habits.jsx';
import { PillsPage } from './pages/Pills.jsx';
import { SettingsPage } from './pages/Settings.jsx';

const DEFAULT_SETTINGS = {
  pillsEnabled: false,
  pillsOwnerName: '',
};

export default function App() {
  const { theme, setTheme, custom, setCustom } = useTheme();
  const [route, navigate] = useRoute();
  const [settings, setSettings] = useLocalStorage('hub-settings', DEFAULT_SETTINGS);

  const settingsPage = (
    <SettingsPage
      settings={settings}
      setSettings={setSettings}
      theme={theme}
      setTheme={setTheme}
      custom={custom}
      setCustom={setCustom}
    />
  );

  let page;
  if (route.startsWith('/tasks')) {
    page = <TasksPage />;
  } else if (route.startsWith('/habits')) {
    page = <HabitsPage />;
  } else if (route.startsWith('/pills')) {
    page = settings.pillsEnabled ? (
      <PillsPage ownerName={settings.pillsOwnerName} />
    ) : (
      settingsPage
    );
  } else if (route.startsWith('/settings')) {
    page = settingsPage;
  } else {
    page = <DashboardPage navigate={navigate} settings={settings} />;
  }

  return (
    <>
      <Header route={route} navigate={navigate} showPills={!!settings.pillsEnabled} />
      <main>{page}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>Life Hub · v3.0 · localStorage</span>
          <span>made with ♡</span>
        </div>
      </footer>
    </>
  );
}
