import React from 'react';
import { 
  User, Calendar, Star, ShoppingBag, 
  Settings, ArrowRight, Heart, Clock, Gift,
  CheckCircle2, TrendingUp, Armchair, Loader2
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import BookingList from '../booking/BookingList';
import { useDashboardStats } from '../../hooks/useDashboard';

const MemberDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useDashboardStats();

  return (
    <div className="min-h-screen bg-[#fcf9f7] pb-24 font-sans text-slate-800">
      
      {/* Dynamic Hero Header */}
      <header className="bg-slate-900 pt-32 pb-48 px-6 relative overflow-hidden">
         <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-8 group">
               <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-orange-500 overflow-hidden border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105">
                     {user?.profile_image ? (
                       <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white uppercase">
                         {user?.first_name?.charAt(0) || 'U'}
                       </div>
                     )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-4 border-slate-900">
                     <CheckCircle2 size={16} />
                  </div>
               </div>
               <div className="max-w-md">
                  <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-2">
                    Welcome, {user?.first_name || 'Gourmet'}!
                  </h1>
                  <p className="text-slate-400 font-medium text-lg md:text-xl">
                    Discover your next unforgettable dining chapter at SeatFlow.
                  </p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => navigate('/seats')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-orange-500/30 transition-all active:scale-95">
                  Book Table
               </button>
               <button onClick={() => navigate('/profile')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl font-black transition-all">
                  Settings
               </button>
            </div>
         </div>
         
         <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
         <div className="absolute left-1/2 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-1/2"></div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-24 space-y-12">
         
         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse"></div>)
            ) : isError ? (
               <div className="col-span-full text-center py-10 bg-white rounded-3xl text-red-500 font-bold shadow-xl">
                  Error loading statistics. Please refresh.
               </div>
             ) : ([
              { label: 'Table Bookings', value: stats?.total_bookings || 0, icon: <Armchair />, color: 'bg-orange-500' },
              { label: 'Food Orders', value: stats?.total_orders || 0, icon: <ShoppingBag />, color: 'bg-blue-500' },
              { label: 'Loyalty Points', value: stats?.loyalty_points || 0, icon: <Gift />, color: 'bg-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 hover:-translate-y-2 transition-all group">
                <div className={`${stat.color} p-5 rounded-3xl text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                </div>
              </div>
            )))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            
            {/* Recent Bookings Section */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Reservations</h3>
                  <Link to="/my-bookings" className="text-orange-600 font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                     View All <ArrowRight size={14} />
                  </Link>
               </div>
               <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px]">
                  {isLoading ? (
                     <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={32} className="text-orange-600 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Loading your journey...</p>
                     </div>
                   ) : stats?.recent_bookings?.length > 0 ? (
                     <div className="space-y-6">
                        {stats.recent_bookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                   <Armchair size={20} />
                                </div>
                                <div className="space-y-0.5">
                                   <div className="font-bold text-slate-900">Reservation #{booking.id}</div>
                                   <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                      <Calendar size={10} /> {new Date(booking.booking_date).toLocaleDateString()} 
                                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                      <Clock size={10} /> {booking.start_time}
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-slate-900">৳{parseFloat(booking.amount || 0).toFixed(0)}</span>
                                <Link to={`/booking/${booking.id}`} className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-orange-600 hover:text-white transition-all">
                                   <ArrowRight size={14} />
                                </Link>
                             </div>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                           <Calendar size={32} className="text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">No Recent Reservations</h4>
                        <p className="text-slate-400 text-sm max-w-[200px] mb-8">Ready to book your next exquisite table?</p>
                        <button onClick={() => navigate('/seats')} className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">Book Now</button>
                     </div>
                   )}
               </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
               
               {/* Quick Favorites Card */}
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                  <h4 className="text-xl font-black mb-4 relative z-10">Quick Order</h4>
                  <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed font-medium">Reorder your most exquisite favorites with a single touch.</p>
                  <button onClick={() => navigate('/menu')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all shadow-xl group-hover:scale-105">
                     Browse Menu <ArrowRight size={18} />
                  </button>
                  <Heart className="absolute -bottom-8 -right-8 text-white/5 w-48 h-48 -rotate-12" />
               </div>

               {/* Activity Card */}
               <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h4 className="text-xl font-black mb-8 text-slate-900">Your Activity</h4>
                  <div className="space-y-8">
                     {[
                       { label: 'Booking Confirmed', date: 'Yesterday', icon: <Clock />, color: 'bg-blue-50' },
                       { label: 'Review Posted', date: '3 days ago', icon: <Star />, color: 'bg-amber-50' },
                       { label: 'Reservation Completed', date: '1 week ago', icon: <CheckCircle2 />, color: 'bg-emerald-50' },
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 items-start">
                          <div className={`p-3 rounded-xl ${item.color} flex items-center justify-center text-slate-600`}>
                             {item.icon}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-800">{item.label}</p>
                             <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

            </div>

         </div>

      </main>

    </div>
  );
};

export default MemberDashboard;
