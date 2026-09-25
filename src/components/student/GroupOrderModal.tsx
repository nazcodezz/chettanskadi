import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Check, Copy, Share2, Sparkles, X, Coffee } from 'lucide-react';
import { FoodItem } from '../../types';

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupMemberItem {
  id: string;
  studentName: string;
  items: { item: FoodItem; quantity: number }[];
}

export const GroupOrderModal: React.FC<GroupOrderModalProps> = ({ isOpen, onClose }) => {
  const { menuItems, addToCart, addToast } = useApp();
  const [groupCode] = useState('CHAYA-CS304');
  const [copied, setCopied] = useState(false);

  // Group members simulation
  const [members, setMembers] = useState<GroupMemberItem[]>([
    {
      id: 'm-1',
      studentName: 'Rahul (Host)',
      items: [
        { item: menuItems[0], quantity: 2 }, // Chai
        { item: menuItems[4], quantity: 1 }  // Samosa
      ]
    },
    {
      id: 'm-2',
      studentName: 'Sneha K.',
      items: [
        { item: menuItems[6], quantity: 1 }, // Egg puff
        { item: menuItems[10], quantity: 1 } // Lime soda
      ]
    }
  ]);

  // Form to add a classmate's order
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(menuItems[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`Join our campus chai order on ChettanKadi! Code: ${groupCode}`);
    setCopied(true);
    addToast('Link Copied', 'Group order invite code copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddMemberItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const chosenItem = menuItems.find(m => m.id === selectedItemId);
    if (!chosenItem) return;

    const existingMember = members.find(
      m => m.studentName.toLowerCase() === newStudentName.trim().toLowerCase()
    );

    if (existingMember) {
      setMembers(prev =>
        prev.map(m => {
          if (m.id === existingMember.id) {
            const hasItem = m.items.find(i => i.item.id === chosenItem.id);
            if (hasItem) {
              return {
                ...m,
                items: m.items.map(i =>
                  i.item.id === chosenItem.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                )
              };
            }
            return { ...m, items: [...m.items, { item: chosenItem, quantity }] };
          }
          return m;
        })
      );
    } else {
      setMembers(prev => [
        ...prev,
        {
          id: 'm-' + Date.now(),
          studentName: newStudentName.trim(),
          items: [{ item: chosenItem, quantity }]
        }
      ]);
    }

    setNewStudentName('');
    setQuantity(1);
    addToast('Added to Group', `Added snacks for ${newStudentName.trim()}`, 'success');
  };

  const handleMergeToCart = () => {
    members.forEach(member => {
      member.items.forEach(ci => {
        for (let i = 0; i < ci.quantity; i++) {
          addToCart(ci.item, `For ${member.studentName}`);
        }
      });
    });
    addToast(
      'Group Cart Merged! ☕',
      `Combined ${members.length} classmates' snacks into your delivery tray`,
      'success'
    );
    onClose();
  };

  const groupTotal = members.reduce((sum, member) => {
    return (
      sum +
      member.items.reduce((mSum, i) => mSum + i.item.price * i.quantity, 0)
    );
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-700 to-amber-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Classroom Group Chai</h3>
                <span className="text-[10px] font-bold bg-amber-400/30 text-amber-100 px-2 py-0.5 rounded-md">
                  1 Single Delivery
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5">
                Combine orders with benchmates, split delivery & bills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Bar */}
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-600">Group Code:</span>
            <span className="font-mono font-extrabold text-amber-900 tracking-wider text-sm bg-white px-2 py-0.5 rounded-md border border-amber-300">
              {groupCode}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 font-semibold text-amber-800 hover:text-amber-950 px-2.5 py-1 bg-amber-200/70 hover:bg-amber-200 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share Code'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Member items breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Classmates in this order ({members.length})
              </span>
              <span className="text-xs font-semibold text-amber-800">
                Total: ₹{groupTotal}
              </span>
            </div>

            <div className="space-y-2.5">
              {members.map(member => {
                const memberTotal = member.items.reduce(
                  (sum, i) => sum + i.item.price * i.quantity,
                  0
                );
                return (
                  <div
                    key={member.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/90 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900 pb-1.5 border-b border-stone-200">
                      <span>{member.studentName}</span>
                      <span className="text-amber-800 font-extrabold">₹{memberTotal}</span>
                    </div>
                    <div className="pt-2 space-y-1">
                      {member.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-stone-600">
                          <span>
                            {i.quantity}× {i.item.name}
                          </span>
                          <span>₹{i.item.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add a classmate's items form */}
          <form
            onSubmit={handleAddMemberItem}
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <Plus className="w-4 h-4 text-amber-700" />
              <span>Add Classmate&apos;s Order</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Classmate Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun, Sneha"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Select Snack / Drink
                </label>
                <select
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white"
                >
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ₹{item.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-600 font-medium">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-stone-700 hover:bg-stone-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-bold text-stone-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-stone-700 hover:bg-stone-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Group</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-stone-500">Group total to deliver</p>
            <p className="text-base font-extrabold text-stone-900">₹{groupTotal}</p>
          </div>

          <button
            onClick={handleMergeToCart}
            className="flex-1 max-w-xs py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Load Group Tray into Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
