import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { NorthBlockFloorMap } from '../map/NorthBlockFloorMap';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  MapPin,
  Phone,
  KeyRound,
  Sparkles,
  Star,
  ChevronRight,
  Coffee,
  AlertCircle,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrackingModalProps {
  order: Order | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'placed', label: 'Order Placed', icon: Clock },
  { status: 'accepted', label: 'Accepted by Canteen', icon: Store },
  { status: 'preparing', label: 'Chai & Snacks Brewing', icon: Coffee },
  { status: 'ready_for_pickup', label: 'Packed & Ready', icon: Store },
  { status: 'chettan_assigned', label: 'Chettan Assigned', icon: Bike },
  { status: 'out_for_delivery', label: 'Chettan on Campus', icon: Bike },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { rateOrder, addToast, updateOrderStatus } = useApp();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(true);

  if (!isOpen || !order) return null;

  const currentStepIndex = ORDER_STEPS.findIndex(s => s.status === order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateOrder(order.id, rating, review);
    setHasSubmittedReview(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch {
      // safe ignore
    }
  };

  const handleCallChettan = () => {
    addToast(
      'Calling Chettan',
      `Dialing Chettan Kumaran (+91 94470 56789)... "Vannondirikunnu makkale!"`,
      'info'
    );
  };

  // Quick simulation helper for presentation / testing: allows advancing status
  const advanceStatusForDemo = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < ORDER_STEPS.length) {
      const nextStatus = ORDER_STEPS[nextIdx].status;
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCancelled
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                  Track Order {order.id}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isDelivered
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCancelled
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Scheduled for {order.scheduledTime} · {order.items.length} snacks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* CRITICAL: Delivery Verification PIN Banner */}
          {!isDelivered && !isCancelled && (
            <div className="p-4 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white rounded-2xl shadow-md border border-amber-600/40 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-200 text-xs font-semibold uppercase tracking-wider">
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>Delivery Verification PIN</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-amber-100">
                      {order.deliveryPin}
                    </span>
                    <span className="text-[11px] text-amber-200/80">
                      (Tell Chettan on arrival)
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 mt-1 max-w-xs leading-snug">
                    Share this 4-digit code with Chettan at your classroom to verify and receive your tray.
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Coffee className="w-6 h-6 text-amber-200" />
                </div>
              </div>

              {/* Chettan Runner Contact info card */}
              <div className="mt-3.5 pt-3 border-t border-amber-600/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/40 text-amber-100 flex items-center justify-center font-bold text-xs">
                    CK
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">Chettan Kumaran</p>
                    <p className="text-[10px] text-amber-200/80">Campus Delivery Runner</p>
                  </div>
                </div>

                <button
                  onClick={handleCallChettan}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-amber-900 rounded-lg text-xs font-bold shadow-xs hover:bg-amber-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Chettan</span>
                </button>
              </div>
            </div>
          )}

          {/* Delivery Location Indicator */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">
                Delivery Location: {order.deliveryLocation.building} · {order.deliveryLocation.room}
              </p>
              <p className="text-stone-600 mt-0.5">
                {order.deliveryLocation.department} ({order.deliveryLocation.floor})
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Landmark: {order.deliveryLocation.landmark}
              </p>
              {order.specialNote && (
                <p className="text-[11px] font-medium text-amber-900 bg-amber-100/60 p-1 rounded mt-1">
                  Note: &ldquo;{order.specialNote}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* College Floor Plan Blueprint & Chettan Walking Route */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => setShowFloorPlan(!showFloorPlan)}
              className="w-full p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors flex items-center justify-between text-xs font-bold text-stone-800"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Live North Block Floor Route</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {order.deliveryLocation.roomCode || 'Room View'}
                </span>
              </div>
              {showFloorPlan ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {showFloorPlan && (
              <div className="p-3 border-t border-stone-200 space-y-2">
                <p className="text-[11px] text-stone-500">
                  Chettan enters via South Corridor (from Main Block) and walks up the central atrium to your door:
                </p>
                <NorthBlockFloorMap
                  selectedRoomCode={order.deliveryLocation.roomCode}
                  highlightedOrder={order}
                  showChettanRoute={!isDelivered && !isCancelled}
                  mode="tracker"
                />
              </div>
            )}
          </div>

          {/* 7-Stage Progress Tracker */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Live Campus Progress
              </span>
              {!isDelivered && !isCancelled && (
                <button
                  onClick={advanceStatusForDemo}
                  className="text-[10px] font-semibold text-amber-700 hover:text-amber-950 underline"
                  title="Simulate next status step"
                >
                  Advance Step (Demo)
                </button>
              )}
            </div>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                const stepTimeline = order.statusTimeline.find(t => t.status === step.status);

                return (
                  <div key={step.status} className="relative flex items-start justify-between text-xs">
                    {/* Circle icon */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-stone-300 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? 'text-amber-900 font-bold'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {stepTimeline?.note && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {stepTimeline.note}
                        </p>
                      )}
                    </div>

                    {stepTimeline?.timestamp && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {stepTimeline.timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Snacks Summary */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-700 block mb-1">
              Snacks in this Order:
            </span>
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-stone-600">
                <span>
                  {it.quantity}× {it.name}
                  {it.instructions ? ` (${it.instructions})` : ''}
                </span>
                <span className="font-semibold text-stone-900">
                  ₹{it.price * it.quantity}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
              <span>Total Bill ({order.paymentMethod.toUpperCase()})</span>
              <span className="text-amber-900">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Delivered: Rating and Feedback */}
          {isDelivered && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Delivered Successfully!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Chettan verified PIN {order.deliveryPin} and delivered your snacks piping hot. Enjoy!
              </p>

              {hasSubmittedReview || order.rating ? (
                <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (order.rating || rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-stone-700 italic">
                    &ldquo;{order.review || review || 'Piping hot tea and crispy snacks!'}&rdquo;
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-stone-700">
                    How was Chettan&apos;s delivery & the snacks?
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-stone-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Write a quick review for Chettan..."
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Submit Rating
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
