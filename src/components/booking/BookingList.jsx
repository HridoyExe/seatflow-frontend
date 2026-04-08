import React from 'react';
import { Calendar, Clock, Armchair, Users, Trash2, Loader2, CheckCircle, AlertCircle, CalendarDays } from 'lucide-react';
import { useBookingHistory, useCancelBooking } from '../../hooks/useBooking';
import { Link } from 'react-router-dom';

const BookingList = () => {
  // React Query Hooks
  const { data: bookingsData, isLoading, isError, error: fetchError } = useBookingHistory();
  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.results || []);
  const cancelBookingMutation = useCancelBooking();

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    
    try {
      await cancelBookingMutation.mutateAsync(id);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Confirmed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Completed': 'bg-blue-100 text-blue-700 border-blue-200',
      'Canceled': 'bg-red-100 text-red-700 border-red-200',
    };
    
    const style = statusMap[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return (
    <div className="py-20 flex flex-col items-center justify-center animate-pulse">
      <Loader2 size={32} className="text-orange-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Fetching your reservations...</p>
    </div>
  );

  if (isError) return (
    <div className="py-20 text-center animate-fade-in">
      <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
      <p className="text-slate-500">{fetchError?.response?.data?.detail || "We couldn't retrieve your reservations."}</p>
      <Link to="/" className="mt-4 text-orange-600 font-bold underline inline-block">Return Home</Link>
    </div>
  );

  if (bookings.length === 0) return (
    <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-10 animate-fade-in">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CalendarDays size={32} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No Reservations Found</h3>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto">You haven't made any table reservations yet. Ready for an exquisite dining experience?</p>
      <Link to="/seats" className="bg-orange-600 text-white px-10 py-3.5 rounded-2xl font-bold font-sans shadow-xl shadow-orange-500/30 hover:scale-105 transition-all inline-block">
        Book a Table Now
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Booking History</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{bookings.length} Total</span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            
            <div className={`absolute top-0 right-0 w-1.5 h-full ${booking.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-900 border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                   <Armchair size={24} className="text-orange-600 mb-1" />
                   <span className="text-[10px] font-black uppercase text-slate-400">Table</span>
                   <span className="text-xs font-bold -mt-1">{booking.seat_number || booking.seat}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-slate-900 capitalize">Reservation #{booking.id}</h4>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar size={14} className="text-orange-500" />
                      <span className="font-semibold">{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock size={14} className="text-orange-500" />
                      <span className="font-semibold">{booking.start_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Users size={14} className="text-orange-500" />
                      <span className="font-semibold">{booking.number_of_guests || 1} Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 text-sm bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                      <span className="text-[10px] font-black uppercase text-orange-400">Total:</span>
                      <span className="font-black text-orange-600">৳{parseFloat(booking.amount || 0).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:self-center">
                 {booking.status === 'Pending' && (
                    <button 
                      disabled={cancelBookingMutation.isPending && cancelBookingMutation.variables === booking.id}
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {cancelBookingMutation.isPending && cancelBookingMutation.variables === booking.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      Cancel
                    </button>
                 )}
                 
                 <Link 
                   to={`/booking/${booking.id}`} 
                   className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-all active:scale-95 shadow-md shadow-orange-500/20"
                 >
                   Details
                 </Link>
              </div>
            </div>

            {booking.special_requests && (
              <div className="mt-5 pt-4 border-t border-dashed border-slate-100 flex items-start gap-2 italic text-slate-400 text-xs py-1 transition-all">
                 <CheckCircle size={14} className="text-slate-200 shrink-0 mt-0.5" />
                 "Special Request: {booking.special_requests}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
