import { useState } from "react";
import { Shield, RefreshCw } from "lucide-react";

export const LoginPage = ({ onLogin }) => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Shield size={22} className="text-gray-800" />
          <span className="text-gray-900 font-bold text-lg">Cyber SOC</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to your account to continue</p>

        {/* Fields */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 placeholder-gray-300 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <button className="text-xs text-blue-500 hover:text-blue-600">Forgot password?</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 placeholder-gray-300 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><RefreshCw size={14} className="animate-spin" /> Signing in...</>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-gray-400 text-xs mt-5">
          Agentic SOC Platform · Internal Use Only
        </p>
      </div>
    </div>
  );
};