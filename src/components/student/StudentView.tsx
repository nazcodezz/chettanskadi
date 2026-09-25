import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeTab } from './HomeTab';
import { MenuTab } from './MenuTab';
import { OrdersTab } from './OrdersTab';
import { FavoritesTab } from './FavoritesTab';
import { ProfileTab } from './ProfileTab';
import { CartDrawer } from './CartDrawer';
import { OrderTrackingModal } from './OrderTrackingModal';
import { GroupOrderModal } from './GroupOrderModal';
import { LocationSelectorModal } from './LocationSelectorModal';
import { FoodCategory, CampusLocation } from '../../types';
import {
  Home,
  UtensilsCrossed,
  Clock,
  Heart,
  User,
  ShoppingBag
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { cartTotalCount, orders, activeOrder, setActiveOrderId, studentProfile, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'orders' | 'favorites' | 'profile'>('home');
  const [initialCategory, setInitialCategory] = useState<FoodCategory | undefined>(undefined);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const handleNavigateToMenu = (category?: FoodCategory) => {
    setInitialCategory(category);
    setActiveTab('menu');
  };

  const handleOpenTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setActiveOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setTrackingOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  const currentTrackedOrder = orders.find(o => o.id === trackingOrderId) || activeOrder;

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Tab Screen Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeTab
            onNavigateToMenu={handleNavigateToMenu}
            onOpenGroupModal={() => setIsGroupModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenOrderTracking={handleOpenTracking}
            onOpenMapSelector={() => setIsMapSelectorOpen(true)}
          />
        )}
        {activeTab === 'menu' && (
          <MenuTab
            initialCategory={initialCategory}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab
            onOpenTracking={handleOpenTracking}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        {activeTab === 'favorites' && (
          <FavoritesTab onOpenCart={() => setIsCartOpen(true)} />
        )}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Floating Bottom Cart Quick Trigger (Mobile & Desktop) */}
      {cartTotalCount > 0 && !isCartOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-8 z-30 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-2xl shadow-xl shadow-amber-900/30 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all border border-amber-500/30"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-extrabold text-[10px] flex items-center justify-center">
                {cartTotalCount}
              </span>
            </div>
            <span>View Tray & Checkout</span>
          </button>
        </div>
      )}

      {/* Student Bottom Navigation Bar (Mobile Friendly) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-2 px-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => {
              setInitialCategory(undefined);
              setActiveTab('menu');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'menu'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'orders'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px]">My Orders</span>
            {orders.some(o => o.status !== 'delivered' && o.status !== 'cancelled') && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'favorites'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">Favorites</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'profile'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        order={currentTrackedOrder}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Group Order Modal */}
      <GroupOrderModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />

      {/* North Block Campus Map & Location Selector */}
      <LocationSelectorModal
        isOpen={isMapSelectorOpen}
        onClose={() => setIsMapSelectorOpen(false)}
        selectedLocation={studentProfile.savedLocations[0]}
        onSelectLocation={(loc: CampusLocation) => {
          addToast('Campus Location Selected', `${loc.room} set as destination`, 'success');
          setIsCartOpen(true);
        }}
      />
    </div>
  );
};
