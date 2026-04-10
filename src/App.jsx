import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { ThreatsPage } from "./pages/Threats";
import { IncidentsPage } from "./pages/Incidents";
import { LogsPage } from "./pages/Logs";
import { AdminPage } from "./pages/Admin";
import { LoginPage } from "./pages/Login";
import { useAlertSound } from "./hooks/useAlertSound";

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs,    setNotifs]    = useState([]);

  const { playAlert } = useAlertSound();

  const handleNewAlerts = useCallback((newNotifs) => {
    setNotifs(prev => [...newNotifs, ...prev]);
    playAlert();
  }, [playAlert]);

  // ── Mark all notifications as read ───────────────────────────────────────
  const markAllAsRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const pages = {
    dashboard: <DashboardPage onNewAlerts={handleNewAlerts} />,
    threats:   <ThreatsPage />,
    incidents: <IncidentsPage />,
    logs:      <LogsPage />,
    admin:     <AdminPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* ── pass markAllAsRead down to Topbar ── */}
        <Topbar page={page} notifs={notifs} showNotif={showNotif} setShowNotif={setShowNotif} markAllAsRead={markAllAsRead} />
        <main className="flex-1 overflow-y-auto p-5" onClick={() => showNotif && setShowNotif(false)}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}