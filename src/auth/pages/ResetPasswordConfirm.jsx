import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, UtensilsCrossed, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const { resetPasswordConfirm, loading } = useAuthContext();

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: ''
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.new_password !== formData.re_new_password) {
      setError("Passwords do not match.");
      return;
    }
    
    const result = await resetPasswordConfirm({
      uid,
      token,
      new_password: formData.new_password,
      re_new_password: formData.re_new_password
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-800 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <Lock className="text-primary-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">New Password</h2>
            <p className="text-slate-400 text-sm mt-1">Setup your fresh credentials</p>
          </div>
        </div>

        <div className="p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="re_new_password"
                    value={formData.re_new_password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
                  <ShieldAlert size={18} />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner text-white"></span>
                    <span>Updating...</span>
                  </>
                ) : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-green-100 shadow-sm">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Success!</h2>
              <p className="text-slate-500 text-sm mb-8">
                Your password has been reset successfully. <br/>
                Redirecting you to the login page...
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full animate-[progress_3s_linear]"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
