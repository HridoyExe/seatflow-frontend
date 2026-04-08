import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Ban, MinusCircle, Home, ShoppingBag } from 'lucide-react';
import paymentApi from '../../hooks/paymentApi';
import { useEffect } from 'react';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');

  // Notify backend about cancelled payment
  useEffect(() => {
    if (tranId) {
      paymentApi.paymentCancel(tranId).catch(() => {});
    }
  }, [tranId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <MinusCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The payment process was cancelled at the gateway. Your booking remains pending and haven't been completed yet.
        </p>

        <div className="bg-amber-50/50 rounded-2xl p-6 mb-8 text-center border border-amber-100/50">
           <p className="text-sm text-amber-800 font-medium">Changed your mind? You can always come back and complete your reservation later from your profile.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/booking" 
            className="btn bg-slate-900 hover:bg-slate-800 text-white border-none font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <ShoppingBag size={20} />
            New Booking
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

export default PaymentCancel;
