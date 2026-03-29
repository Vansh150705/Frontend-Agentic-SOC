import { useState } from "react";
import { Plus, Edit2, Trash2, Database, Shield, Zap, Bell, MoreHorizontal } from "lucide-react";
import { Table } from "../components/Table";
import { users } from "../data/usersData";

export const AdminPage = () => {
  const [tab, setTab] = useState("users");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-slate-200">
        {[["users", "Users"], ["config", "Configuration"], ["activity", "Activity"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-slate-800 font-semibold text-sm">Team Members</h3>
              <p className="text-slate-400 text-xs mt-0.5">{users.length} users, {users.filter((u) => u.status === "Active").length} active</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
              <Plus size={12} /> Add User
            </button>
          </div>
          <Table headers={["User", "Role", "Status", "Last Login", "MFA", ""]}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-slate-700 font-semibold text-xs">{u.name}</p>
                      <p className="text-slate-400 text-[10px]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">{u.role}</span></td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium w-fit ${u.status === "Active" ? "text-green-600" : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />{u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.mfa ? "text-green-600" : "text-red-500"}`}>{u.mfa ? "On" : "Off"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 size={12} /></button>
                    <button className="p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {tab === "config" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "SIEM", icon: Database, fields: [["Retention", "90 days"], ["Shards", "8"], ["Refresh", "5s"]] },
            { title: "Firewall", icon: Shield, fields: [["Active Rules", "2,847"], ["Blocked IPs", "14,392"], ["Allow List", "218"]] },
            { title: "IDS / IPS", icon: Zap, fields: [["Signature DB", "2024.01.15"], ["Mode", "Active"], ["Sensitivity", "High"]] },
            { title: "Alerting", icon: Bell, fields: [["Email", "Enabled"], ["Slack", "Connected"], ["PagerDuty", "Enabled"]] },
          ].map(({ title, icon: Icon, fields }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg"><Icon size={15} className="text-slate-600" /></div>
                <h3 className="text-slate-800 font-semibold text-sm">{title}</h3>
                <button className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={15} /></button>
              </div>
              <div className="space-y-0">
                {fields.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-500 text-xs">{k}</span>
                    <span className="text-slate-800 text-xs font-semibold font-mono">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-800 font-semibold text-sm">Recent Admin Actions</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { user: "Alex Chen", initials: "AC", action: "Modified firewall ruleset #487", time: "14:32" },
              { user: "Sarah Kim", initials: "SK", action: "Closed INC-2024-004 as Resolved", time: "10:45" },
              { user: "Marcus Johnson", initials: "MJ", action: "Added new IDS signature — ET EXPLOIT", time: "09:12" },
              { user: "Alex Chen", initials: "AC", action: "Revoked API key for integration svc-03", time: "08:55" },
              { user: "Priya Patel", initials: "PP", action: "Exported log bundle for 2024-01-14", time: "08:30" },
              { user: "Alex Chen", initials: "AC", action: "Added user lena.muller@soc.corp", time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0">{a.initials}</div>
                <div className="flex-1 text-xs">
                  <span className="text-slate-800 font-semibold">{a.user}</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-600">{a.action}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
