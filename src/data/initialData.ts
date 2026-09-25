import { FoodItem, CampusLocation, StudentProfile, Order, CanteenConfig, ChettanProfile } from '../types';

export const INITIAL_MENU_ITEMS: FoodItem[] = [
  // Tea & Coffee
  {
    id: 'item-tea-1',
    name: 'Special Kadum Chaya (Dum Tea)',
    localName: 'നാടൻ ചായ',
    category: 'tea_coffee',
    price: 12,
    prepTimeMinutes: 5,
    inStock: true,
    description: 'Freshly brewed aromatic campus tea with freshly crushed cardamom & milk.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isBestseller: true,
    badge: 'Campus Favorite'
  },
  {
    id: 'item-tea-2',
    name: 'Kattan Chaya (Black Tea)',
    localName: 'കട്ടൻ ചായ',
    category: 'tea_coffee',
    price: 10,
    prepTimeMinutes: 4,
    inStock: true,
    description: 'Strong, steaming black tea infused with ginger & mint notes.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },
  {
    id: 'item-coffee-1',
    name: 'Hot Filter Bru Coffee',
    localName: 'ഫിൽറ്റർ കാപ്പി',
    category: 'tea_coffee',
    price: 20,
    prepTimeMinutes: 6,
    inStock: true,
    description: 'Frothy hot coffee brewed South-Indian style in stainless steel tumblers.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isBestseller: true
  },
  {
    id: 'item-boost-1',
    name: 'Hot Boost / Horlicks Malt',
    localName: 'ബൂസ്റ്റ്',
    category: 'tea_coffee',
    price: 22,
    prepTimeMinutes: 5,
    inStock: true,
    description: 'Thick hot malted chocolate energy drink popular during exam study breaks.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },

  // Quick Snacks
  {
    id: 'item-samosa-1',
    name: 'Crispy Veg Samosa (2 pcs)',
    localName: 'സമോസ',
    category: 'quick_snacks',
    price: 15,
    prepTimeMinutes: 4,
    inStock: true,
    description: 'Golden triangular pastry stuffed with spicy cumin potatoes and green peas.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isBestseller: true,
    isTodaySpecial: true,
    badge: 'Freshly Fried'
  },
  {
    id: 'item-puff-1',
    name: 'Flaky Veg Puff',
    localName: 'വെജ് പഫ്സ്',
    category: 'quick_snacks',
    price: 20,
    prepTimeMinutes: 4,
    inStock: true,
    description: 'Crisp multi-layered butter puff stuffed with seasoned onion, carrot & potato masala.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },
  {
    id: 'item-puff-2',
    name: 'Kerala Egg Puff',
    localName: 'മുട്ട പഫ്സ്',
    category: 'quick_snacks',
    price: 25,
    prepTimeMinutes: 5,
    inStock: true,
    description: 'College canteen icon: half boiled egg nestled inside caramelized onion masala & flaky pastry.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isBestseller: true,
    badge: 'Chettan Special'
  },
  {
    id: 'item-pazhampori-1',
    name: 'Pazhampori (Banana Fritter)',
    localName: 'പഴംപൊരി',
    category: 'quick_snacks',
    price: 10,
    prepTimeMinutes: 6,
    inStock: true,
    description: 'Ripe Nendran plantain dipped in sweet golden batter and deep-fried to perfection.',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isTodaySpecial: true
  },
  {
    id: 'item-cutlet-1',
    name: 'Spicy Potato Cutlet',
    localName: 'കട്ട്ലറ്റ്',
    category: 'quick_snacks',
    price: 18,
    prepTimeMinutes: 5,
    inStock: true,
    description: 'Crumb-fried spicy vegetable cutlet served with tangy canteen tomato sauce.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },

  // Light Bites
  {
    id: 'item-sandwich-1',
    name: 'Grilled Vegetable Sandwich',
    localName: 'സാൻഡ്വിച്ച്',
    category: 'light_bites',
    price: 40,
    prepTimeMinutes: 8,
    inStock: true,
    description: 'Toasted white bread filled with cucumber, tomato, green chutney and house cheese spread.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },
  {
    id: 'item-biscuit-1',
    name: 'Bakery Butter Biscuit Packet',
    localName: 'ബിസ്കറ്റ് പാക്കറ്റ്',
    category: 'light_bites',
    price: 10,
    prepTimeMinutes: 1,
    inStock: true,
    description: 'Crisp salted Osmania or sweet butter biscuits, ideal for dipping in hot tea.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },
  {
    id: 'item-creambun-1',
    name: 'College Bakery Cream Bun',
    localName: 'ക്രീം ബൺ',
    category: 'light_bites',
    price: 15,
    prepTimeMinutes: 1,
    inStock: true,
    description: 'Soft sugar-glazed milk bun filled with sweet vanilla buttercream.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  },

  // Cold Drinks
  {
    id: 'item-lime-1',
    name: 'Chilled Fresh Lime Soda / Juice',
    localName: 'ഫ്രഷ് ലൈം',
    category: 'cold_drinks',
    price: 30,
    prepTimeMinutes: 4,
    inStock: true,
    description: 'Hand-squeezed refreshing lime with chilled soda or water, sweet & salty mix.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isBestseller: true
  },
  {
    id: 'item-kulukki-1',
    name: 'Spicy Kulukki Sarbath',
    localName: 'കുലുക്കി സർബത്ത്',
    category: 'cold_drinks',
    price: 35,
    prepTimeMinutes: 5,
    inStock: true,
    description: 'Iconic shaken lemonade with basil seeds (sabja), crushed ice, and a slice of green chilli.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    badge: 'Kerala Special'
  },
  {
    id: 'item-mango-1',
    name: 'Cold Mango Frooti / Slice Drink',
    localName: 'മാംഗോ ജ്യൂസ്',
    category: 'cold_drinks',
    price: 20,
    prepTimeMinutes: 1,
    inStock: true,
    description: 'Chilled sweet mango beverage, refreshing companion for afternoon classes.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    isVeg: true
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-2024-cs',
  name: 'Anjali Menon',
  collegeEmail: 'anjali.cs22@college.edu.in',
  studentId: 'CS22B042',
  department: 'Computer Science & Engineering',
  semester: 'S6 - 3rd Year',
  phone: '+91 98471 23456',
  walletBalance: 140,
  savedLocations: [
    {
      id: 'loc-1',
      label: 'System Lab CSE (NB-1-109 A)',
      roomCode: 'NB-1-109 A',
      department: 'Computer Science & Engineering',
      building: 'North Block',
      floor: '1st Floor',
      room: 'NB-1-109 A (System Lab CSE)',
      landmark: 'West Wing Top, Next to Faculty & UPS Rooms'
    },
    {
      id: 'loc-2',
      label: 'Class Room CE 3A (NB-1-110)',
      roomCode: 'NB-1-110',
      department: 'Civil Engineering',
      building: 'North Block',
      floor: '1st Floor',
      room: 'NB-1-110 (Class Room CE 3A)',
      landmark: 'East Wing Top, Opposite North Stairs Landing'
    },
    {
      id: 'loc-3',
      label: 'CE Seminar Hall (NB-1-103)',
      roomCode: 'NB-1-103',
      department: 'Civil Engineering',
      building: 'North Block',
      floor: '1st Floor',
      room: 'NB-1-103 (Seminar Hall CE)',
      landmark: 'South Center Core, near Main Block Passage'
    }
  ]
};

export const INITIAL_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    label: 'NB-1-109 A: System Lab CSE',
    roomCode: 'NB-1-109 A',
    department: 'Computer Science & Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-109 A (System Lab CSE)',
    landmark: 'West Wing, Near North Staircase & UPS Room'
  },
  {
    label: 'NB-1-110: Class Room (CE 3A)',
    roomCode: 'NB-1-110',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-110 (Class Room CE 3A)',
    landmark: 'East Wing, Beside CE 2B Classroom'
  },
  {
    label: 'NB-1-111: Class Room (CE 2B)',
    roomCode: 'NB-1-111',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-111 (Class Room CE 2B)',
    landmark: 'East Wing, Next to Ladies Restroom'
  },
  {
    label: 'NB-1-113: Class Room (CE 2A)',
    roomCode: 'NB-1-113',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-113 (Class Room CE 2A)',
    landmark: 'East Wing, Opposite CE Faculty 107B'
  },
  {
    label: 'NB-1-109: Project Lab CE',
    roomCode: 'NB-1-109',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-109 (Project Lab CE)',
    landmark: 'West Wing, Between UPS room and Gents Toilet'
  },
  {
    label: 'NB-1-107A: PG-2 CE Class',
    roomCode: 'NB-1-107A',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-107A (PG-2 CE)',
    landmark: 'West Wing, Beside Faculty Cabin 106'
  },
  {
    label: 'NB-1-103: Seminar Hall (CE)',
    roomCode: 'NB-1-103',
    department: 'Civil Engineering',
    building: 'North Block',
    floor: '1st Floor',
    room: 'NB-1-103 (Seminar Hall CE)',
    landmark: 'South Core Entrance'
  },
  {
    label: 'Central Library - Reference Porch',
    department: 'Campus Central Facility',
    building: 'Library Block',
    floor: '1st Floor',
    room: 'Reading Hall Desk 14',
    landmark: 'Quiet Zone Reference Rack B'
  },
  {
    label: 'College Ground & Sports Pavilion',
    department: 'Physical Education',
    building: 'Sports Complex',
    floor: 'Ground',
    room: 'Pavilion Bench 3',
    landmark: 'Under Banyan Tree Shade'
  }
];

export const BREAK_SLOTS = [
  { id: 'instant', label: 'Deliver Now (8-12 mins)', desc: 'Immediate dispatch' },
  { id: 'morning_break', label: '11:15 AM Short Break', desc: '15 min tea interval' },
  { id: 'lunch_break', label: '01:00 PM Lunch Break', desc: '45 min lunch period' },
  { id: 'evening_break', label: '03:45 PM Tea Break', desc: 'Pre-lab snack interval' }
];

export const INITIAL_CHETTAN_PROFILE: ChettanProfile = {
  name: 'Chettan Kumaran',
  phone: '+91 94470 56789',
  isOnline: true,
  onBreak: false,
  breakUntil: undefined,
  deliveriesToday: 18,
  rating: 4.9
};

export const INITIAL_CANTEEN_CONFIG: CanteenConfig = {
  isOpen: true,
  openingTime: '08:00 AM',
  closingTime: '05:30 PM',
  pauseOrders: false,
  pauseReason: '',
  estimatedDeliveryMins: 10,
  minOrderAmount: 20,
  deliveryFee: 5,
  freeDeliveryThreshold: 60
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#CK-4192',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    student: {
      name: 'Anjali Menon',
      studentId: 'CS22B042',
      department: 'Computer Science',
      phone: '+91 98471 23456'
    },
    items: [
      { itemId: 'item-tea-1', name: 'Special Kadum Chaya', price: 12, quantity: 2, instructions: '1 with less sugar' },
      { itemId: 'item-samosa-1', name: 'Crispy Veg Samosa (2 pcs)', price: 15, quantity: 1, instructions: 'Extra green chutney' }
    ],
    subtotal: 39,
    deliveryFee: 5,
    totalAmount: 44,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'out_for_delivery',
    deliveryLocation: {
      department: 'Computer Science & Engineering',
      building: 'North Block',
      floor: '1st Floor',
      room: 'NB-1-109 A (System Lab CSE)',
      roomCode: 'NB-1-109 A',
      landmark: 'West Wing Top, Next to UPS Room',
      label: 'System Lab CSE'
    },
    deliveryPin: '3819',
    scheduledTime: 'Immediate (8-12m)',
    specialNote: 'Please deliver before lab professor starts demonstration!',
    chettanName: 'Chettan Kumaran',
    statusTimeline: [
      { status: 'placed', timestamp: '11:02 AM', note: 'Order placed by student' },
      { status: 'accepted', timestamp: '11:03 AM', note: 'Canteen accepted order' },
      { status: 'preparing', timestamp: '11:05 AM', note: 'Tea brewing & samosas heating' },
      { status: 'ready_for_pickup', timestamp: '11:10 AM', note: 'Packed in canteen delivery tray' },
      { status: 'chettan_assigned', timestamp: '11:11 AM', note: 'Chettan picked up order bag' },
      { status: 'out_for_delivery', timestamp: '11:12 AM', note: 'Chettan entered North Block via Main Block corridor' }
    ]
  },
  {
    id: '#CK-4188',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    student: {
      name: 'Rohan Varma',
      studentId: 'CE21B018',
      department: 'Civil Engineering',
      phone: '+91 97450 11223'
    },
    items: [
      { itemId: 'item-coffee-1', name: 'Hot Filter Bru Coffee', price: 20, quantity: 2 },
      { itemId: 'item-puff-2', name: 'Kerala Egg Puff', price: 25, quantity: 2 }
    ],
    subtotal: 90,
    deliveryFee: 0,
    totalAmount: 90,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'ready_for_pickup',
    deliveryLocation: {
      department: 'Civil Engineering',
      building: 'North Block',
      floor: '1st Floor',
      room: 'NB-1-110 (Class Room CE 3A)',
      roomCode: 'NB-1-110',
      landmark: 'East Wing Top, opposite North Stairs'
    },
    deliveryPin: '7254',
    scheduledTime: 'Immediate',
    chettanName: 'Chettan Kumaran',
    statusTimeline: [
      { status: 'placed', timestamp: '10:52 AM', note: 'Order placed' },
      { status: 'accepted', timestamp: '10:53 AM', note: 'Canteen accepted' },
      { status: 'preparing', timestamp: '10:56 AM', note: 'Brewing filter coffee' },
      { status: 'ready_for_pickup', timestamp: '11:08 AM', note: 'Hot & ready on pickup shelf 2' }
    ]
  },
  {
    id: '#CK-4180',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    student: {
      name: 'Fathima Noor',
      studentId: 'EC23B099',
      department: 'Electronics & Communication',
      phone: '+91 99955 44332'
    },
    items: [
      { itemId: 'item-pazhampori-1', name: 'Pazhampori (Banana Fritter)', price: 10, quantity: 3 },
      { itemId: 'item-tea-2', name: 'Kattan Chaya (Black Tea)', price: 10, quantity: 2 }
    ],
    subtotal: 50,
    deliveryFee: 5,
    totalAmount: 55,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'delivered',
    deliveryLocation: {
      department: 'Electronics',
      building: 'North Block',
      floor: '1st Floor',
      room: 'EC-102 (DSP Lab)',
      landmark: 'Opposite HOD Office'
    },
    deliveryPin: '5162',
    scheduledTime: 'Morning Interval',
    chettanName: 'Chettan Kumaran',
    rating: 5,
    review: 'Piping hot Pazhampori! Chettan reached right when our professor stepped out.',
    statusTimeline: [
      { status: 'placed', timestamp: '10:05 AM', note: 'Order placed' },
      { status: 'accepted', timestamp: '10:07 AM', note: 'Canteen accepted' },
      { status: 'preparing', timestamp: '10:10 AM', note: 'Fresh frying' },
      { status: 'ready_for_pickup', timestamp: '10:18 AM', note: 'Ready for pickup' },
      { status: 'out_for_delivery', timestamp: '10:20 AM', note: 'Chettan heading to North Block' },
      { status: 'delivered', timestamp: '10:28 AM', note: 'PIN 5162 verified & delivered' }
    ]
  }
];
