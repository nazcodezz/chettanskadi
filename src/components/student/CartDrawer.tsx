import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusLocation } from '../../types';
import { BREAK_SLOTS } from '../../data/initialData';
import { LocationSelectorModal } from './LocationSelectorModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Wallet,
  AlertTriangle,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    canteenConfig,
    studentProfile,
    placeOrder,
    addToast
  } = useApp();

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation>(
    studentProfile.savedLocations[0] || {
      department: 'Computer Science & Engineering',
      building: 'Main Block',
      floor: '2nd Floor',
      room: 'CS-304',
      landmark: 'Near IoT Lab',
      label: 'My Classroom (S6 CSE)'
    }
  );

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState(BREAK_SLOTS[0].label);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'wallet'>('upi');
  const [specialOrderNote, setSpecialOrderNote] = useState('');
  const [itemInstructions, setItemInstructions] = useState<Record<string, string>>({});
  const [showUpiModal, setShowUpiModal] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = cartSubtotal >= canteenConfig.freeDeliveryThreshold ? 0 : canteenConfig.deliveryFee;
  const grandTotal = cartSubtotal + deliveryFee;
  const isBelowMin = cartSubtotal < canteenConfig.minOrderAmount;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (canteenConfig.pauseOrders) {
      addToast('Orders Paused', 'Canteen is currently pausing new orders due to rush.', 'alert');
      return;
    }

    if (isBelowMin) {
      addToast(
        'Minimum Order Required',
        `Canteen requires a minimum order of ₹${canteenConfig.minOrderAmount}.`,
        'warning'
      );
      return;
    }

    if (paymentMethod === 'upi') {
      setShowUpiModal(true);
      return;
    }

    finalizeOrder('cod');
  };

  const finalizeOrder = (method: 'cod' | 'upi' | 'wallet') => {
    setShowUpiModal(false);

    const newOrder = placeOrder({
      location: selectedLocation,
      paymentMethod: method,
      scheduledTime: scheduledSlot,
      specialNote: specialOrderNote
    });

    // Fire festive campus confetti
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#b45309', '#f59e0b', '#10b981', '#ffffff']
      });
    } catch {
      // safe ignore
    }

    onClose();
    onOrderSuccess(newOrder.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-amber-50/70 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900 leading-tight">
                  Your Refreshment Tray
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} ready for campus delivery
                </p>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Clear tray"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Body */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">Your tray is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Add some steaming Kadum Chaya, crispy samosas, or banana fritters to enjoy in class!
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Explore Chaya Kadi Menu
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {/* Notice if canteen paused */}
                {canteenConfig.pauseOrders && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Canteen Orders Paused</p>
                      <p className="mt-0.5 text-rose-700">
                        {canteenConfig.pauseReason || 'High rush period in kitchen. Check back in 5 mins.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-600 uppercase tracking-wider">
                    <span>Order Items</span>
                    <span>Qty</span>
                  </div>

                  {cart.map(cartItem => (
                    <div
                      key={cartItem.item.id}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  cartItem.item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                              <h4 className="text-xs font-bold text-stone-900 leading-snug">
                                {cartItem.item.name}
                              </h4>
                            </div>
                            <p className="text-[11px] font-semibold text-amber-900 mt-0.5">
                              ₹{cartItem.item.price} each ·{' '}
                              <span className="text-stone-500">
                                ₹{cartItem.item.price * cartItem.quantity}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                            className="p-1 px-2 text-stone-600 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                            className="p-1 px-2 text-stone-600 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Custom instruction note */}
                      <input
                        type="text"
                        placeholder="Note: e.g. Less sugar / Extra spicy chutney..."
                        value={itemInstructions[cartItem.item.id] ?? (cartItem.instructions || '')}
                        onChange={e =>
                          setItemInstructions(prev => ({
                            ...prev,
                            [cartItem.item.id]: e.target.value
                          }))
                        }
                        className="w-full text-[11px] bg-white border border-stone-200 rounded-md px-2.5 py-1 text-stone-700 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Delivery Location Section */}
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-800" />
                      <span>Deliver To</span>
                    </span>
                    <button
                      onClick={() => setIsLocationModalOpen(true)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 underline decoration-amber-300"
                    >
                      Change Spot
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-100 text-xs">
                    <p className="font-bold text-stone-900">
                      {selectedLocation.label || selectedLocation.room}
                    </p>
                    <p className="text-stone-600 mt-0.5">
                      {selectedLocation.building} · {selectedLocation.floor} · {selectedLocation.room}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Landmark: {selectedLocation.landmark}
                    </p>
                  </div>
                </div>

                {/* Break Time Slot Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Delivery Timing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BREAK_SLOTS.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setScheduledSlot(slot.label)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          scheduledSlot === slot.label
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-2xs'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600 text-xs'
                        }`}
                      >
                        <p className="text-xs leading-snug font-semibold">{slot.label}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">{slot.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special Note for Chettan
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call when outside door, or teacher is teaching..."
                    value={specialOrderNote}
                    onChange={e => setSpecialOrderNote(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                {/* Payment Option */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'upi'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-700" />
                      <span className="text-xs">UPI / GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'cod'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span className="text-xs">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'wallet'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-amber-700" />
                      <span className="text-xs">Campus Wallet</span>
                      <span className="text-[9px] text-stone-500">₹{studentProfile.walletBalance}</span>
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{cartSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-1">
                      <span>Chettan Campus Delivery</span>
                      {deliveryFee === 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-sm">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-[10px] text-amber-800 bg-amber-100/60 p-1.5 rounded-md">
                      Tip: Add ₹{canteenConfig.freeDeliveryThreshold - cartSubtotal} more for Free Campus Delivery!
                    </p>
                  )}

                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
                    <span>Total Amount</span>
                    <span className="text-amber-900 text-base">₹{grandTotal}</span>
                  </div>
                </div>

                {isBelowMin && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Minimum canteen order is ₹{canteenConfig.minOrderAmount}. Please add more snacks.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200">
                <button
                  onClick={handleCheckout}
                  disabled={canteenConfig.pauseOrders || isBelowMin}
                  className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-between"
                >
                  <div className="text-left">
                    <span className="block text-[11px] font-normal text-amber-200">
                      Total: ₹{grandTotal} · {paymentMethod.toUpperCase()}
                    </span>
                    <span>Confirm Order & Get Delivery PIN</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-200" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campus Location Selection Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* Simulated UPI Payment Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-stone-900">
              Pay ₹{grandTotal} via UPI
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Scan with Google Pay, PhonePe, or Paytm
            </p>

            {/* Simulated QR Code graphic */}
            <div className="my-4 p-4 bg-stone-50 rounded-xl border border-stone-200 inline-block">
              <div className="w-40 h-40 bg-white p-2 rounded-lg border flex flex-col items-center justify-center relative">
                <div className="grid grid-cols-6 gap-1 w-32 h-32 opacity-80">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 && i % 3 === 0) || i < 8 || i > 28
                          ? 'bg-stone-900'
                          : 'bg-amber-700/60'
                      }`}
                    />
                  ))}
                </div>
                <span className="absolute text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  ChettanKadi UPI
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-500 mt-2">
                UPI ID: chettankadi@canteen
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => finalizeOrder('upi')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Successful UPI Payment</span>
              </button>

              <button
                onClick={() => setShowUpiModal(false)}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Cancel / Choose Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
