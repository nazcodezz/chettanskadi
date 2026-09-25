import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodItem } from '../../types';
import {
  Search,
  Plus,
  Minus,
  Check,
  Flame,
  Leaf,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

type MenuCategoryFilter = FoodCategory | 'all';

interface MenuTabProps {
  initialCategory?: FoodCategory;
  onOpenCart: () => void;
}

const CATEGORIES: { id: MenuCategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'tea_coffee', label: 'Tea & Coffee', icon: '☕' },
  { id: 'quick_snacks', label: 'Quick Snacks', icon: '🥟' },
  { id: 'light_bites', label: 'Light Bites', icon: '🥪' },
  { id: 'cold_drinks', label: 'Cold Drinks', icon: '🍋' }
];

export const MenuTab: React.FC<MenuTabProps> = ({ initialCategory, onOpenCart }) => {
  const { menuItems, cart, addToCart, updateCartQuantity } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryFilter>(
    initialCategory || 'all'
  );
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (vegOnly && !item.isVeg) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLocal = item.localName ? item.localName.includes(q) : false;
      return matchName || matchDesc || matchLocal;
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-24 sm:pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display">
            Campus Refreshment Menu
          </h1>
          <p className="text-xs text-stone-500">
            Freshly prepared by canteen masters and delivered hot by Chettan
          </p>
        </div>

        {/* Veg Only Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Pure Veg Only</span>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={e => setVegOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 ml-1"
            />
          </label>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-2xs ${
              selectedCategory === cat.id
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search items in this section..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-sm font-bold text-stone-800">No snacks found</p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search or clearing the pure veg filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const inCart = cart.find(ci => ci.item.id === item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                  !item.inStock ? 'opacity-65 border-dashed border-stone-300' : 'border-stone-200'
                }`}
              >
                {/* Image and Badges */}
                <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.badge && (
                      <span className="bg-amber-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    {!item.inStock && (
                      <span className="bg-rose-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>~{item.prepTimeMinutes}m</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                        <h3 className="font-bold text-sm text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {item.localName && (
                      <p className="text-xs font-semibold text-amber-800 mt-0.5">
                        {item.localName}
                      </p>
                    )}

                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block leading-none">Price</span>
                      <span className="text-base font-extrabold text-stone-900">
                        ₹{item.price}
                      </span>
                    </div>

                    {item.inStock ? (
                      inCart ? (
                        <div className="flex items-center border border-amber-300 rounded-xl bg-amber-50 overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="px-2.5 py-1.5 text-amber-900 hover:bg-amber-200 transition-colors font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-extrabold text-amber-950">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="px-2.5 py-1.5 text-amber-900 hover:bg-amber-200 transition-colors font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Tray</span>
                        </button>
                      )
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 italic">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
