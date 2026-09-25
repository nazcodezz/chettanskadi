export type UserRole = 'student' | 'delivery' | 'canteen';

export type FoodCategory = 'tea_coffee' | 'quick_snacks' | 'light_bites' | 'cold_drinks';

export interface CampusLocation {
  id?: string;
  department: string;
  building: string;
  floor: string;
  room: string;
  landmark: string;
  label?: string; // e.g. "My Classroom", "Lab", "Staff Room"
  roomCode?: string; // e.g. "NB-1-109 A", "NB-1-110"
  coordinates?: { x: number; y: number }; // Relative position on North Block floor plan
}

export interface StudentProfile {
  id: string;
  name: string;
  collegeEmail: string;
  studentId: string;
  department: string;
  semester: string;
  phone: string;
  savedLocations: CampusLocation[];
  walletBalance: number;
}

export interface FoodItem {
  id: string;
  name: string;
  localName?: string; // Malayalam / colloquial name e.g. "കട്ടൻ ചായ", "പഴംപൊരി"
  category: FoodCategory;
  price: number;
  prepTimeMinutes: number;
  inStock: boolean;
  description: string;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isTodaySpecial?: boolean;
  badge?: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  instructions?: string;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'chettan_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface StatusTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string; // e.g. "#CK-2401"
  createdAt: string;
  updatedAt: string;
  student: {
    name: string;
    studentId: string;
    department: string;
    phone: string;
  };
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    instructions?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  deliveryLocation: CampusLocation;
  deliveryPin: string; // 4-digit code provided to student
  scheduledTime: string; // "Immediate" or break slot
  specialNote?: string;
  isGroupOrder?: boolean;
  groupMembers?: string[];
  chettanName?: string;
  rating?: number;
  review?: string;
  statusTimeline: StatusTimelineEntry[];
  reportedIssue?: string;
}

export interface CanteenConfig {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  pauseOrders: boolean;
  pauseReason: string;
  estimatedDeliveryMins: number;
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export interface ChettanProfile {
  name: string;
  phone: string;
  isOnline: boolean;
  onBreak: boolean;
  breakUntil?: string;
  deliveriesToday: number;
  rating: number;
}
