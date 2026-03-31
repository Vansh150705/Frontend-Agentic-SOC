import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Table } from "../components/Table";
import { users } from "../data/usersData";

// ── fetch Sheet1 for Activity tab only ────────────────────────────────────
function useActivityData() {
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchActivity() {
      try {
        const url = `https://opensheet.elk.sh/1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc/Sheet1`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setActivity(
            data.map((row, i) => ({
              key:      i,
              user:     row["User"]    ?? "Unknown",
              initials: (row["User"] ?? "?").slice(0, 2).toUpperCase(),
              action:   row["Event"]   ?? row["Summary"] ?? "—",
              time:     row["Date"]    ?? "",
            }))
          );
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchActivity();
    const timer = setInterval(fetchActivity, 10_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { activity, loading, error };
}

// ── Main component ─────────────────────────────────────────────────────────
export const AdminPage = () => {
  const [tab, setTab] = useState("users");

  // ── ONLY CHANGE: hook for Activity tab data ──
  const { activity, loading: actLoading, error: actError } = useActivityData();

  return (
    <div className="space-y-4">

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-gray-200">
        {[["users", "Users"], ["config", "Configuration"], ["activity", "Activity"]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Users tab — unchanged */}
      {tab === "users" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-gray-800 font-semibold text-sm">Team Members</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                {users.length} users · {users.filter((u) => u.status === "Active").length} active
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors">
              <Plus size={12} /> Add User
            </button>
          </div>

          <Table headers={["User", "Role", "Status", "Last Login", "MFA", ""]}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium text-sm">{u.name}</p>
                      <p className="text-gray-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium w-fit ${u.status === "Active" ? "text-green-600" : "text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-gray-300"}`} />
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${u.mfa ? "text-green-600" : "text-red-500"}`}>
                    {u.mfa ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {/* Config tab — unchanged */}
      {tab === "config" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "SIEM",
              fields: [["Retention Period", "90 days"], ["Index Shards", "8"], ["Refresh Interval", "5s"]],
            },
            {
              title: "Firewall",
              fields: [["Active Rules", "2,847"], ["Blocked IPs", "14,392"], ["Allow List", "218"]],
            },
            {
              title: "IDS / IPS",
              fields: [["Signature DB", "2024.01.15"], ["Mode", "Active"], ["Sensitivity", "High"]],
            },
            {
              title: "Alerting",
              fields: [["Email Alerts", "Enabled"], ["Slack", "Connected"], ["PagerDuty", "Enabled"]],
            },
          ].map(({ title, fields }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-gray-800 font-semibold text-sm mb-4">{title}</h3>
              <div>
                {fields.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-500 text-xs">{k}</span>
                    <span className="text-gray-800 text-xs font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Activity tab — ── ONLY CHANGE: now fetches from Sheet1 ── */}
      {tab === "activity" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-gray-800 font-semibold text-sm">Recent Activity</h3>
            <p className="text-gray-400 text-xs mt-0.5">Live data from Google Sheets</p>
          </div>

          {actLoading && <p className="px-5 py-4 text-slate-400 text-xs">Loading activity…</p>}
          {actError   && <p className="px-5 py-4 text-red-500 text-xs">Failed to load: {actError}</p>}

          {!actLoading && !actError && (
            <div className="divide-y divide-gray-100">
              {activity.map((a) => (
                <div key={a.key} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold shrink-0">
                    {a.initials}
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="text-gray-800 font-medium">{a.user}</span>
                    <span className="text-gray-400 mx-1.5">·</span>
                    <span className="text-gray-500">{a.action}</span>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};