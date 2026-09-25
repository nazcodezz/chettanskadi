import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  StudentProfile,
  CampusLocation,
  CanteenConfig,
  ChettanProfile
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_ORDERS,
  INITIAL_CANTEEN_CONFIG,
  INITIAL_CHETTAN_PROFILE
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  deviceView: 'responsive' | 'mobile_frame';
  setDeviceView: (mode: 'responsive' | 'mobile_frame') => void;
  
  // Menu
  menuItems: FoodItem[];
  addMenuItem: (item: Omit<FoodItem, 'id'>) => void;
  updateMenuItem: (item: FoodItem) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleItemStock: (itemId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: FoodItem, instructions?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  activeOrder: Order | undefined;
  setActiveOrderId: (id: string | null) => void;
  placeOrder: (options: {
    location: CampusLocation;
    paymentMethod: 'cod' | 'upi' | 'wallet';
    scheduledTime: string;
    specialNote?: string;
    isGroupOrder?: boolean;
    groupMembers?: string[];
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  verifyDeliveryPin: (orderId: string, enteredPin: string) => boolean;
  reportDeliveryIssue: (orderId: string, issue: string) => void;
  rateOrder: (orderId: string, rating: number, review: string) => void;
  reorderItems: (order: Order) => void;

  // Profiles & Config
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  addSavedLocation: (loc: CampusLocation) => void;
  removeSavedLocation: (labelOrId: string) => void;

  canteenConfig: CanteenConfig;
  updateCanteenConfig: (config: Partial<CanteenConfig>) => void;

  chettanProfile: ChettanProfile;
  toggleChettanOnline: () => void;
  toggleChettanBreak: (durationMins?: number) => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Sound chime
  playChime: (type?: 'order' | 'delivered' | 'alert') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio sound synthesizer for crisp, zero-asset notifications
const playSynthAudio = (type: 'order' | 'delivered' | 'alert' = 'order') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'order') {
      // Pleasant campus bell double ding
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'delivered') {
      // Happy arrival chords
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // AudioContext might be restricted until user gesture; safe ignore
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ck_role') as UserRole) || 'student';
  });

  const [deviceView, setDeviceView] = useState<'responsive' | 'mobile_frame'>('responsive');

  const [menuItems, setMenuItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('ck_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ck_orders_v2');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return INITIAL_ORDERS[0]?.id || null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ck_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ck_student_profile_v2');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [canteenConfig, setCanteenConfig] = useState<CanteenConfig>(() => {
    const saved = localStorage.getItem('ck_canteen_config');
    return saved ? JSON.parse(saved) : INITIAL_CANTEEN_CONFIG;
  });

  const [chettanProfile, setChettanProfile] = useState<ChettanProfile>(() => {
    const saved = localStorage.getItem('ck_chettan_profile');
    return saved ? JSON.parse(saved) : INITIAL_CHETTAN_PROFILE;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent storage sync
  useEffect(() => {
    localStorage.setItem('ck_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ck_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('ck_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ck_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ck_student_profile_v2', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('ck_canteen_config', JSON.stringify(canteenConfig));
  }, [canteenConfig]);

  useEffect(() => {
    localStorage.setItem('ck_chettan_profile', JSON.stringify(chettanProfile));
  }, [chettanProfile]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      type
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const playChime = (type: 'order' | 'delivered' | 'alert' = 'order') => {
    playSynthAudio(type);
  };

  // Cart operations
  const addToCart = (item: FoodItem, instructions?: string) => {
    if (!item.inStock) {
      addToast('Item Sold Out', `${item.name} is currently out of stock at canteen.`, 'warning');
      return;
    }
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1, instructions: instructions || ci.instructions }
            : ci
        );
      }
      return [...prev, { item, quantity: 1, instructions }];
    });
    addToast('Added to Cart', `${item.name} added to your tray`, 'success');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  // Menu operations
  const addMenuItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: 'item-' + Date.now().toString(36)
    };
    setMenuItems(prev => [newItem, ...prev]);
    addToast('Menu Updated', `Added "${newItem.name}" to canteen catalog`, 'success');
  };

  const updateMenuItem = (item: FoodItem) => {
    setMenuItems(prev => prev.map(m => (m.id === item.id ? item : m)));
    addToast('Item Updated', `Updated details for ${item.name}`, 'info');
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    addToast('Item Removed', 'Snack item deleted from menu', 'warning');
  };

  const toggleItemStock = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(m => {
        if (m.id === itemId) {
          const nextState = !m.inStock;
          addToast(
            nextState ? 'Back in Stock' : 'Marked Sold Out',
            `${m.name} is now ${nextState ? 'available' : 'unavailable'} for ordering.`,
            nextState ? 'success' : 'warning'
          );
          return { ...m, inStock: nextState };
        }
        return m;
      })
    );
  };

  // Order Placement
  const placeOrder = (options: {
    location: CampusLocation;
    paymentMethod: 'cod' | 'upi' | 'wallet';
    scheduledTime: string;
    specialNote?: string;
    isGroupOrder?: boolean;
    groupMembers?: string[];
  }): Order => {
    const subtotal = cartSubtotal;
    const deliveryFee = subtotal >= canteenConfig.freeDeliveryThreshold ? 0 : canteenConfig.deliveryFee;
    const totalAmount = subtotal + deliveryFee;

    // Generate 4-digit numeric verification PIN
    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#CK-${orderNumber}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      student: {
        name: studentProfile.name,
        studentId: studentProfile.studentId,
        department: studentProfile.department,
        phone: studentProfile.phone
      },
      items: cart.map(ci => ({
        itemId: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        instructions: ci.instructions
      })),
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: options.paymentMethod,
      paymentStatus: options.paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      deliveryLocation: options.location,
      deliveryPin,
      scheduledTime: options.scheduledTime,
      specialNote: options.specialNote,
      isGroupOrder: options.isGroupOrder,
      groupMembers: options.groupMembers,
      chettanName: chettanProfile.name,
      statusTimeline: [
        {
          status: 'placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Order confirmed and sent to canteen counter'
        }
      ]
    };

    // If paid by wallet, deduct
    if (options.paymentMethod === 'wallet') {
      setStudentProfile(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - totalAmount)
      }));
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(orderId);
    clearCart();

    playChime('order');
    addToast(
      'Order Placed! ☕',
      `Order ${orderId} sent to canteen. PIN: ${deliveryPin}`,
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const defaultNotes: Record<OrderStatus, string> = {
            placed: 'Order placed by student',
            accepted: 'Canteen accepted the order and started batching',
            preparing: 'Chai is brewing and snacks are being heated',
            ready_for_pickup: 'Items packed in tray, ready for Chettan pickup',
            chettan_assigned: 'Chettan Kumaran collected order from canteen',
            out_for_delivery: `Chettan is walking to ${ord.deliveryLocation.building}, Floor ${ord.deliveryLocation.floor}`,
            delivered: `Successfully delivered to ${ord.student.name} at ${ord.deliveryLocation.room}`,
            cancelled: 'Order was cancelled by canteen or student'
          };

          const statusNote = note || defaultNotes[newStatus];
          const newTimelineEntry = {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: statusNote
          };

          if (newStatus === 'delivered') {
            playChime('delivered');
            setChettanProfile(cp => ({ ...cp, deliveriesToday: cp.deliveriesToday + 1 }));
          } else if (newStatus === 'ready_for_pickup') {
            playChime('order');
          }

          return {
            ...ord,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            statusTimeline: [...ord.statusTimeline, newTimelineEntry]
          };
        }
        return ord;
      })
    );

    const friendlyStatusNames: Record<OrderStatus, string> = {
      placed: 'Placed',
      accepted: 'Accepted by Canteen',
      preparing: 'Preparing in Kitchen',
      ready_for_pickup: 'Ready for Pickup',
      chettan_assigned: 'Chettan Assigned',
      out_for_delivery: 'Out for Delivery 🚴',
      delivered: 'Delivered Successfully! 🎉',
      cancelled: 'Cancelled'
    };

    addToast(
      `Order ${orderId}`,
      friendlyStatusNames[newStatus],
      newStatus === 'delivered' ? 'success' : newStatus === 'cancelled' ? 'alert' : 'info'
    );
  };

  const verifyDeliveryPin = (orderId: string, enteredPin: string): boolean => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return false;

    if (targetOrder.deliveryPin.trim() === enteredPin.trim()) {
      updateOrderStatus(
        orderId,
        'delivered',
        `PIN ${enteredPin} verified with ${targetOrder.student.name}. Delivered!`
      );
      return true;
    } else {
      playChime('alert');
      addToast('Invalid PIN', 'The 4-digit delivery PIN did not match. Please re-check with student.', 'alert');
      return false;
    }
  };

  const reportDeliveryIssue = (orderId: string, issue: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              reportedIssue: issue,
              statusTimeline: [
                ...ord.statusTimeline,
                {
                  status: ord.status,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: `Chettan reported issue: ${issue}`
                }
              ]
            }
          : ord
      )
    );
    addToast('Issue Reported', `Note recorded for ${orderId}: "${issue}"`, 'warning');
  };

  const rateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, rating, review } : ord))
    );
    addToast('Feedback Submitted', 'Thank you for rating ChettanKadi!', 'success');
  };

  const reorderItems = (order: Order) => {
    order.items.forEach(it => {
      const match = menuItems.find(m => m.id === it.itemId) || {
        id: it.itemId,
        name: it.name,
        category: 'quick_snacks' as const,
        price: it.price,
        prepTimeMinutes: 5,
        inStock: true,
        description: 'Reordered item',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        isVeg: true
      };
      addToCart(match, it.instructions);
    });
    addToast('Items Added', 'Past order items added to your cart!', 'success');
  };

  // Profile operations
  const updateStudentProfile = (partial: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({ ...prev, ...partial }));
    addToast('Profile Updated', 'Student info saved', 'info');
  };

  const addSavedLocation = (loc: CampusLocation) => {
    setStudentProfile(prev => ({
      ...prev,
      savedLocations: [
        ...prev.savedLocations,
        { ...loc, id: 'loc-' + Date.now().toString(36) }
      ]
    }));
    addToast('Location Saved', `${loc.label || loc.room} added to your shortcuts`, 'success');
  };

  const removeSavedLocation = (labelOrId: string) => {
    setStudentProfile(prev => ({
      ...prev,
      savedLocations: prev.savedLocations.filter(
        l => l.id !== labelOrId && l.label !== labelOrId
      )
    }));
  };

  // Canteen Config operations
  const updateCanteenConfig = (partial: Partial<CanteenConfig>) => {
    setCanteenConfig(prev => ({ ...prev, ...partial }));
    addToast('Settings Updated', 'Canteen operating rules modified', 'info');
  };

  // Chettan operations
  const toggleChettanOnline = () => {
    setChettanProfile(prev => {
      const next = !prev.isOnline;
      addToast(
        next ? 'Chettan Online' : 'Chettan Offline',
        next ? 'Ready for taking campus delivery runs' : 'Chettan is currently off duty',
        next ? 'success' : 'warning'
      );
      return { ...prev, isOnline: next };
    });
  };

  const toggleChettanBreak = (durationMins = 15) => {
    setChettanProfile(prev => {
      const nextBreak = !prev.onBreak;
      const breakUntil = nextBreak
        ? new Date(Date.now() + durationMins * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : undefined;
      addToast(
        nextBreak ? 'On Chai Break ☕' : 'Break Ended',
        nextBreak
          ? `Chettan is taking a ${durationMins}m break until ${breakUntil}`
          : 'Back on delivery duty',
        'info'
      );
      return { ...prev, onBreak: nextBreak, breakUntil };
    });
  };

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        deviceView,
        setDeviceView,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        orders,
        activeOrder,
        setActiveOrderId,
        placeOrder,
        updateOrderStatus,
        verifyDeliveryPin,
        reportDeliveryIssue,
        rateOrder,
        reorderItems,
        studentProfile,
        updateStudentProfile,
        addSavedLocation,
        removeSavedLocation,
        canteenConfig,
        updateCanteenConfig,
        chettanProfile,
        toggleChettanOnline,
        toggleChettanBreak,
        toasts,
        addToast,
        dismissToast,
        playChime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
