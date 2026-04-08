import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, loading } = useAuthContext();

  const email = location.state?.email;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') element.nextSibling.focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) e.target.previousSibling.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join('');
    const result = await verifyOTP(email, otpValue);

    if (result.success) navigate('/');
    else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    const result = await sendOTP(email);
    if (result.success) alert("OTP Resent Successfully!");
    else setError(result.message);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-800 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden text-center">
        <div className="bg-slate-900 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 transition-transform hover:scale-105 duration-300">
              <ShieldCheck className="text-primary-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Security Check</h2>
            <p className="text-slate-400 text-sm mt-2">Access your SeatFlow account</p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <p className="text-slate-500 text-sm leading-relaxed">
              We've sent a 6-digit verification code to
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-bold text-sm border border-slate-200">
              {email}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-2 md:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleBackspace(e, index)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                  required
                />
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || otp.join('').length < 6} 
              className="btn btn-primary w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 active:scale-[0.98] transition-all duration-300 disabled:bg-primary-600 disabled:text-white disabled:opacity-100"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  Verify Identity
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResend} 
                disabled={loading}
                className="font-extrabold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Resend Code
              </button>
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;