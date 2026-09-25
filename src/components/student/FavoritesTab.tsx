import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Plus, Clock, Flame, Coffee } from 'lucide-react';

interface FavoritesTabProps {
  onOpenCart: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ onOpenCart }) => {
  const { menuItems, addToCart, cart } = useApp();

  // Bestsellers and popular tea & snacks
  const favoriteItems = menuItems.filter(
    m => m.isBestseller || m.isTodaySpecial || m.category === 'tea_coffee'
  );

  return (
    <div className="space-y-5 pb-24 sm:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display flex items-center gap-2">
          <span>Student Favorites</span>
          <span className="text-rose-500">❤️</span>
        </h1>
        <p className="text-xs text-stone-500">
          The most ordered cutting chaya, hot snacks, and afternoon refreshers on campus
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {favoriteItems.map(item => {
          const inCart = cart.find(ci => ci.item.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  {item.badge || 'Popular'}
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {item.localName && (
                    <p className="text-[11px] font-semibold text-amber-800">
                      {item.localName}
                    </p>
                  )}

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-stone-900">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{inCart ? `Added (${inCart.quantity})` : 'Add to Tray'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
