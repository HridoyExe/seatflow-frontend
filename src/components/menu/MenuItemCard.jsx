import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Leaf, Flame, Award, Utensils } from 'lucide-react';
import menuLogo from '../../assets/images/menu.png';

const MenuItemCard = ({ item }) => {
  const displayImage = item.image;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full text-slate-800">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={18} />
        </button>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {item.is_special && (
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-md uppercase">
              Special
            </span>
          )}
          {item.chef_choice && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold rounded-full shadow-md uppercase flex items-center gap-1">
              <Award size={10} /> Chef's Choice
            </span>
          )}
        </div>

        <img 
          src={item.image || menuLogo} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        
        {!item.is_available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg shadow-xl text-sm uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-500 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <span className="text-lg font-black text-orange-500">
            ৳{Number(item.price).toFixed(0)} {/* Bangladesh context e ৳ symbol use korlam */}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {item.category_name}
          </span>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star size={14} fill="currentColor" />
            <span>{item.average_rating ? Number(item.average_rating).toFixed(1) : "New"}</span>
            <span className="text-slate-300 font-medium ml-0.5">({item.total_reviews || 0})</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
          {item.description}
        </p>
        
        {/* Dietary Tags */}
        <div className="flex gap-2 mb-6">
          {item.is_vegetarian && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
              <Leaf size={10} /> VEG
            </div>
          )}
          {item.is_spicy && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              <Flame size={10} /> SPICY
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Link 
            to={`/menu/${item.id}`} 
            className="btn bg-orange-500 hover:bg-orange-600 border-none rounded-full w-full font-bold shadow-md shadow-orange-500/20 text-white flex items-center justify-center py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;