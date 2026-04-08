import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  Armchair, Users, CheckCircle2, XCircle, 
  AlertCircle, Layout, Save, Loader2
} from 'lucide-react';
import { useSeats } from '../../hooks/useBooking';
import apiClient from '../../services/apiClient';
import { apiEndpoints } from '../../api/endpoints';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const AdminSeatManager = () => {
  const queryClient = useQueryClient();
  const { data: seatsData, isLoading } = useSeats();
  const seats = Array.isArray(seatsData) ? seatsData : (seatsData?.results || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeat, setNewSeat] = useState({ seat_number: '', capacity: 2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post(apiEndpoints.booking.seats, {
        ...newSeat,
        is_active: true
      });
      toast.success("New table added to floor plan!");
      setIsModalOpen(false);
      setNewSeat({ seat_number: '', capacity: 2 });
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add table.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this table?")) {
      setProcessingId(id);
      try {
        await apiClient.delete(apiEndpoints.booking.seatDetails(id));
        toast.success("Table removed from floor plan.");
        queryClient.invalidateQueries({ queryKey: ["seats"] });
      } catch (err) {
        toast.error("Failed to delete table.");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const toggleStatus = async (seat) => {
    setProcessingId(seat.id);
    try {
      await apiClient.patch(apiEndpoints.booking.seatDetails(seat.id), {
        is_active: !seat.is_active
      });
      toast.success(`Table ${seat.seat_number} is now ${!seat.is_active ? 'Active' : 'Inactive'}`);
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Floor Plan Management</h3>
          <p className="text-slate-500 font-medium mt-1 text-sm">Configure and manage your restaurant's physical seating layout.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 text-white h-14 px-8 rounded-2xl font-black shadow-xl shadow-orange-600/20 flex items-center gap-3 hover:bg-orange-700 transition-all active:scale-95 group"
        >
           <Plus size={20} className="transition-transform group-hover:rotate-90" />
           New Table
        </button>
      </div>

      {/* Add Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden border border-white/20">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">Add New Table</h4>
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                      <XCircle size={24} />
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Table Identifier</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g., T-101" 
                        className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all"
                        value={newSeat.seat_number}
                        onChange={(e) => setNewSeat({...newSeat, seat_number: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Guest Capacity</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        placeholder="Seats" 
                        className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all"
                        value={newSeat.capacity}
                        onChange={(e) => setNewSeat({...newSeat, capacity: parseInt(e.target.value)})}
                      />
                   </div>

                   <div className="pt-4 flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 h-14 rounded-2xl border border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] h-14 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Table
                      </button>
                   </div>
                </form>
             </div>
             <div className="absolute right-0 top-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-10 -mr-24 -mt-24"></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
          ))
        ) : seats.length > 0 ? (
          seats.map((seat) => (
            <div key={seat.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
               <div className={`h-2 w-full ${seat.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
               
               <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-orange-600 border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                      <Armchair size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${seat.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                         {seat.is_active ? 'Active' : 'Inactive'}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">Table {seat.seat_number}</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Interior Zone A</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2 text-slate-600 font-bold">
                          <Users size={16} className="text-orange-500" />
                          <span>{seat.capacity} Guests</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                     <button 
                       disabled={processingId === seat.id}
                       onClick={() => toggleStatus(seat)}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${seat.is_active ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'} min-w-[100px]`}
                     >
                       {processingId === seat.id ? (
                         <Loader2 size={16} className="animate-spin" />
                       ) : (
                         <>
                           {seat.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                           {seat.is_active ? 'Disable' : 'Enable'}
                         </>
                       )}
                     </button>
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all">
                       <Edit2 size={16} />
                     </button>
                     <button 
                       disabled={processingId === seat.id}
                       onClick={() => handleDelete(seat.id)}
                       className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center min-w-[42px]"
                     >
                       {processingId === seat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                     </button>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
            <Layout size={48} className="text-slate-200 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-900">Floor plan is empty</h4>
            <p className="text-slate-400">Add tables to start managing your seating capacity.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSeatManager;
