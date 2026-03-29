import { useState } from "react";
import { Shield, Lock, RefreshCw } from "lucide-react";

export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-80 bg-slate-900 p-10 shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-slate-900" />
            </div>
            <span className="text-white font-bold text-base">CyberSOC</span>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug mb-3">Security Operations, unified.</h2>
          <p className="text-slate-400 text-sm leading-relaxed">Monitor, detect, and respond to threats across your entire infrastructure from a single pane of glass.</p>
        </div>

        <div className="space-y-3">
          {[
            { label: "Firewall", ok: true },
            { label: "IDS / IPS", ok: true },
            { label: "SIEM Indexer", ok: true },
            { label: "Agent Fleet", ok: false },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs">{label}</span>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${ok ? "text-green-400" : "text-red-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${ok ? "animate-none" : "animate-pulse"}`} />
                {ok ? "Operational" : "Degraded"}
              </div>
            </div>
          ))}
          <p className="text-slate-600 text-[10px] font-mono pt-1">Last sync: 12 seconds ago</p>
        </div>
      </div>

      {/* Right / form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-slate-900 font-bold">CyberSOC</span>
          </div>

          <h1 className="text-slate-900 font-bold text-2xl mb-1">Sign in</h1>
          <p className="text-slate-400 text-sm mb-7">Enter your credentials to access the SOC platform.</p>

          {/* Role tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
            {["Admin", "Analyst"].map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${role === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-600 text-xs font-semibold block mb-1.5">Work email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 placeholder-slate-300 transition-all bg-white" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-600 text-xs font-semibold">Password</label>
                <button className="text-blue-600 text-xs hover:text-blue-700">Forgot password?</button>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 placeholder-slate-300 transition-all bg-white" />
            </div>
          </div>

          <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1100); }} disabled={loading}
            className="mt-5 w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" />Signing in…</> : <><Lock size={13} />Sign in securely</>}
          </button>

          <p className="text-slate-400 text-[11px] text-center mt-5">Protected by TLS 1.3 · MFA enforced · SOC 2 Type II</p>
        </div>
      </div>
    </div>
  );
};
