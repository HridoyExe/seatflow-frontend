import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, MoreVertical, 
  ChevronLeft, ChevronRight, Filter, Utensils, 
  Image as ImageIcon, Star, CheckCircle2, AlertCircle,
  Loader2, Save
} from 'lucide-react';
import { useMenuItems, useCategories } from '../../hooks/useMenuItems';
import apiClient from '../../services/apiClient';
import { apiEndpoints } from '../../api/endpoints';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import menuLogo from '../../assets/images/menu.png';

const AdminMenuManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: itemsData, isLoading } = useMenuItems({ 
    search: searchTerm, 
    category_name: selectedCategory === 'All' ? '' : selectedCategory,
    page 
  });
  const { data: categoriesData } = useCategories();
  
  const items = itemsData?.results || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(apiEndpoints.menu.items, {
        ...newItem,
        is_available: true
      });
      
      const newItemId = response.data.id;

      if (selectedImage && newItemId) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        await apiClient.post(apiEndpoints.menu.itemImages(newItemId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast.success("Culinary masterpiece and image added!");
      setIsModalOpen(false);
      setNewItem({ name: '', description: '', price: '', category: '' });
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add menu item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setProcessingId(id);
      try {
        await apiClient.delete(apiEndpoints.menu.itemDetails(id));
        toast.success("Item removed from the menu.");
        queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      } catch (err) {
        toast.error("Failed to delete item.");
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative flex-grow max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="input input-bordered w-full pl-12 h-14 bg-white border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-500/10 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <select 
             className="select select-bordered h-14 bg-white border-slate-100 rounded-2xl shadow-sm font-black text-xs uppercase tracking-widest px-6"
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
           >
             <option>All</option>
             {categories.map(c => <option key={c.id}>{c.name}</option>)}
           </select>
           
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-orange-600 text-white h-14 px-8 rounded-2xl font-black shadow-xl shadow-orange-600/20 flex items-center gap-3 hover:bg-orange-700 transition-all active:scale-95 group"
           >
             <Plus size={20} className="transition-transform group-hover:rotate-90" />
             Add New Item
           </button>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">New Menu Item</h4>
                      <p className="text-slate-400 text-sm font-medium">Add a new selection to your exquisite menu.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                      <AlertCircle size={28} />
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Item Name</label>
                         <input 
                           required
                           type="text" 
                           placeholder="e.g., Truffle Pasta" 
                           className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all"
                           value={newItem.name}
                           onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Base Price (৳)</label>
                         <input 
                           required
                           type="number" 
                           placeholder="Amount" 
                           className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all"
                           value={newItem.price}
                           onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Category Selection</label>
                      <select 
                        required
                        className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      >
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Item Description</label>
                      <textarea 
                        required
                        rows="3"
                        placeholder="Describe the flavors and ingredients..." 
                        className="w-full bg-slate-50 rounded-2xl border border-slate-100 p-6 font-medium focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Item Image</label>
                      <div className="flex items-center gap-4">
                        <label className="flex-grow">
                          <div className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all text-slate-500 overflow-hidden">
                            <ImageIcon size={20} className="flex-shrink-0" />
                            <span className="truncate">{selectedImage ? selectedImage.name : "Choose an image..."}</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                          />
                        </label>
                        {selectedImage && (
                          <button 
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                   </div>

                   <div className="pt-6 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 h-14 rounded-2xl border border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all"
                      >
                        Discard
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] h-14 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={20} />}
                        Save to Menu
                      </button>
                   </div>
                </form>
             </div>
             <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32"></div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Item Info</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rating</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-10 py-8 bg-slate-50/30"></td>
                  </tr>
                ))
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-50 group-hover:border-orange-200 transition-colors">
                          <img src={item.image || menuLogo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{item.name}</p>
                          <p className="text-xs text-slate-400 font-medium line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-900 text-lg">৳{Number(item.price).toFixed(0)}</p>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-1.5 text-amber-500 font-black">
                         <Star size={14} fill="currentColor" />
                         {Number(item.average_rating || 0).toFixed(1)}
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-2">
                          <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            disabled={processingId === item.id}
                            onClick={() => handleDelete(item.id)}
                            className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm flex items-center justify-center min-w-[42px]"
                          >
                            {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Utensils size={48} className="text-slate-200 mb-4" />
                      <h4 className="text-xl font-bold text-slate-900">No items found</h4>
                      <p className="text-slate-400 max-w-xs mx-auto mt-1">Try adjusting your search or filters to find what you are looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="px-10 py-8 bg-slate-50 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Showing {items.length} of {itemsData?.count || items.length} Items
           </p>
           <div className="flex gap-2">
              <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-orange-600 disabled:opacity-50 transition-all shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-orange-600 disabled:opacity-50 transition-all shadow-sm">
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AdminMenuManager;
