import React, { useState } from 'react';
import { CalendarHeart, Clock, Receipt, ChevronRight, Loader2, Armchair, Calendar, AlertCircle } from 'lucide-react';
import { useBookingHistory } from '../../../hooks/useBooking';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: bookingsData, isLoading, isError } = useBookingHistory();
  
  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.results || []);

  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
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
    const s = status?.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CANCELED':
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Reservations</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Manage your dining journey and past experiences.</p>
          </div>
          
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'past' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              History
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
          <div className="bg-white rounded-[2rem] p-16 text-center border border-red-100 shadow-sm flex flex-col items-center animate-shake">
            <AlertCircle size={60} className="text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 max-w-sm mb-8">We couldn't load your reservations. Please try again later.</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 animate-fade-in-up">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                    <Armchair size={28} className="text-orange-600 mb-1" />
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">Table</span>
                    <span className="text-sm font-bold -mt-1 text-slate-900">{booking.seat_number || booking.seat}</span>
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">Reservation #{booking.id}</h3>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                        {booking.status?.toUpperCase() === 'CONFIRMED' ? 'Booked' : booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span>{new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        <span>{booking.start_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-orange-500" />
                        <span className="font-bold text-slate-900">৳ {parseFloat(booking.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/booking/${booking.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg group"
                    >
                      View Details
                      <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {booking.special_request && (
                  <div className="mt-6 pt-4 border-t border-dashed border-slate-100 flex items-center gap-3 italic text-slate-400 text-xs">
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    "Special Request: {booking.special_request}"
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[5rem] p-20 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center animate-fade-in shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-400 mb-8 animate-bounce-slow">
              <Receipt size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">No {activeTab} journeys</h2>
            <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
              It looks like there are no reservations here yet. Ready to book your next exquisite table?
            </p>
            <Link 
              to="/seats" 
              className="mt-10 bg-orange-600 text-white px-12 py-4 rounded-3xl font-black shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all active:scale-95"
            >
              Book a Table Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersPage;
