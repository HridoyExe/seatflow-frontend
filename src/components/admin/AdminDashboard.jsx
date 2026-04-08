import React, { useState } from 'react';
import { 
  LayoutDashboard, Utensils, Armchair, Receipt, 
  Users, Settings, LogOut, Menu as MenuIcon, X, 
  TrendingUp, CalendarCheck, DollarSign, Clock, Search,
  ArrowUpRight, Briefcase, ChevronRight
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminMenuManager from './AdminMenuManager';
import AdminSeatManager from './AdminSeatManager';
import { useDashboardStats } from '../../hooks/useDashboard';


const AdminOverview = ({ stats }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Revenue', value: `৳${(stats?.total_revenue || 0).toLocaleString()}`, icon: <DollarSign />, color: 'bg-emerald-500' },
        { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: <CalendarCheck />, color: 'bg-orange-500' },
        { label: 'Active Seats', value: stats?.active_seats || 0, icon: <Armchair />, color: 'bg-blue-500' },
        { label: 'Avg Ticket', value: `৳${stats?.total_bookings ? (stats.total_revenue / stats.total_bookings).toFixed(0) : 0}`, icon: <TrendingUp />, color: 'bg-purple-500' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all group">
          <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
       <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">System Control <br/><span className="text-orange-500">Center</span></h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            Monitor real-time restaurant performance, manage your sophisticated floor plan, and oversee every culinary selection with precision.
          </p>
          <div className="mt-8 flex gap-4">
             <div className="px-6 py-2 bg-white/10 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md">
                Production Environment
             </div>
             <div className="px-6 py-2 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold border border-orange-500/20 backdrop-blur-md">
                Uptime 99.9%
             </div>
          </div>
       </div>
       <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[150px] opacity-20 -mr-40 -mt-40"></div>
       <TrendingUp className="absolute bottom-12 right-12 text-white/5 w-64 h-64 -rotate-12" />
    </div>
  </div>
);

const AdminBookingManager = ({ recentTransactions }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h3 className="text-2xl font-black text-slate-900">Recent Global Transactions</h3>
                   <p className="text-slate-500 font-medium text-sm">Review latest restaurant reservations and payment statuses.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Filter by Code or Name..." className="w-full h-12 bg-white rounded-xl border border-slate-100 pl-12 text-sm focus:ring-4 focus:ring-orange-500/10 transition-all font-medium" />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">ID / Customer</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date / Time</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {recentTransactions?.map(booking => (
                            <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xs">
                                            {booking.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{booking.booking_code}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{booking.name || 'Anonymous'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="text-sm font-bold text-slate-700">{booking.booking_date}</p>
                                    <p className="text-xs text-slate-400">{booking.start_time}</p>
                                </td>
                                <td className="px-8 py-5">
                                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.is_paid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                      {booking.is_paid ? 'Paid' : 'Pending'}
                                   </span>
                                </td>
                                <td className="px-8 py-5 font-black text-slate-900">৳{parseFloat(booking.amount).toFixed(0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useDashboardStats();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'menu', label: 'Menu Manager', icon: <Utensils size={20} /> },
    { id: 'seats', label: 'Seat Manager', icon: <Armchair size={20} /> },
    { id: 'bookings', label: 'Global Bookings', icon: <Receipt size={20} /> },
    { id: 'customers', label: 'User Hub', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-8 flex items-center justify-between border-b border-slate-50 h-20">
          <div className="flex items-center gap-2">
            <Utensils className="text-orange-600 w-8 h-8" />
            <h1 className="text-2xl font-black tracking-tight">Seat<span className="text-orange-600">Flow</span></h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto scrollbar-hide pb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all
                ${activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className={activeTab === item.id ? 'text-white' : 'text-orange-600/40'}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black shadow-inner">
               {user?.first_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
               <p className="font-bold text-sm text-slate-900 truncate capitalize">{user?.first_name} {user?.last_name || 'Admin'}</p>
               <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-95 shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
           <h2 className="text-xl font-black text-slate-900 capitalize relative z-10">
             {menuItems.find(i => i.id === activeTab)?.label}
           </h2>
           <div className="flex items-center gap-6 relative z-10">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
                  <MenuIcon size={20} />
              </button>
              <div className="hidden md:flex flex-col items-end border-l border-slate-100 pl-6 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Health</span>
                 <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> All Systems Operational
                 </span>
              </div>
           </div>
        </header>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
               <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full text-red-500 font-bold">
               Error loading dashboard data. Please try again.
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <AdminOverview stats={stats} />}
              {activeTab === 'menu' && <AdminMenuManager />}
              {activeTab === 'seats' && <AdminSeatManager />}
              {activeTab === 'bookings' && <AdminBookingManager recentTransactions={stats?.recent_transactions} />}
              
              {['customers', 'settings'].includes(activeTab) && (
                <div className="bg-white rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-bottom-4 duration-700">
                   <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                     {menuItems.find(i => i.id === activeTab)?.icon}
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 mb-2">Module Under Optimization</h3>
                   <p className="text-slate-400 max-w-sm mx-auto font-medium">
                     We are perfecting the dynamic interface for {activeTab}. Please explore the Core Managers in the meantime.
                   </p>
                   <button onClick={() => setActiveTab('overview')} className="mt-8 flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                      Take Me Back <ArrowUpRight size={18} />
                   </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
