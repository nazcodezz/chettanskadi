import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodItem } from '../../types';
import {
  Search,
  Sparkles,
  Clock,
  RotateCcw,
  Users,
  Flame,
  Plus,
  Check,
  ChevronRight,
  Coffee,
  Heart,
  Calendar,
  AlertCircle,
  Compass,
  MapPin
} from 'lucide-react';

interface HomeTabProps {
  onNavigateToMenu: (category?: FoodCategory) => void;
  onOpenGroupModal: () => void;
  onOpenCart: () => void;
  onOpenOrderTracking: (orderId: string) => void;
  onOpenMapSelector?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateToMenu,
  onOpenGroupModal,
  onOpenCart,
  onOpenOrderTracking,
  onOpenMapSelector
}) => {
  const {
    studentProfile,
    menuItems,
    addToCart,
    orders,
    cart,
    canteenConfig,
    reorderItems,
    chettanProfile
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Specials & Bestsellers
  const todaySpecials = menuItems.filter(m => m.isTodaySpecial || m.isBestseller).slice(0, 4);
  const quickBites = menuItems.filter(m => m.price <= 20).slice(0, 6);

  // Past orders for quick reordering
  const pastOrders = orders.filter(o => o.status === 'delivered').slice(0, 2);
  const activeOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  // Filtered snacks when searching
  const searchResults = searchQuery.trim()
    ? menuItems.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.localName && item.localName.includes(searchQuery))
      )
    : [];

  return (
    <div className="space-y-6 pb-20 sm:pb-12">
      {/* Hero Welcome & Campus Delivery Status Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-800 via-amber-900 to-stone-950 text-white p-5 sm:p-7 shadow-lg shadow-amber-950/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-amber-700 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                Kerala Campus Tea Runner
              </span>
              <span className="text-amber-400">·</span>
              <span className="text-xs text-amber-200">
                {studentProfile.department.split('&')[0]}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Namaskaram, {studentProfile.name.split(' ')[0]}! ☕
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-md">
              Order hot Kadum Chaya, piping samosas & egg puffs. Chettan will deliver straight to your classroom desk.
            </p>

            {/* Quick Live Stats Pill */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium text-amber-100">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {canteenConfig.pauseOrders
                    ? 'Orders Paused'
                    : `ETA: ~${canteenConfig.estimatedDeliveryMins} mins`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Chettan Kumaran On Duty</span>
              </div>
            </div>
          </div>

          {/* Quick Group Order Button */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={onOpenGroupModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Class Group Order</span>
            </button>
            <p className="text-[10px] text-amber-300/80 text-center">
              Combine orders with benchmates
            </p>
          </div>
        </div>
      </div>

      {/* Active Order Notice (If Any) */}
      {activeOrders.length > 0 && (
        <div
          onClick={() => onOpenOrderTracking(activeOrders[0].id)}
          className="p-4 rounded-2xl bg-amber-100/90 border border-amber-300/80 shadow-xs cursor-pointer hover:bg-amber-100 transition-colors flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-900">
                  Active Order {activeOrders[0].id}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-300 text-amber-950">
                  {activeOrders[0].status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                PIN: <span className="font-mono font-bold text-amber-950">{activeOrders[0].deliveryPin}</span> · Delivering to {activeOrders[0].deliveryLocation.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
            <span>Track</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Interactive College Floor Plan Map Banner */}
      <div
        onClick={onOpenMapSelector}
        className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 text-white border border-stone-800 shadow-md cursor-pointer hover:border-amber-600/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                North Block 1st Floor Map
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 border border-amber-300/30 font-mono">
                CAD Blueprint
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Tap to pick your classroom (System Lab CSE, CE 3A, Seminar Hall) directly on the blueprint
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto shadow-xs group-hover:bg-amber-400 transition-colors">
          <span>Open Floor Map</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search Kadum Chaya, Samosa, Egg Puff, Pazhampori..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200/90 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600 focus:border-amber-600 shadow-2xs transition-all"
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

      {/* Search Results Display */}
      {searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Found {searchResults.length} snacks for &ldquo;{searchQuery}&rdquo;
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-xs text-stone-500 p-4 text-center bg-white rounded-xl border border-stone-200">
              No snacks match that search. Try &ldquo;chai&rdquo;, &ldquo;puff&rdquo;, or &ldquo;samosa&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {searchResults.map(item => {
                const inCartItem = cart.find(ci => ci.item.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs font-semibold text-amber-900">₹{item.price}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      {inCartItem ? `+${inCartItem.quantity}` : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Category Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
            Canteen Menu Sections
          </h2>
          <button
            onClick={() => onNavigateToMenu()}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              id: 'tea_coffee' as FoodCategory,
              title: 'Tea & Coffee',
              sub: 'Kadum Chaya, Bru, Boost',
              icon: '☕'
            },
            {
              id: 'quick_snacks' as FoodCategory,
              title: 'Quick Snacks',
              sub: 'Samosas, Egg Puffs, Fritters',
              icon: '🥟'
            },
            {
              id: 'light_bites' as FoodCategory,
              title: 'Light Bites',
              sub: 'Sandwiches, Cream Buns',
              icon: '🥪'
            },
            {
              id: 'cold_drinks' as FoodCategory,
              title: 'Cold Drinks',
              sub: 'Fresh Lime, Kulukki, Juices',
              icon: '🍋'
            }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigateToMenu(cat.id)}
              className="p-3 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 hover:border-amber-300 text-left transition-all shadow-2xs group"
            >
              <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <p className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                {cat.title}
              </p>
              <p className="text-[10px] text-stone-500 line-clamp-1">{cat.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Specials Banner Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Today&apos;s Specials & Bestsellers
            </h2>
          </div>
          <span className="text-xs text-stone-500">Fresh from Canteen Kadi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {todaySpecials.map(item => {
            const inCart = cart.find(ci => ci.item.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-32 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.badge && (
                      <span className="bg-amber-600/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                    ~{item.prepTimeMinutes}m prep
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
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
                    </div>
                    {item.localName && (
                      <p className="text-[11px] font-medium text-amber-800">
                        {item.localName}
                      </p>
                    )}
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                    <span className="text-sm font-extrabold text-stone-900">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inCart ? `Added (${inCart.quantity})` : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Reorder Section */}
      {pastOrders.length > 0 && (
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-800" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Quick Reorder Favorites
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pastOrders.map(pOrder => (
              <div
                key={pOrder.id}
                className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-stone-900">
                    {pOrder.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Delivered to {pOrder.deliveryLocation.room} · ₹{pOrder.totalAmount}
                  </p>
                </div>

                <button
                  onClick={() => {
                    reorderItems(pOrder);
                    onOpenCart();
                  }}
                  className="px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reorder</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Pocket Snacks Under ₹20 */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
            Campus Pocket Snacks (Under ₹20)
          </h2>
          <span className="text-xs text-stone-500">Student friendly prices</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {quickBites.map(item => (
            <div
              key={item.id}
              className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col justify-between"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-16 rounded-lg object-cover mb-2"
              />
              <p className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</p>
              <p className="text-xs font-extrabold text-amber-900 mt-0.5">₹{item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 w-full py-1 bg-stone-100 hover:bg-amber-700 hover:text-white text-stone-800 text-[11px] font-bold rounded-lg transition-colors"
              >
                + Tray
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
