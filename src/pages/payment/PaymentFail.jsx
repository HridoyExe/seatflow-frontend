import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, Home, AlertCircle } from 'lucide-react';
import paymentApi from '../../hooks/paymentApi';
import { useEffect } from 'react';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');

  // Notify backend about failed payment
  useEffect(() => {
    if (tranId) {
      paymentApi.paymentFail(tranId).catch(() => {});
    }
  }, [tranId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-red-100 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <XCircle size={48} className="animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight text-red-600">Payment Failed</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We encountered an issue while processing your payment. Don't worry, no funds were deducted if the transaction failed.
        </p>

        <div className="bg-red-50/50 rounded-2xl p-6 mb-8 text-left border border-red-100/50">
          <div className="flex items-start gap-3">
             <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
             <div>
                <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Potential Reasons</p>
                <div className="text-sm text-red-700 space-y-1 opacity-80">
                   <p>• Insufficient balance</p>
                   <p>• Transaction cancelled by user</p>
                   <p>• Connection timeout</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/checkout" 
            className="btn bg-slate-900 hover:bg-slate-800 text-white border-none font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <RefreshCw size={20} />
            Try Again
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

export default PaymentFail;
