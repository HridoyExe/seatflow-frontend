import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Send, CheckCircle2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, loading } = useAuthContext();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await resetPassword(email);
    if (result.success) {
      setIsSubmitted(true);
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
              <KeyRound className="text-primary-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
            <p className="text-slate-400 text-sm mt-1">We'll help you get back in</p>
          </div>
        </div>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              <p className="text-slate-500 text-sm mb-8 text-center leading-relaxed">
                Enter your registered email address and we'll send you a secure link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-1 font-bold">
                    {error}
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-green-100 shadow-sm">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check Your Email</h2>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 inline-block">
                <p className="text-slate-500 text-sm">
                  We've sent a password reset link to <br/>
                  <span className="font-extrabold text-slate-800">{email}</span>
                </p>
              </div>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-primary-600 font-extrabold hover:text-primary-700 transition-colors text-sm underline-offset-4 hover:underline block mx-auto mb-4"
              >
                Try another email address
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors text-sm font-bold">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
