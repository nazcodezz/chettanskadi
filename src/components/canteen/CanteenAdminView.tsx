import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, FoodCategory, Order, OrderStatus } from '../../types';
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Coffee,
  Check,
  PauseCircle,
  PlayCircle,
  BarChart3,
  Sliders,
  DollarSign,
  Utensils,
  Bike
} from 'lucide-react';

export const CanteenAdminView: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemStock,
    orders,
    updateOrderStatus,
    canteenConfig,
    updateCanteenConfig,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'reports' | 'settings'>('dashboard');

  // New Item Modal
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form State for Add / Edit Item
  const [name, setName] = useState('');
  const [localName, setLocalName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('quick_snacks');
  const [price, setPrice] = useState(20);
  const [prepTime, setPrepTime] = useState(5);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);

  // Canteen Settings State
  const [openingTime, setOpeningTime] = useState(canteenConfig.openingTime);
  const [closingTime, setClosingTime] = useState(canteenConfig.closingTime);
  const [minOrder, setMinOrder] = useState(canteenConfig.minOrderAmount);
  const [deliveryFee, setDeliveryFee] = useState(canteenConfig.deliveryFee);
  const [freeThreshold, setFreeThreshold] = useState(canteenConfig.freeDeliveryThreshold);

  // Filter orders by active status
  const incomingOrders = orders.filter(o => o.status === 'placed');
  const preparingOrders = orders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready_for_pickup');
  const outOrders = orders.filter(o => o.status === 'chettan_assigned' || o.status === 'out_for_delivery');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  // Stats
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setLocalName('');
    setCategory('quick_snacks');
    setPrice(15);
    setPrepTime(5);
    setDescription('');
    setImage('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80');
    setIsVeg(true);
    setIsAddItemModalOpen(true);
  };

  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setLocalName(item.localName || '');
    setCategory(item.category);
    setPrice(item.price);
    setPrepTime(item.prepTimeMinutes);
    setDescription(item.description);
    setImage(item.image);
    setIsVeg(item.isVeg);
    setIsAddItemModalOpen(true);
  };

  const handleItemFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name,
        localName,
        category,
        price: Number(price),
        prepTimeMinutes: Number(prepTime),
        description,
        image: image || editingItem.image,
        isVeg
      });
    } else {
      addMenuItem({
        name,
        localName,
        category,
        price: Number(price),
        prepTimeMinutes: Number(prepTime),
        inStock: true,
        description,
        image: image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        isVeg
      });
    }

    setIsAddItemModalOpen(false);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCanteenConfig({
      openingTime,
      closingTime,
      minOrderAmount: Number(minOrder),
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeThreshold)
    });
    addToast('Settings Saved', 'Canteen parameters successfully updated', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Header and Live Pause / Rush Toggle */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-amber-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-2xl shrink-0">
              <Store className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                  Canteen Operations Desk
                </h1>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    canteenConfig.pauseOrders
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {canteenConfig.pauseOrders ? 'Orders Paused' : 'Live & Accepting'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Hours: {canteenConfig.openingTime} – {canteenConfig.closingTime} · Campus Chaya Kadi Counter
              </p>
            </div>
          </div>

          {/* Pause Rush Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextPause = !canteenConfig.pauseOrders;
                updateCanteenConfig({
                  pauseOrders: nextPause,
                  pauseReason: nextPause ? 'Lunch Rush: Kitchen is at peak capacity for 15 mins' : ''
                });
                addToast(
                  nextPause ? 'Orders Paused' : 'Orders Resumed',
                  nextPause ? 'Students cannot checkout until unpaused.' : 'Students can place orders normally.',
                  nextPause ? 'warning' : 'success'
                );
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                canteenConfig.pauseOrders
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
              }`}
            >
              {canteenConfig.pauseOrders ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Accepting Orders</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Orders (Kitchen Rush)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canteen Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-800 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-stone-400 block text-[11px]">Total Orders Today</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              {orders.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-stone-400 block text-[11px]">Gross Sales</span>
            <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">
              ₹{totalSales}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-stone-400 block text-[11px]">Active in Kitchen</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              {incomingOrders.length + preparingOrders.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-stone-400 block text-[11px]">Average Prep Time</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">
              ~6 mins
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Live Kitchen Board</span>
          {incomingOrders.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px]">
              {incomingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'menu'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Menu & Stock Catalog ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Sales & Peak Hours Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Canteen Rules & Settings</span>
        </button>
      </div>

      {/* TAB: KITCHEN DASHBOARD / ORDERS BOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* New Incoming Orders that require Canteen action */}
          {incomingOrders.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wide">
                  New Incoming Orders ({incomingOrders.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incomingOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                      <div>
                        <span className="font-extrabold text-stone-900 text-sm">{order.id}</span>
                        <span className="text-stone-500 ml-2 font-medium">
                          {order.student.name} ({order.student.department})
                        </span>
                      </div>
                      <span className="font-bold text-amber-900">₹{order.totalAmount}</span>
                    </div>

                    <div className="text-stone-700 font-semibold space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {it.quantity}× {it.name}
                          </span>
                          {it.instructions && (
                            <span className="text-amber-800 text-[11px] font-normal">
                              ({it.instructions})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-stone-500 pt-1">
                      Deliver to: <span className="font-semibold text-stone-800">{order.deliveryLocation.building} · {order.deliveryLocation.room}</span> ({order.scheduledTime})
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, 'accepted', 'Canteen accepted order')
                        }
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Order</span>
                      </button>

                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, 'cancelled', 'Canteen rejected order')
                        }
                        className="px-3 py-1.5 text-stone-500 hover:text-rose-600 border border-stone-200 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kanban Columns: Preparing vs Ready for Pickup vs In Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Preparing */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wide text-stone-800">
                    Brewing & Preparing ({preparingOrders.length})
                  </h3>
                </div>
              </div>

              {preparingOrders.length === 0 ? (
                <p className="text-xs text-stone-400 p-4 text-center">No orders being prepared.</p>
              ) : (
                <div className="space-y-2.5">
                  {preparingOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex justify-between font-bold">
                        <span>{order.id}</span>
                        <span className="text-amber-800">₹{order.totalAmount}</span>
                      </div>
                      <p className="text-stone-600">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        For: {order.student.name} · {order.deliveryLocation.room}
                      </p>

                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            'ready_for_pickup',
                            'Packed in canteen tray, ready for Chettan pickup'
                          )
                        }
                        className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Ready for Pickup on Counter */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wide text-stone-800">
                    Ready on Counter ({readyOrders.length})
                  </h3>
                </div>
              </div>

              {readyOrders.length === 0 ? (
                <p className="text-xs text-stone-400 p-4 text-center">
                  Counter is clear.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {readyOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex justify-between font-bold">
                        <span>{order.id}</span>
                        <span className="text-emerald-700 font-bold">Tray Packed</span>
                      </div>
                      <p className="text-stone-700 font-semibold">
                        {order.deliveryLocation.building} · {order.deliveryLocation.room}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </p>

                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            'chettan_assigned',
                            'Handed over to Chettan Kumaran'
                          )
                        }
                        className="w-full py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Hand Over to Chettan</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Out for Delivery / Chettan Walking */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wide text-stone-800">
                    Chettan on Campus ({outOrders.length})
                  </h3>
                </div>
              </div>

              {outOrders.length === 0 ? (
                <p className="text-xs text-stone-400 p-4 text-center">No active runners right now.</p>
              ) : (
                <div className="space-y-2.5">
                  {outOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1.5 text-xs"
                    >
                      <div className="flex justify-between font-bold">
                        <span>{order.id}</span>
                        <span className="text-amber-800 font-mono font-bold">PIN: {order.deliveryPin}</span>
                      </div>
                      <p className="text-stone-700">
                        En route to {order.deliveryLocation.room} ({order.deliveryLocation.building})
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Student: {order.student.name} · {order.student.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MENU & STOCK MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Canteen Food Catalog ({menuItems.length} items)
              </h2>
              <p className="text-xs text-stone-500">
                Update prices, prep times, and toggle sold-out availability instantly
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Snack / Beverage</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    {item.localName && (
                      <p className="text-[11px] font-medium text-amber-800">
                        {item.localName}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold text-stone-900">
                        ₹{item.price}
                      </span>
                      <span className="text-[11px] text-stone-400">·</span>
                      <span className="text-[11px] text-stone-500">
                        ~{item.prepTimeMinutes}m prep
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Toggle & Edit Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  {/* In Stock toggle button */}
                  <button
                    onClick={() => toggleItemStock(item.id)}
                    className={`px-3 py-1 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      item.inStock
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <span>{item.inStock ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SALES & REPORTS ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Snacks Breakdown */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-700" />
                <span>Most Popular Snacks Today</span>
              </h3>

              <div className="space-y-2.5 text-xs pt-1">
                {[
                  { name: 'Crispy Veg Samosa', count: 42, pct: 85 },
                  { name: 'Kerala Egg Puff', count: 36, pct: 72 },
                  { name: 'Pazhampori (Banana Fritter)', count: 28, pct: 56 },
                  { name: 'Spicy Potato Cutlet', count: 19, pct: 38 },
                  { name: 'Grilled Veg Sandwich', count: 14, pct: 28 }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>{s.name}</span>
                      <span>{s.count} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-700 h-full rounded-full transition-all"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Beverages */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Most Popular Beverages</span>
              </h3>

              <div className="space-y-2.5 text-xs pt-1">
                {[
                  { name: 'Special Kadum Chaya (Dum Tea)', count: 68, pct: 95 },
                  { name: 'Hot Filter Bru Coffee', count: 34, pct: 50 },
                  { name: 'Fresh Lime Soda / Juice', count: 29, pct: 42 },
                  { name: 'Kattan Chaya (Black Tea)', count: 22, pct: 32 },
                  { name: 'Spicy Kulukki Sarbath', count: 18, pct: 25 }
                ].map((b, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>{b.name}</span>
                      <span>{b.count} cups</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Peak Hours Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Campus Ordering Spikes & Break Times</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block">09:00 - 10:00 AM</span>
                <span className="text-[11px] text-stone-600">Morning Faculty & Lab Run</span>
                <span className="text-lg font-black text-amber-900 mt-1 block">18 orders</span>
              </div>

              <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
                <span className="font-bold text-amber-950 block">11:00 - 11:30 AM 🔥</span>
                <span className="text-[11px] text-stone-600">Peak Short Break Spike</span>
                <span className="text-lg font-black text-amber-950 mt-1 block">52 orders</span>
              </div>

              <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
                <span className="font-bold text-amber-950 block">01:00 - 02:00 PM 🔥</span>
                <span className="text-[11px] text-stone-600">College Lunch Rush</span>
                <span className="text-lg font-black text-amber-950 mt-1 block">46 orders</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block">03:30 - 04:30 PM</span>
                <span className="text-[11px] text-stone-600">Evening Lab Chai Break</span>
                <span className="text-lg font-black text-amber-900 mt-1 block">31 orders</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CANTEEN SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSettingsSave}
          className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-4 max-w-xl"
        >
          <h3 className="font-bold text-sm text-stone-900">
            Canteen Operating Rules
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Opening Time
              </label>
              <input
                type="text"
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Closing Time
              </label>
              <input
                type="text"
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Min Order (₹)
              </label>
              <input
                type="number"
                value={minOrder}
                onChange={e => setMinOrder(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={e => setDeliveryFee(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                value={freeThreshold}
                onChange={e => setFreeThreshold(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-stone-300"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Update Canteen Rules
            </button>
          </div>
        </form>
      )}

      {/* ADD / EDIT ITEM MODAL */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-3">
              {editingItem ? 'Edit Snack / Beverage' : 'Add New Snack to Canteen Menu'}
            </h3>

            <form onSubmit={handleItemFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Chai, Veg Cutlet"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Malayalam / Local Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ചായ, കട്ട്ലറ്റ്"
                    value={localName}
                    onChange={e => setLocalName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as FoodCategory)}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="tea_coffee">Tea & Coffee</option>
                    <option value="quick_snacks">Quick Snacks</option>
                    <option value="light_bites">Light Bites</option>
                    <option value="cold_drinks">Cold Drinks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={prepTime}
                    onChange={e => setPrepTime(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Piping hot, freshly fried, etc."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVeg}
                  onChange={e => setIsVeg(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-stone-700">
                  Pure Vegetarian Item
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  {editingItem ? 'Save Item' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
