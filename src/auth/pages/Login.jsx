import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, LogIn, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useAuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthContext();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login({ identifier, password });
    
    if (result.success) {
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem("seatflow_user") || "{}");
        if (storedUser.is_staff || storedUser.is_superuser) {
          navigate("/admin-dashboard");
        } else {
          navigate("/"); // Modified: Redirect member to Home instead of Profile
        }
      }, 500);
    } else if (result.otpPending) {
      navigate("/verify-otp", { state: { email: result.email } });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-800">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col items-center text-slate-100">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <UtensilsCrossed className="text-primary-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue to SeatFlow</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email or Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={e => setIdentifier(e.target.value)} 
                  required 
                  placeholder="you@example.com" 
                  className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all duration-300 disabled:bg-primary-600 disabled:text-white disabled:opacity-100"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary-600 hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;