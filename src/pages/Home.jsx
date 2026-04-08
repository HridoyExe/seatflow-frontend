import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Star, ArrowRight } from 'lucide-react';
import { useMenuItems, useCategories } from '../hooks/useMenuItems';
import homeImg from "../assets/images/photo-1517248135467-4c7edcad34c4.web.avif";
import { MenuItemSkeleton } from '../components/common/SkeletonLoader';
import useAuth from '../hooks/useAuth';
import menuLogo from '../assets/images/menu.png';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: itemsData, isLoading: itemsLoading } = useMenuItems({ is_special: true });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const displayItems = itemsData?.results?.slice(0, 6) || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []);
  const menuCategories = ['All', ...categories.map(c => c.name)];

  return (
    <div className="font-sans min-h-screen bg-[#fcf9f7] pb-8 md:pb-20 text-slate-800">
      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[600px] flex items-center justify-center text-center px-6 overflow-hidden max-w-7xl mx-auto md:rounded-[3rem] md:mt-6 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 md:hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${homeImg})`
          }}
        ></div>

        <div className="relative z-10 space-y-6 md:space-y-10">
          <h2 className="text-white text-3xl sm:text-6xl md:text-8xl font-black leading-tight tracking-tight drop-shadow-2xl">
            Exquisite Flavors, <br className="hidden md:block" />Unforgettable Moments
          </h2>
          <div className="pt-6 flex items-center justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate('/seats')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-10 md:py-5 md:px-16 rounded-2xl md:rounded-full shadow-2xl shadow-orange-500/40 transition-all text-lg md:text-2xl"
            >
              Reserve a Table
            </button>
            {!user && (
              <button
                onClick={() => navigate('/register')}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-xl font-black py-4 px-10 md:py-5 md:px-16 rounded-2xl md:rounded-full transition-all text-lg md:text-2xl"
              >
                Join Us
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <section className="py-12 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-1 w-12 bg-orange-500 rounded-full"></span>
                <span className="text-orange-600 font-black uppercase tracking-widest text-sm">Chef's Specials</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Featured Culinary Delights</h2>
            </div>
            <Link to="/menu" className="group flex items-center gap-2 text-orange-600 font-black text-lg md:text-xl hover:text-orange-700 transition-colors">
              View Full Menu <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="flex gap-3 md:gap-5 overflow-x-auto scrollbar-hide mb-12 md:mb-16 pb-4">
            {categoriesLoading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-12 w-32 bg-slate-200 animate-pulse rounded-full"></div>)
            ) : (
              menuCategories.map((cat, index) => (
                <button 
                  key={index} 
                  onClick={() => navigate(`/menu`, { state: { initialCategory: cat } })}
                  className="bg-white border-2 border-slate-100 text-slate-600 hover:border-orange-200 hover:bg-orange-50 px-6 py-3 md:py-4 md:px-10 rounded-2xl md:rounded-full text-base md:text-lg font-black whitespace-nowrap transition-all shadow-sm"
                >
                  {cat}
                </button>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 pb-16">
            {itemsLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => <MenuItemSkeleton key={i} />)
            ) : displayItems.length > 0 ? (
              displayItems.map((item) => {

                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/menu/${item.id}`)}
                    className="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 p-4 md:p-6 transition-all duration-500 cursor-pointer overflow-hidden"
                  >
                    <div className="relative h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden mb-6 shadow-lg bg-slate-50">
                       <img 
                        src={item.image || menuLogo} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-orange-600 font-black text-xs md:text-sm shadow-xl">
                         ৳{Number(item.price).toFixed(0)}
                       </div>
                    </div>

                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                           {item.category_name}
                         </span>
                         <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                           <Star size={14} fill="currentColor" /> {Number(item.average_rating || 0).toFixed(1)}
                         </div>
                       </div>
                       <h3 className="text-lg md:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mt-2">{item.name}</h3>
                       <p className="text-slate-500 text-sm md:text-base line-clamp-2 leading-relaxed mt-2">{item.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-xl font-bold text-slate-400">No special items available.</p>
              </div>
            )}
          </div>
        </section>

        <section className="relative bg-slate-900 mx-0 rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 text-center overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-left">
            <div className="md:w-3/5">
              <h3 className="text-2xl md:text-6xl font-black mb-4 md:mb-6 text-white tracking-tight">Master Your <br />Dining Experience</h3>
              <p className="text-slate-400 text-base md:text-2xl mb-8 leading-relaxed">
                Secure your favorite table in seconds with our visionary real-time booking engine.
              </p>
            </div>
            <button 
              onClick={() => navigate('/seats')}
              className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto px-16 py-6 rounded-2xl md:rounded-full font-black text-2xl shadow-2xl transition-all"
            >
              Reserve Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;