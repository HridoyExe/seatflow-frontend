import React, { useState } from 'react';
import { ShoppingBag, Clock, Receipt, ChevronRight, Utensils, Calendar, AlertCircle } from 'lucide-react';
import { useBookingHistory } from '../../../hooks/useBooking';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: bookingsData, isLoading, isError } = useBookingHistory();
  
  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.results || []);

  const menuOrders = bookings.filter(b => b.order_items && b.order_items.length > 0);

  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return menuOrders.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      if (activeTab === 'upcoming') {
        return bookingDate >= today && booking.status !== 'Canceled';
      } else {
        return bookingDate < today || booking.status === 'Canceled' || booking.status === 'Completed';
      }
    });
  };

  const filteredBookings = filterBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Canceled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Menu Orders</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Track your delicious selections and delivery status.</p>
          </div>
          
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'past' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Past Orders
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-red-100 shadow-sm flex flex-col items-center">
            <AlertCircle size={60} className="text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 max-w-sm mb-8">We couldn't load your orders. Please try again later.</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                    <ShoppingBag size={28} className="text-orange-600" />
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">Order #{booking.id}</h3>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span>{new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-orange-500" />
                        <span className="font-bold text-slate-900">৳{parseFloat(booking.amount || 0).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/booking/${booking.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                    >
                      View Items
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Utensils size={12} />
                  <span>Culinary selection including {booking.guest_count || 1} person(s) portions</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[5rem] p-20 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-400 mb-8 animate-bounce-slow">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Cravings not found</h2>
            <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
              Your gourmet journey hasn't started yet. Browse our exquisite menu and treat yourself.
            </p>
            <Link 
              to="/menu" 
              className="mt-10 bg-orange-600 text-white px-12 py-4 rounded-3xl font-black shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all"
            >
              Explore Menu
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
