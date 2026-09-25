import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { NorthBlockFloorMap } from '../map/NorthBlockFloorMap';
import { MapRoom, NORTH_BLOCK_ROOMS } from '../../data/northBlockMapData';
import {
  Bike,
  Store,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  KeyRound,
  AlertTriangle,
  Building2,
  Coffee,
  Check,
  X,
  Layers,
  Banknote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Pause,
  Play,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChettanView: React.FC = () => {
  const {
    orders,
    chettanProfile,
    toggleChettanOnline,
    toggleChettanBreak,
    updateOrderStatus,
    verifyDeliveryPin,
    reportDeliveryIssue,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'active' | 'history' | 'profile'>('dashboard');
  const [selectedMapRoom, setSelectedMapRoom] = useState<MapRoom | null>(null);

  // PIN Verification Modal State
  const [pinModalOrder, setPinModalOrder] = useState<Order | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Issue Reporting Modal State
  const [issueModalOrder, setIssueModalOrder] = useState<Order | null>(null);
  const [selectedIssueReason, setSelectedIssueReason] = useState('Classroom door locked');
  const [customIssueText, setCustomIssueText] = useState('');

  // Orders filtering
  const readyForPickupOrders = orders.filter(o => o.status === 'ready_for_pickup');
  const activeCarryOrders = orders.filter(
    o => o.status === 'chettan_assigned' || o.status === 'out_for_delivery'
  );
  const pendingAcceptanceOrders = orders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  // Cash on delivery collected
  const totalCashCollected = completedOrders
    .filter(o => o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Smart Batching: Group active carry & ready orders by campus Building!
  const buildingGroups = [...readyForPickupOrders, ...activeCarryOrders].reduce((acc, order) => {
    const buildingKey = order.deliveryLocation.building || 'Campus Central';
    if (!acc[buildingKey]) acc[buildingKey] = [];
    acc[buildingKey].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  // Handlers for PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinModalOrder) return;

    const isSuccess = verifyDeliveryPin(pinModalOrder.id, enteredPin);
    if (isSuccess) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // safe ignore
      }
      setPinModalOrder(null);
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalOrder) return;
    const finalReason = customIssueText.trim() || selectedIssueReason;
    reportDeliveryIssue(issueModalOrder.id, finalReason);
    setIssueModalOrder(null);
    setCustomIssueText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-20">
      {/* Chettan Status Header Card */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/30 text-amber-200 border border-amber-400/30 flex items-center justify-center font-bold text-2xl shrink-0">
              <Bike className="w-8 h-8 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                  {chettanProfile.name}
                </h1>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    chettanProfile.isOnline && !chettanProfile.onBreak
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {chettanProfile.onBreak
                    ? 'On Chai Break'
                    : chettanProfile.isOnline
                    ? 'Online & Delivering'
                    : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Campus Delivery Runner · {chettanProfile.phone} · ⭐ {chettanProfile.rating} Rating
              </p>
            </div>
          </div>

          {/* Quick Chettan Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleChettanBreak(15)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                chettanProfile.onBreak
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {chettanProfile.onBreak ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Duty</span>
                </>
              ) : (
                <>
                  <Coffee className="w-3.5 h-3.5" />
                  <span>15m Chai Break</span>
                </>
              )}
            </button>

            <button
              onClick={toggleChettanOnline}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                chettanProfile.isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
              }`}
            >
              {chettanProfile.isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-amber-800/40 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-amber-300/80 block text-[11px]">Ready for Pickup</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              {readyForPickupOrders.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-amber-300/80 block text-[11px]">In Delivery Bag</span>
            <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">
              {activeCarryOrders.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-amber-300/80 block text-[11px]">Delivered Today</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">
              {completedOrders.length + chettanProfile.deliveriesToday}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-amber-300/80 block text-[11px]">Cash in Hand (COD)</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              ₹{totalCashCollected}
            </span>
          </div>
        </div>
      </div>

      {/* Chettan Tab Bar */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Campus Trips & Batching</span>
          {readyForPickupOrders.length + activeCarryOrders.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px]">
              {readyForPickupOrders.length + activeCarryOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'map'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-700" />
          <span>Floor Blueprint Navigator</span>
          {activeCarryOrders.length + readyForPickupOrders.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px]">
              {activeCarryOrders.length + readyForPickupOrders.length} Pins
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Active In Bag ({activeCarryOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-amber-800 text-amber-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Delivered History ({completedOrders.length})</span>
        </button>
      </div>

      {/* SMART BATCHING VIEW (Dashboard) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Smart Batching Recommendation */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 flex items-start gap-3 text-xs">
            <Building2 className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Smart Walking Batching: Grouped by Campus Building
              </p>
              <p className="text-amber-800 mt-0.5">
                Collect all flasks and snack boxes from canteen counter before heading out to each block. Deliver all classrooms in the same building on a single walk!
              </p>
            </div>
          </div>

          {/* Grouped by Building */}
          {Object.keys(buildingGroups).length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
              <h3 className="text-base font-bold text-stone-900">All caught up!</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                No orders waiting at canteen counter right now. You can sit and enjoy a Kadum Chaya.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(buildingGroups).map(([buildingName, bOrders]) => (
                <div
                  key={buildingName}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
                >
                  {/* Building Header */}
                  <div className="bg-stone-50 p-4 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">
                          {buildingName}
                        </h3>
                        <p className="text-[11px] text-stone-500">
                          {bOrders.length} delivery point{bOrders.length !== 1 ? 's' : ''} in this block
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                      Batch Trip
                    </span>
                  </div>

                  {/* Orders within this building */}
                  <div className="divide-y divide-stone-100">
                    {bOrders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-stone-900">
                              {order.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                order.status === 'out_for_delivery'
                                  ? 'bg-amber-500 text-white'
                                  : order.status === 'chettan_assigned'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-semibold text-stone-800">
                              {order.student.name}
                            </span>
                            <span className="text-xs text-stone-400">·</span>
                            <span className="text-xs text-stone-500">
                              📞 {order.student.phone}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-xs text-stone-700">
                            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="font-bold text-stone-900">
                              Floor {order.deliveryLocation.floor} · {order.deliveryLocation.room}
                            </span>
                            <span className="text-stone-400">({order.deliveryLocation.landmark})</span>
                          </div>

                          {/* Items summary */}
                          <p className="text-xs text-stone-600 font-medium">
                            Items: {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                          </p>

                          {order.specialNote && (
                            <p className="text-[11px] text-amber-900 font-semibold bg-amber-50 p-1 rounded inline-block">
                              Student note: &ldquo;{order.specialNote}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                          <div className="text-right sm:pr-2">
                            <p className="text-sm font-extrabold text-stone-900">
                              ₹{order.totalAmount}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                order.paymentMethod === 'cod'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {order.paymentMethod === 'cod' ? 'COLLECT CASH' : 'PAID ONLINE'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Pick up from canteen counter */}
                            {order.status === 'ready_for_pickup' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    'chettan_assigned',
                                    'Chettan picked up tray from canteen counter'
                                  )
                                }
                                className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                              >
                                <Store className="w-3.5 h-3.5" />
                                <span>Pick Up from Counter</span>
                              </button>
                            )}

                            {/* Start Walking / Out for delivery */}
                            {order.status === 'chettan_assigned' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    'out_for_delivery',
                                    `Chettan is walking towards ${order.deliveryLocation.building}`
                                  )
                                }
                                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                              >
                                <Bike className="w-3.5 h-3.5" />
                                <span>Start Walking</span>
                              </button>
                            )}

                            {/* Verify Delivery PIN */}
                            {order.status === 'out_for_delivery' && (
                              <button
                                onClick={() => {
                                  setPinModalOrder(order);
                                  setEnteredPin('');
                                  setPinError(false);
                                }}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>Enter PIN & Deliver</span>
                              </button>
                            )}

                            {/* Issue Reporter */}
                            <button
                              onClick={() => {
                                setIssueModalOrder(order);
                                setCustomIssueText('');
                              }}
                              className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors border border-stone-200"
                              title="Report Issue"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOOR MAP BLUEPRINT NAVIGATOR TAB */}
      {activeTab === 'map' && (
        <div className="space-y-5">
          <div className="p-4 bg-gradient-to-r from-amber-900 to-stone-900 text-white rounded-2xl border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-200 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">
                  North Block 1st Floor Delivery Map
                </p>
                <p className="text-amber-200/80 mt-0.5">
                  Enter from Main Block corridor (bottom right) ➔ Follow central atrium walkways to target classroom
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-200 font-bold border border-amber-400/30">
                {activeCarryOrders.length + readyForPickupOrders.length} Active Run Pins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 2 Cols: Floor Map */}
            <div className="lg:col-span-2">
              <NorthBlockFloorMap
                selectedRoomCode={selectedMapRoom?.code || activeCarryOrders[0]?.deliveryLocation.roomCode}
                onSelectRoom={(r) => setSelectedMapRoom(r)}
                activeOrders={[...readyForPickupOrders, ...activeCarryOrders]}
                highlightedOrder={activeCarryOrders[0] || readyForPickupOrders[0]}
                showChettanRoute={true}
                mode="chettan_navigator"
              />
            </div>

            {/* 1 Col: Orders in Selected / Active Room */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-stone-900">
                      Room Delivery Details
                    </h3>
                  </div>
                  {selectedMapRoom && (
                    <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {selectedMapRoom.code}
                    </span>
                  )}
                </div>

                {selectedMapRoom ? (
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-stone-900 text-sm">
                      {selectedMapRoom.name}
                    </p>
                    <p className="text-stone-500">
                      {selectedMapRoom.department} · {selectedMapRoom.wing.toUpperCase()} Wing
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Dimensions: {selectedMapRoom.dimensions} ({selectedMapRoom.area})
                    </p>

                    {/* Check if any order is destined for this room */}
                    {(() => {
                      const roomOrders = [...readyForPickupOrders, ...activeCarryOrders].filter(
                        o =>
                          o.deliveryLocation.roomCode === selectedMapRoom.code ||
                          (o.deliveryLocation.room &&
                            o.deliveryLocation.room.includes(selectedMapRoom.code))
                      );

                      if (roomOrders.length === 0) {
                        return (
                          <div className="p-3 bg-stone-50 rounded-xl text-stone-500 text-center mt-3">
                            No deliveries currently active for this classroom.
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3 pt-2">
                          <p className="font-bold text-amber-950 uppercase tracking-wide text-[11px]">
                            {roomOrders.length} Order{roomOrders.length > 1 ? 's' : ''} here:
                          </p>

                          {roomOrders.map(ro => (
                            <div
                              key={ro.id}
                              className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2"
                            >
                              <div className="flex justify-between font-bold">
                                <span>{ro.id} - {ro.student.name}</span>
                                <span className="text-amber-900">₹{ro.totalAmount}</span>
                              </div>
                              <p className="text-stone-600">
                                {ro.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                              </p>

                              <div className="flex items-center gap-2 pt-1">
                                {ro.status === 'out_for_delivery' && (
                                  <button
                                    onClick={() => {
                                      setPinModalOrder(ro);
                                      setEnteredPin('');
                                      setPinError(false);
                                    }}
                                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Enter Student PIN</span>
                                  </button>
                                )}

                                {ro.status === 'chettan_assigned' && (
                                  <button
                                    onClick={() =>
                                      updateOrderStatus(
                                        ro.id,
                                        'out_for_delivery',
                                        `Chettan walking towards ${selectedMapRoom.code}`
                                      )
                                    }
                                    className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Bike className="w-3.5 h-3.5" />
                                    <span>Start Walking to {selectedMapRoom.code}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-6 text-center text-stone-400 text-xs">
                    <Compass className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>Click on any room on the floor blueprint to see walking route & student orders</span>
                  </div>
                )}
              </div>

              {/* Active Bags Quick List */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2 text-xs">
                <p className="font-bold text-stone-800 uppercase tracking-wide">
                  Active In Bag ({activeCarryOrders.length})
                </p>
                {activeCarryOrders.length === 0 ? (
                  <p className="text-stone-400">Bag is empty</p>
                ) : (
                  <div className="space-y-1.5">
                    {activeCarryOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          const matchRoom = NORTH_BLOCK_ROOMS.find(r => r.code === o.deliveryLocation.roomCode);
                          if (matchRoom) setSelectedMapRoom(matchRoom);
                        }}
                        className="p-2 bg-white rounded-lg border border-stone-200 hover:border-amber-400 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <span className="font-bold">{o.id} ({o.deliveryLocation.roomCode || o.deliveryLocation.room})</span>
                        <span className="text-[10px] text-amber-800 font-semibold underline">View on Map</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE IN BAG TAB */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Orders Currently with Chettan ({activeCarryOrders.length})
            </h2>
          </div>

          {activeCarryOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
              No orders in your delivery bag. Pick up ready orders from the canteen counter.
            </div>
          ) : (
            <div className="space-y-3">
              {activeCarryOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{order.id}</span>
                      <span className="text-xs font-semibold text-stone-700">
                        {order.student.name}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-amber-800 font-bold">
                        {order.deliveryLocation.building} ({order.deliveryLocation.room})
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">
                      {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPinModalOrder(order);
                        setEnteredPin('');
                        setPinError(false);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify Student PIN</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DELIVERED HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Completed Deliveries Today ({completedOrders.length})
            </h2>
            <span className="text-xs font-bold text-amber-900">
              COD Cash: ₹{totalCashCollected}
            </span>
          </div>

          <div className="space-y-3">
            {completedOrders.map(order => (
              <div
                key={order.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-stone-900">{order.id}</span>
                    <span className="text-stone-600">{order.student.name}</span>
                  </div>
                  <span className="font-extrabold text-stone-900">
                    ₹{order.totalAmount} ({order.paymentMethod.toUpperCase()})
                  </span>
                </div>

                <p className="text-stone-500">
                  Delivered to {order.deliveryLocation.building} · {order.deliveryLocation.room}
                </p>

                <p className="text-[11px] text-emerald-800 font-mono">
                  Verified with PIN: {order.deliveryPin}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIN VERIFICATION MODAL */}
      {pinModalOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-stone-900 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-stone-900">
              Enter Student&apos;s Delivery PIN
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Ask {pinModalOrder.student.name} at {pinModalOrder.deliveryLocation.room} for their 4-digit secret code.
            </p>

            {/* In demo mode hint */}
            <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
              Demo Hint: Student PIN is <span className="font-mono font-bold text-amber-950">{pinModalOrder.deliveryPin}</span>
            </div>

            <form onSubmit={handlePinSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                maxLength={4}
                required
                autoFocus
                placeholder="4-digit PIN"
                value={enteredPin}
                onChange={e => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center font-mono text-2xl font-black tracking-widest p-2.5 rounded-xl border bg-stone-50 focus:outline-hidden ${
                  pinError
                    ? 'border-rose-500 ring-2 ring-rose-200 text-rose-700'
                    : 'border-stone-300 focus:ring-2 focus:ring-amber-600'
                }`}
              />

              {pinError && (
                <p className="text-xs font-semibold text-rose-600">
                  Incorrect PIN! Please ask the student to check their app screen.
                </p>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={enteredPin.length < 4}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify PIN & Confirm Handover</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPinModalOrder(null)}
                  className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE REPORTING MODAL */}
      {issueModalOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-stone-900">
            <div className="flex items-center gap-2 mb-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base">Report Delivery Issue</h3>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Order {issueModalOrder.id} for {issueModalOrder.student.name} ({issueModalOrder.deliveryLocation.room})
            </p>

            <form onSubmit={handleReportIssue} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Common Reasons
                </label>
                <select
                  value={selectedIssueReason}
                  onChange={e => setSelectedIssueReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option>Classroom door locked</option>
                  <option>Student not present / phone unreachable</option>
                  <option>Professor is teaching / delivery delayed</option>
                  <option>Tea spilled / replacement flask needed</option>
                  <option>Student requested to leave at security desk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Additional Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Waiting outside near water dispenser..."
                  value={customIssueText}
                  onChange={e => setCustomIssueText(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOrder(null)}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Submit Issue Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
