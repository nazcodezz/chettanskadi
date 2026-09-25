import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Receipt,
  Star,
  MapPin,
  Bike,
  X,
  Coffee,
  AlertCircle
} from 'lucide-react';

interface OrdersTabProps {
  onOpenTracking: (orderId: string) => void;
  onOpenCart: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ onOpenTracking, onOpenCart }) => {
  const { orders, reorderItems } = useApp();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const pastOrders = orders.filter(
    o => o.status === 'delivered' || o.status === 'cancelled'
  );

  return (
    <div className="space-y-6 pb-24 sm:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display">
          My Campus Orders
        </h1>
        <p className="text-xs text-stone-500">
          Track active chai runs and view your previous tea & snacks history
        </p>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wide">
              Active Deliveries in Progress ({activeOrders.length})
            </h2>
          </div>

          <div className="space-y-3">
            {activeOrders.map(order => (
              <div
                key={order.id}
                className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-stone-900">
                      {order.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-100 text-amber-900">
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs text-stone-500">{order.scheduledTime}</span>
                  </div>

                  <p className="text-xs font-semibold text-stone-800">
                    {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      {order.deliveryLocation.building} · {order.deliveryLocation.room}
                    </span>
                  </div>

                  {/* Delivery PIN Highlight */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                    <span className="text-stone-600">Verification PIN:</span>
                    <span className="font-mono font-black text-amber-950 text-sm tracking-wider">
                      {order.deliveryPin}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <button
                    onClick={() => onOpenTracking(order.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Live Tracking</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Orders History */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wide">
          Past Orders ({pastOrders.length})
        </h2>

        {pastOrders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
            No completed orders yet. Order a hot cup of tea to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map(order => {
              const isDelivered = order.status === 'delivered';
              return (
                <div
                  key={order.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-200 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {order.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-stone-900">
                      Total: ₹{order.totalAmount} ({order.paymentMethod.toUpperCase()})
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-stone-700 font-medium">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Delivered to {order.deliveryLocation.building} ({order.deliveryLocation.room})
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5 text-stone-500" />
                        <span>Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          reorderItems(order);
                          onOpenCart();
                        }}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>

                      {isDelivered && (
                        <button
                          onClick={() => onOpenTracking(order.id)}
                          className="px-3 py-1.5 text-amber-800 hover:underline text-xs font-semibold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          <span>{order.rating ? `${order.rating}★` : 'Rate'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable / Viewable Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-stone-900 relative">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-stone-300">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base font-display text-amber-950">
                ChettanKadi Campus Canteen
              </h3>
              <p className="text-[11px] text-stone-500">College Chaya Kadi Order Receipt</p>
              <p className="text-xs font-mono font-bold text-stone-800 mt-1">
                Order {selectedReceiptOrder.id}
              </p>
              <p className="text-[10px] text-stone-400">
                {new Date(selectedReceiptOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Details */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Student:</span>
                <span className="font-bold text-stone-900">
                  {selectedReceiptOrder.student.name} ({selectedReceiptOrder.student.department})
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Spot:</span>
                <span className="font-bold text-stone-900">
                  {selectedReceiptOrder.deliveryLocation.building} · {selectedReceiptOrder.deliveryLocation.room}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Runner:</span>
                <span className="font-bold text-stone-900">Chettan Kumaran</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Verified PIN:</span>
                <span className="font-mono font-bold text-amber-900">
                  {selectedReceiptOrder.deliveryPin}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-2 text-xs">
              {selectedReceiptOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {it.quantity}× {it.name}
                  </span>
                  <span className="font-semibold">₹{it.price * it.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between text-stone-500 pt-1">
                <span>Campus Delivery Fee</span>
                <span>
                  {selectedReceiptOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedReceiptOrder.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Paid</span>
                <span className="text-amber-900">₹{selectedReceiptOrder.totalAmount}</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-stone-500">
                Payment via {selectedReceiptOrder.paymentMethod.toUpperCase()} · Status: {selectedReceiptOrder.paymentStatus.toUpperCase()}
              </p>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="mt-3 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
