import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, Calendar } from 'lucide-react';
import paymentApi from '../../hooks/paymentApi';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');

  // Notify backend about successful payment
  useEffect(() => {
    if (tranId) {
      paymentApi.paymentSuccess(tranId).catch(() => {});
    }
  }, [tranId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={48} className="animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Your reservation is confirmed. We've sent the details to your email. Get ready for an exquisite dining experience!
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</span>
            <span className="text-sm font-mono font-bold text-slate-700">{tranId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase">Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/orders" 
            className="btn btn-primary text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Calendar size={20} />
            View Booking
          </Link>
          <Link 
            to="/" 
            className="btn btn-outline border-slate-200 text-slate-600 font-bold h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
          >
            <Home size={20} />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
