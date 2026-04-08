import React from 'react';
import { useCategories } from '../../hooks/useMenuItems';

const CategoryFilter = ({ onSelectCategory, activeCategoryId }) => {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto p-4 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 bg-slate-100 rounded-full"></div>)}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto p-4 scrollbar-hide">
      <button 
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm border
          ${!activeCategoryId ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm border whitespace-nowrap
            ${activeCategoryId === cat.id ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;