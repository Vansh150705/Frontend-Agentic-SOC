import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { DashboardPage } from "./pages/Dashboard";
import { ThreatsPage } from "./pages/Threats";
import { IncidentsPage } from "./pages/Incidents";
import { LogsPage } from "./pages/Logs";
import { AdminPage } from "./pages/Admin";
import { LoginPage } from "./pages/Login";

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // starts empty — populated entirely from Google Sheets
  const [notifs, setNotifs] = useState([]);

  // called by useAlertsData whenever new rows are detected (including on first load)
  const handleNewAlerts = useCallback((newNotifs) => {
    setNotifs(prev => [...newNotifs, ...prev]); // newest at top
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
        <Topbar page={page} notifs={notifs} showNotif={showNotif} setShowNotif={setShowNotif} />
        <main className="flex-1 overflow-y-auto p-5" onClick={() => showNotif && setShowNotif(false)}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}