export interface MapRoom {
  code: string;
  name: string;
  label: string;
  department: string;
  dimensions: string;
  area: string;
  wing: 'west' | 'east' | 'south' | 'service';
  // Normalized grid/box coordinates in SVG viewBox (0,0 to 1000, 1500)
  x: number;
  y: number;
  width: number;
  height: number;
  door: { x: number; y: number }; // Doorway coordinate where Chettan reaches
  isDeliverable: boolean;
  type: 'classroom' | 'lab' | 'faculty' | 'admin' | 'hall' | 'facility';
}

export const NORTH_BLOCK_ROOMS: MapRoom[] = [
  // WEST WING (LEFT SIDE) - TOP TO BOTTOM
  {
    code: 'NB-1-109 A',
    name: 'System Lab CSE',
    label: 'CSE System & Coding Lab',
    department: 'Computer Science & Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'west',
    x: 130,
    y: 40,
    width: 210,
    height: 190,
    door: { x: 345, y: 135 },
    isDeliverable: true,
    type: 'lab'
  },
  {
    code: 'NB-1-FAC-W',
    name: 'Faculty & UPS Rooms',
    label: 'CSE Faculty & Server UPS',
    department: 'Computer Science & Engineering',
    dimensions: '690 x 10',
    area: '24.0 M²',
    wing: 'west',
    x: 130,
    y: 235,
    width: 210,
    height: 60,
    door: { x: 345, y: 265 },
    isDeliverable: true,
    type: 'faculty'
  },
  {
    code: 'NB-1-109',
    name: 'Project Lab CE',
    label: 'Civil Engineering Project Lab',
    department: 'Civil Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'west',
    x: 130,
    y: 300,
    width: 210,
    height: 190,
    door: { x: 345, y: 395 },
    isDeliverable: true,
    type: 'lab'
  },
  {
    code: 'NB-1-108',
    name: 'G.Toilet',
    label: 'Gents Restroom & Duct',
    department: 'Campus Amenities',
    dimensions: 'Toilet Block',
    area: '25.0 M²',
    wing: 'service',
    x: 130,
    y: 495,
    width: 210,
    height: 70,
    door: { x: 345, y: 530 },
    isDeliverable: false,
    type: 'facility'
  },
  {
    code: 'NB-1-107B',
    name: 'CE Faculty Room',
    label: 'Civil Faculty Cabin 107B',
    department: 'Civil Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'west',
    x: 130,
    y: 570,
    width: 210,
    height: 175,
    door: { x: 345, y: 655 },
    isDeliverable: true,
    type: 'faculty'
  },
  {
    code: 'NB-1-107A',
    name: 'PG-2 CE',
    label: 'M.Tech CE Classroom (PG-2)',
    department: 'Civil Engineering',
    dimensions: '8500 x 6800',
    area: '57.80 M²',
    wing: 'west',
    x: 130,
    y: 750,
    width: 210,
    height: 135,
    door: { x: 345, y: 815 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-106',
    name: 'CE Faculty Room',
    label: 'Civil Faculty Cabin 106',
    department: 'Civil Engineering',
    dimensions: '8500 x 6800',
    area: '57.80 M²',
    wing: 'west',
    x: 130,
    y: 890,
    width: 210,
    height: 135,
    door: { x: 345, y: 955 },
    isDeliverable: true,
    type: 'faculty'
  },
  {
    code: 'NB-1-105',
    name: 'CE Dpt. Office & Lib.',
    label: 'Civil Dept Office & Department Library',
    department: 'Civil Engineering',
    dimensions: '6150 x 3300',
    area: '20.29 M²',
    wing: 'south',
    x: 180,
    y: 1050,
    width: 160,
    height: 75,
    door: { x: 345, y: 1085 },
    isDeliverable: true,
    type: 'admin'
  },
  {
    code: 'NB-1-104',
    name: 'CE. HOD',
    label: 'Civil Head of Department (HOD)',
    department: 'Civil Engineering',
    dimensions: '6150 x 3300',
    area: '20.29 M²',
    wing: 'south',
    x: 260,
    y: 1145,
    width: 150,
    height: 75,
    door: { x: 415, y: 1180 },
    isDeliverable: true,
    type: 'admin'
  },

  // SOUTH CORE
  {
    code: 'NB-1-103',
    name: 'Seminar Hall (CE)',
    label: 'Civil Engineering Seminar Hall',
    department: 'Civil Engineering',
    dimensions: '12500 x 10550',
    area: '132.0 M²',
    wing: 'south',
    x: 410,
    y: 1250,
    width: 240,
    height: 170,
    door: { x: 530, y: 1245 },
    isDeliverable: true,
    type: 'hall'
  },

  // EAST WING (RIGHT SIDE) - TOP TO BOTTOM
  {
    code: 'NB-1-110',
    name: 'Class Room (CE 3A)',
    label: 'B.Tech Civil Year 3 - Sec A',
    department: 'Civil Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'east',
    x: 640,
    y: 40,
    width: 210,
    height: 190,
    door: { x: 635, y: 135 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-111',
    name: 'Class Room (CE 2B)',
    label: 'B.Tech Civil Year 2 - Sec B',
    department: 'Civil Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'east',
    x: 640,
    y: 235,
    width: 210,
    height: 195,
    door: { x: 635, y: 330 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-112',
    name: 'L.Toilet',
    label: 'Ladies Restroom & Duct',
    department: 'Campus Amenities',
    dimensions: 'Toilet Block',
    area: '25.0 M²',
    wing: 'service',
    x: 640,
    y: 435,
    width: 210,
    height: 70,
    door: { x: 635, y: 470 },
    isDeliverable: false,
    type: 'facility'
  },
  {
    code: 'NB-1-113',
    name: 'Class Room (CE 2A)',
    label: 'B.Tech Civil Year 2 - Sec A',
    department: 'Civil Engineering',
    dimensions: '8500 x 10300',
    area: '87.55 M²',
    wing: 'east',
    x: 640,
    y: 510,
    width: 210,
    height: 195,
    door: { x: 635, y: 605 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-114',
    name: 'PG-1 CE',
    label: 'M.Tech Civil Classroom (PG-1)',
    department: 'Civil Engineering',
    dimensions: '8500 x 6800',
    area: '57.80 M²',
    wing: 'east',
    x: 640,
    y: 710,
    width: 210,
    height: 135,
    door: { x: 635, y: 775 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-101',
    name: 'Unassigned Room',
    label: 'Civil Drawing / Unassigned Space',
    department: 'Civil Engineering',
    dimensions: '8500 x 6800',
    area: '57.80 M²',
    wing: 'east',
    x: 640,
    y: 850,
    width: 210,
    height: 135,
    door: { x: 635, y: 915 },
    isDeliverable: true,
    type: 'classroom'
  },
  {
    code: 'NB-1-102',
    name: 'CE Faculty',
    label: 'Civil Faculty Cabin 102',
    department: 'Civil Engineering',
    dimensions: '6150 x 3300',
    area: '20.29 M²',
    wing: 'south',
    x: 570,
    y: 1145,
    width: 150,
    height: 75,
    door: { x: 565, y: 1180 },
    isDeliverable: true,
    type: 'faculty'
  }
];

// Corridor entry point from Main block into North Block
export const MAIN_BLOCK_ENTRY = { x: 890, y: 1080, label: 'TO MAIN BLOCK (FFL +104.35)' };

// Central corridor path coordinates for walking route rendering
export const CORRIDOR_WAYPOINTS = {
  mainBlockEntry: { x: 890, y: 1080 },
  southFoyer: { x: 530, y: 1080 },
  southStairs: { x: 490, y: 980 },
  westCorridorBottom: { x: 380, y: 960 },
  westCorridorMid: { x: 380, y: 500 },
  westCorridorTop: { x: 380, y: 130 },
  eastCorridorBottom: { x: 600, y: 960 },
  eastCorridorMid: { x: 600, y: 500 },
  eastCorridorTop: { x: 600, y: 130 },
  northStairs: { x: 490, y: 130 }
};
