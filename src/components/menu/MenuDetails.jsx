import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Minus, Plus, ShoppingBag, Info, Star, Leaf, 
  Flame, Award, Clock, CheckCircle2, XCircle, Utensils
} from 'lucide-react';
import { useItemDetails } from '../../hooks/useMenuItems';
import { useCart } from '../../context/CartContext';
import menuLogo from '../../assets/images/menu.png';
import ReviewSection from './ReviewSection';
import { MenuDetailsSkeleton } from '../common/SkeletonLoader';

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [added, setAdded] = useState(false);

  const { data: item, isLoading, isError, error } = useItemDetails(id);

  React.useEffect(() => {
    if (item) {
      setActiveImage(item.image || null);
    }
  }, [item]);

  const handleAddToOrder = () => {
    if (item) {
      addToCart(item, quantity); 
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        navigate('/checkout');
      }, 800);
    }
  };

  if (isLoading) return <MenuDetailsSkeleton />;

  if (isError || !item) return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-slate-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Item Not Found</h2>
        <p className="text-slate-500 mb-8">{error?.response?.data?.detail || "This dish seems to have vanished from our kitchen."}</p>
        <Link to="/menu" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-full shadow-lg transition-all font-bold">
          Back to Menu
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/menu" className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-8 transition-colors group">
          <div className="p-2 bg-white rounded-full shadow-sm mr-3 group-hover:bg-orange-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Menu
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            
            <div className="lg:w-1/2 p-6 lg:p-10 bg-slate-50/50">
              <div className="aspect-square relative rounded-3xl overflow-hidden shadow-2xl mb-6 group bg-white">
                <img 
                  src={activeImage || menuLogo} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  {item.is_special && (
                    <span className="px-5 py-2 bg-orange-500 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest">
                      Special Edition
                    </span>
                  )}
                  {item.chef_choice && (
                    <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest flex items-center gap-2">
                      <Award size={14} /> Chef's Recommendation
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col">
              <div className="mb-6 flex items-center gap-3">
                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  {item.category_name}
                </span>
                {item.average_rating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                    <Star size={14} fill="currentColor" />
                    <span>{Number(item.average_rating).toFixed(1)}</span>
                    <span className="text-slate-400 font-medium ml-1">({item.total_reviews})</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">{item.name}</h1>
              <div className="text-4xl font-black text-orange-500 mb-8">৳{Number(item.price * quantity).toFixed(0)}</div>
              
              <p className="text-slate-600 leading-relaxed text-lg mb-6 pb-8 border-b border-slate-100">
                {item.description}
              </p>

              {item.stock !== undefined && item.stock <= 10 && item.stock > 0 && (
                <div className="mb-6 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-sm font-bold flex items-center gap-2 animate-pulse">
                  <Info size={16} /> Only {item.stock} items left in stock!
                </div>
              )}
              {item.stock === 0 && (
                <div className="mb-6 px-4 py-2 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2">
                  <XCircle size={16} /> Currently out of stock
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-10">
                {item.is_vegetarian && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl border border-green-100 font-bold text-sm">
                    <Leaf size={16} /> Vegetarian
                  </div>
                )}
                {item.is_spicy && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
                    <Flame size={16} /> Spicy
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold text-sm">
                  <Clock size={16} /> 15-20 Min
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-auto">
                <div className="flex items-center border-2 border-slate-100 rounded-2xl bg-slate-50 p-1.5 min-w-[140px] justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-orange-600 hover:shadow-sm text-slate-400 transition-all active:scale-95"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <span className="text-xl font-black text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => {
                        if (item.stock !== undefined && quantity >= item.stock) return;
                        setQuantity(quantity + 1);
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${item.stock !== undefined && quantity >= item.stock ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-white hover:text-orange-600 hover:shadow-sm text-slate-400'}`}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
                
                <button 
                  disabled={!item.is_available || added || (item.stock !== undefined && item.stock === 0)}
                  onClick={handleAddToOrder}
                  className={`flex-grow bg-orange-500 hover:bg-orange-600 rounded-2xl px-10 h-14 shadow-xl text-white text-lg font-bold flex items-center justify-center gap-3 transition-all active:scale-95 ${(!item.is_available || added || (item.stock !== undefined && item.stock === 0)) ? 'grayscale opacity-50 cursor-not-allowed' : 'shadow-orange-500/30'}`}
                >
                  {added ? (
                    <><CheckCircle2 size={22} /> Added to Order</>
                  ) : (
                    <><ShoppingBag size={22} /> {item.is_available ? 'Add to Your Order' : 'Out of Stock'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection itemId={id} />
      </div>
    </div>
  );
};

export default MenuDetails;