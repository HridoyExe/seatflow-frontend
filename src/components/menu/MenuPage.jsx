import React, { useState } from 'react';
import MenuItemCard from './MenuItemCard';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useMenuItems, useCategories } from '../../hooks/useMenuItems';
import { MenuItemSkeleton } from '../common/SkeletonLoader';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState({ id: 'All', name: 'All' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = [{ id: 'All', name: 'All' }, ...(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []))];

  const { data: itemsData, isLoading: itemsLoading, isPlaceholderData } = useMenuItems({
    page: currentPage,
    page_size: 8,
    search: searchQuery,
    category: activeCategory.id !== 'All' ? activeCategory.id : undefined,
  });

  const menuItems = itemsData?.results || [];
  const pagination = {
    next: itemsData?.next,
    previous: itemsData?.previous,
    total: itemsData?.count || 0
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory({ id: 'All', name: 'All' });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 text-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Our Exquisite Menu</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Carefully crafted dishes using the finest seasonal ingredients to bring you an unforgettable culinary experience.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex overflow-x-auto pb-2 w-full lg:w-auto scrollbar-hide gap-3 flex-nowrap">
            {categoriesLoading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 w-28 bg-slate-100 animate-pulse rounded-full"></div>)
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all
                    ${activeCategory.id === category.id 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96 flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search dishes..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md active:scale-95">
              Find
            </button>
          </form>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <MenuItemSkeleton key={i} />)}
          </div>
        ) : menuItems.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>

            {(pagination.next || pagination.previous) && (
              <div className="flex justify-center mt-16 gap-4 items-center">
                <button 
                  disabled={!pagination.previous || isPlaceholderData}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-3 rounded-full border border-slate-200 hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition group active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 bg-white px-6 py-2 rounded-full border border-slate-100 shadow-sm">
                    Page {currentPage}
                  </span>
                  {isPlaceholderData && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
                </div>
                <button 
                  disabled={!pagination.next || isPlaceholderData}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 rounded-full border border-slate-200 hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition group active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No dishes found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query.</p>
            <button 
              onClick={clearFilters}
              className="mt-6 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-2 px-8 rounded-full transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;