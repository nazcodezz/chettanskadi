import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, ShoppingBag, Smartphone, Monitor, Clock, ShieldCheck, Bike, Store, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
  onOpenActiveOrder?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenActiveOrder }) => {
  const {
    role,
    setRole,
    deviceView,
    setDeviceView,
    cartTotalCount,
    orders,
    canteenConfig,
    activeOrder
  } = useApp();

  // Calculate live badge counts
  const chettanActionableCount = orders.filter(
    o => o.status === 'ready_for_pickup' || o.status === 'chettan_assigned' || o.status === 'out_for_delivery'
  ).length;

  const canteenActionableCount = orders.filter(
    o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing'
  ).length;

  const studentHasActive = activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md shadow-amber-900/20 shrink-0">
              <Coffee className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-amber-950 font-display">
                  ChettanKadi
                </span>
                <span className="hidden md:inline-flex text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  Campus Chaya Kadi
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block leading-none mt-0.5">
                Hot tea, fresh puffs & samosas delivered to your classroom
              </p>
            </div>
          </div>

          {/* Role Switcher - Center */}
          <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 shadow-inner">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Student App"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>Student</span>
              {studentHasActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setRole('delivery')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'delivery'
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Chettan Runner App"
            >
              <Bike className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Chettan</span>
              <span className="xs:hidden">Runner</span>
              {chettanActionableCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white leading-none">
                  {chettanActionableCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('canteen')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'canteen'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Canteen Kitchen Admin"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Canteen</span>
              <span className="sm:hidden">Admin</span>
              {canteenActionableCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white leading-none">
                  {canteenActionableCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle (Mobile Mockup vs Responsive Wide) */}
            <button
              onClick={() => setDeviceView(deviceView === 'responsive' ? 'mobile_frame' : 'responsive')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
              title={deviceView === 'responsive' ? 'Switch to Mobile Phone Preview' : 'Switch to Full Screen View'}
            >
              {deviceView === 'responsive' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Phone Frame</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-stone-500" />
                  <span>Wide View</span>
                </>
              )}
            </button>

            {/* Student specific: Active Order tracker pill */}
            {role === 'student' && studentHasActive && onOpenActiveOrder && (
              <button
                onClick={onOpenActiveOrder}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200/80 rounded-lg transition-colors border border-amber-300/60"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Track {activeOrder.id}</span>
              </button>
            )}

            {/* Student specific: Cart button */}
            {role === 'student' && onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Tray</span>
                {cartTotalCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-950 text-amber-100 rounded-full">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* Canteen / Chettan status badge */}
            {role !== 'student' && (
              <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium px-2.5 py-1.5 rounded-lg bg-stone-100 border border-stone-200">
                <Clock className="w-3 h-3 text-amber-700" />
                <span className="hidden sm:inline">
                  {canteenConfig.pauseOrders ? 'Orders Paused' : 'Canteen Open'}
                </span>
                <span className="sm:hidden">
                  {canteenConfig.pauseOrders ? 'Paused' : 'Open'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
