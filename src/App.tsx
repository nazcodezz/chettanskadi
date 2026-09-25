import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { StudentView } from './components/student/StudentView';
import { ChettanView } from './components/chettan/ChettanView';
import { CanteenAdminView } from './components/canteen/CanteenAdminView';
import { Smartphone, Info, Coffee, Bike, Store, GraduationCap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, setRole, deviceView, orders } = useApp();

  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Top Universal Navbar with Role Switcher */}
      <Navbar />

      {/* Role Switcher Demo Hint Bar */}
      <div className="bg-amber-950 text-amber-100 text-xs py-1.5 px-3 border-b border-amber-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[11px] tracking-wide uppercase bg-amber-800 text-amber-100 px-2 py-0.5 rounded">
              3-in-1 Campus System
            </span>
            <span className="hidden sm:inline text-amber-200/90 text-[11px]">
              Switch anytime above:
            </span>
            <span className="text-[11px] text-amber-200">
              {role === 'student'
                ? '👨‍🎓 Student: Order tea & snacks to classroom + get 4-digit PIN'
                : role === 'delivery'
                ? '🚴 Chettan Runner: Smart batch walking + verify student PIN'
                : '👨‍🍳 Canteen Admin: Kitchen orders, stock catalog & rush controls'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-amber-300 font-semibold">{activeOrdersCount} Live Orders</span>
            <span className="text-amber-600">|</span>
            <button
              onClick={() => setRole(role === 'student' ? 'delivery' : role === 'delivery' ? 'canteen' : 'student')}
              className="font-bold underline text-amber-200 hover:text-white"
            >
              Next Role →
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area (with optional Mobile Phone Mockup Frame) */}
      <div className="flex-1 flex flex-col">
        {deviceView === 'mobile_frame' ? (
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-stone-200/60">
            {/* Mobile Device Mockup */}
            <div className="relative w-full max-w-[420px] h-[850px] max-h-[92vh] bg-white rounded-[44px] shadow-2xl border-8 border-stone-800 flex flex-col overflow-hidden ring-1 ring-black/10">
              {/* Speaker & Camera Notch */}
              <div className="h-6 bg-stone-900 flex items-center justify-center relative shrink-0">
                <div className="w-20 h-3.5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-stone-800 mr-2" />
                  <div className="w-8 h-1 bg-stone-700 rounded-full" />
                </div>
              </div>

              {/* Mobile Screen Scroll Content */}
              <div className="flex-1 overflow-y-auto bg-amber-50/20">
                {role === 'student' && <StudentView />}
                {role === 'delivery' && <ChettanView />}
                {role === 'canteen' && <CanteenAdminView />}
              </div>

              {/* Bottom Home Indicator */}
              <div className="h-4 bg-white flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-stone-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            {role === 'student' && <StudentView />}
            {role === 'delivery' && <ChettanView />}
            {role === 'canteen' && <CanteenAdminView />}
          </div>
        )}
      </div>

      {/* Toasts for alerts & notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
