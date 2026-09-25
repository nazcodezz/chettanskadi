import React, { useState } from 'react';
import { NORTH_BLOCK_ROOMS, MapRoom, MAIN_BLOCK_ENTRY, CORRIDOR_WAYPOINTS } from '../../data/northBlockMapData';
import { Order } from '../../types';
import {
  MapPin,
  Bike,
  Info,
  Layers,
  Sparkles,
  Coffee,
  Check,
  Maximize2,
  Compass,
  ArrowRight
} from 'lucide-react';

interface NorthBlockFloorMapProps {
  selectedRoomCode?: string;
  onSelectRoom?: (room: MapRoom) => void;
  activeOrders?: Order[];
  showChettanRoute?: boolean;
  highlightedOrder?: Order;
  mode?: 'interactive_picker' | 'tracker' | 'chettan_navigator';
}

export const NorthBlockFloorMap: React.FC<NorthBlockFloorMapProps> = ({
  selectedRoomCode,
  onSelectRoom,
  activeOrders = [],
  showChettanRoute = true,
  highlightedOrder,
  mode = 'interactive_picker'
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<MapRoom | null>(null);
  const [viewStyle, setViewStyle] = useState<'blueprint' | 'campus_warm'>('blueprint');
  const [filterWing, setFilterWing] = useState<'all' | 'west' | 'east' | 'south'>('all');

  // Find active room object
  const activeTargetCode = highlightedOrder?.deliveryLocation.roomCode || selectedRoomCode;
  const targetRoom = NORTH_BLOCK_ROOMS.find(
    r =>
      r.code === activeTargetCode ||
      (highlightedOrder?.deliveryLocation.room &&
        highlightedOrder.deliveryLocation.room.includes(r.code))
  );

  // Compute walking path from Main Block entry to the target room's door
  const getPathToDoor = (door: { x: number; y: number }, wing: string) => {
    const start = MAIN_BLOCK_ENTRY;
    const foyer = CORRIDOR_WAYPOINTS.southFoyer;

    if (wing === 'west') {
      const turnY = Math.max(130, Math.min(door.y, 960));
      return `M ${start.x} ${start.y} L ${foyer.x} ${foyer.y} L 380 ${foyer.y} L 380 ${turnY} L ${door.x} ${door.y}`;
    } else if (wing === 'east') {
      const turnY = Math.max(130, Math.min(door.y, 960));
      return `M ${start.x} ${start.y} L ${foyer.x} ${foyer.y} L 600 ${foyer.y} L 600 ${turnY} L ${door.x} ${door.y}`;
    } else {
      // South wing
      return `M ${start.x} ${start.y} L ${foyer.x} ${foyer.y} L ${door.x} ${door.y}`;
    }
  };

  const walkingPathD = targetRoom ? getPathToDoor(targetRoom.door, targetRoom.wing) : null;

  // Active orders per room
  const getOrdersInRoom = (roomCode: string) => {
    return activeOrders.filter(
      o =>
        o.deliveryLocation.roomCode === roomCode ||
        (o.deliveryLocation.room && o.deliveryLocation.room.includes(roomCode))
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
      {/* Map Control Bar */}
      <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm text-stone-900 font-display flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-700" />
              <span>North Block – 1st Floor Plan (Civil & CSE)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono">
              FFL +106.30
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Click any classroom or lab to select as delivery point
          </p>
        </div>

        {/* View style toggle & Wing Filter */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => setViewStyle('blueprint')}
              className={`px-2 py-1 rounded-md transition-all ${
                viewStyle === 'blueprint'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              CAD Blueprint
            </button>
            <button
              onClick={() => setViewStyle('campus_warm')}
              className={`px-2 py-1 rounded-md transition-all ${
                viewStyle === 'campus_warm'
                  ? 'bg-amber-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chai Theme
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-stone-600">
            <button
              onClick={() => setFilterWing('all')}
              className={`px-2 py-1 rounded-md ${filterWing === 'all' ? 'bg-amber-100 font-bold text-amber-900' : 'hover:bg-stone-100'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterWing('west')}
              className={`px-2 py-1 rounded-md ${filterWing === 'west' ? 'bg-amber-100 font-bold text-amber-900' : 'hover:bg-stone-100'}`}
            >
              West Wing
            </button>
            <button
              onClick={() => setFilterWing('east')}
              className={`px-2 py-1 rounded-md ${filterWing === 'east' ? 'bg-amber-100 font-bold text-amber-900' : 'hover:bg-stone-100'}`}
            >
              East Wing
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div
        className={`relative w-full overflow-x-auto overflow-y-hidden p-2 sm:p-4 select-none flex items-center justify-center transition-colors ${
          viewStyle === 'blueprint' ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/40 text-stone-900'
        }`}
      >
        <svg
          viewBox="0 0 1000 1480"
          className="w-full max-w-[620px] h-auto drop-shadow-sm transition-all"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Architectural Hatch Pattern for Unassigned Room NB-1-101 */}
            <pattern
              id="archHatch"
              width="15"
              height="15"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="15"
                stroke={viewStyle === 'blueprint' ? '#475569' : '#d6d3d1'}
                strokeWidth="1.5"
              />
            </pattern>

            {/* Glowing marker filter for Chettan delivery pin */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Boundary Wall (Heavy Architectural Line) */}
          <rect
            x="110"
            y="20"
            width="760"
            height="1140"
            fill="none"
            stroke={viewStyle === 'blueprint' ? '#64748b' : '#292524'}
            strokeWidth="6"
          />

          {/* South Seminar Hall Outcrop Boundary */}
          <path
            d="M 390 1160 L 390 1440 L 670 1440 L 670 1160"
            fill="none"
            stroke={viewStyle === 'blueprint' ? '#64748b' : '#292524'}
            strokeWidth="5"
          />

          {/* Corridor Connection to Main Block (Bottom Right) */}
          <path
            d="M 730 1060 L 920 1060 M 730 1140 L 920 1140"
            stroke={viewStyle === 'blueprint' ? '#64748b' : '#292524'}
            strokeWidth="4"
          />
          {/* Arrow & Label to Main Block */}
          <text
            x="800"
            y="1050"
            fontSize="14"
            fontWeight="bold"
            fill={viewStyle === 'blueprint' ? '#38bdf8' : '#b45309'}
            fontFamily="monospace"
          >
            TO MAIN BLOCK ➔
          </text>
          <text
            x="800"
            y="1075"
            fontSize="10"
            fill={viewStyle === 'blueprint' ? '#94a3b8' : '#78716c'}
            fontFamily="monospace"
          >
            FFL +104.35
          </text>

          {/* Central Open Atrium / Cut-out Void */}
          <rect
            x="395"
            y="190"
            width="190"
            height="850"
            rx="8"
            fill={viewStyle === 'blueprint' ? '#090d16' : '#f5f5f4'}
            stroke={viewStyle === 'blueprint' ? '#475569' : '#a8a29e'}
            strokeWidth="3"
            strokeDasharray="4,4"
          />
          <text
            x="490"
            y="610"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill={viewStyle === 'blueprint' ? '#475569' : '#a8a29e'}
            letterSpacing="6"
            transform="rotate(-90 490 610)"
          >
            CENTRAL OPEN ATRIUM
          </text>

          {/* North Staircase (Top Center with semi-circular landing) */}
          <g transform="translate(425, 30)">
            {/* Stair Treads */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 10}
                x2="130"
                y2={i * 10}
                stroke={viewStyle === 'blueprint' ? '#94a3b8' : '#57534e'}
                strokeWidth="1.5"
              />
            ))}
            {/* Center rail */}
            <line
              x1="65"
              y1="0"
              x2="65"
              y2="105"
              stroke={viewStyle === 'blueprint' ? '#e2e8f0' : '#292524'}
              strokeWidth="2"
            />
            {/* Curved Landing */}
            <path
              d="M 0 105 A 65 65 0 0 0 130 105 Z"
              fill="none"
              stroke={viewStyle === 'blueprint' ? '#94a3b8' : '#57534e'}
              strokeWidth="2"
            />
            <text
              x="65"
              y="135"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={viewStyle === 'blueprint' ? '#cbd5e1' : '#44403c'}
            >
              UP
            </text>
            <text
              x="65"
              y="-10"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={viewStyle === 'blueprint' ? '#38bdf8' : '#b45309'}
              fontFamily="monospace"
            >
              FFL +106.30
            </text>
          </g>

          {/* South Staircase (Bottom Center) */}
          <g transform="translate(425, 1040)">
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 8}
                x2="130"
                y2={i * 8}
                stroke={viewStyle === 'blueprint' ? '#94a3b8' : '#57534e'}
                strokeWidth="1.5"
              />
            ))}
            <line
              x1="65"
              y1="0"
              x2="65"
              y2="80"
              stroke={viewStyle === 'blueprint' ? '#e2e8f0' : '#292524'}
              strokeWidth="2"
            />
            <rect
              x="0"
              y="80"
              width="130"
              height="30"
              fill="none"
              stroke={viewStyle === 'blueprint' ? '#94a3b8' : '#57534e'}
              strokeWidth="2"
            />
            <text
              x="65"
              y="100"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={viewStyle === 'blueprint' ? '#cbd5e1' : '#44403c'}
            >
              DOWN / UP
            </text>
            <text
              x="65"
              y="-10"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={viewStyle === 'blueprint' ? '#38bdf8' : '#b45309'}
              fontFamily="monospace"
            >
              FFL +106.30
            </text>
          </g>

          {/* Render All North Block Rooms */}
          {NORTH_BLOCK_ROOMS.map(room => {
            const isSelected =
              room.code === selectedRoomCode ||
              (targetRoom && targetRoom.code === room.code);
            const isHovered = hoveredRoom?.code === room.code;
            const ordersInRoom = getOrdersInRoom(room.code);
            const hasActiveOrder = ordersInRoom.length > 0;
            const isUnassigned = room.code === 'NB-1-101';
            const isDimmed = filterWing !== 'all' && room.wing !== filterWing;

            // Colors based on view mode and states
            let fillBg =
              viewStyle === 'blueprint'
                ? isUnassigned
                  ? 'url(#archHatch)'
                  : isSelected
                  ? '#1e3a5f'
                  : isHovered
                  ? '#0f2744'
                  : '#0b1324'
                : isUnassigned
                ? 'url(#archHatch)'
                : isSelected
                ? '#fef3c7'
                : isHovered
                ? '#fffbeb'
                : '#ffffff';

            let strokeColor =
              viewStyle === 'blueprint'
                ? isSelected
                  ? '#38bdf8'
                  : isHovered
                  ? '#60a5fa'
                  : '#475569'
                : isSelected
                ? '#b45309'
                : isHovered
                ? '#f59e0b'
                : '#292524';

            return (
              <g
                key={room.code}
                onClick={() => onSelectRoom && onSelectRoom(room)}
                onMouseEnter={() => setHoveredRoom(room)}
                onMouseLeave={() => setHoveredRoom(null)}
                className={`transition-all duration-150 ${
                  room.isDeliverable ? 'cursor-pointer' : 'cursor-default'
                } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
              >
                {/* Room Boundary Box */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={fillBg}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 4 : 2}
                  rx="3"
                />

                {/* Door Opening 'D' symbol at corridor wall */}
                <circle
                  cx={room.door.x}
                  cy={room.door.y}
                  r={5}
                  fill={viewStyle === 'blueprint' ? '#38bdf8' : '#b45309'}
                />
                <text
                  x={room.door.x + (room.wing === 'west' ? 8 : -14)}
                  y={room.door.y + 4}
                  fontSize="9"
                  fontWeight="bold"
                  fill={viewStyle === 'blueprint' ? '#94a3b8' : '#78716c'}
                  fontFamily="sans-serif"
                >
                  D
                </text>

                {/* Room ID Badge & Labels */}
                <g>
                  {/* Room Code Box */}
                  <rect
                    x={room.x + room.width / 2 - 42}
                    y={room.y + 12}
                    width={84}
                    height={18}
                    rx="3"
                    fill={
                      viewStyle === 'blueprint'
                        ? isSelected
                          ? '#0284c7'
                          : '#1e293b'
                        : isSelected
                        ? '#d97706'
                        : '#f5f5f4'
                    }
                    stroke={viewStyle === 'blueprint' ? '#38bdf8' : '#78716c'}
                    strokeWidth="1"
                  />
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + 25}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="monospace"
                    fill={
                      viewStyle === 'blueprint'
                        ? '#ffffff'
                        : isSelected
                        ? '#ffffff'
                        : '#1c1917'
                    }
                  >
                    {room.code}
                  </text>

                  {/* Room Name */}
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + 48}
                    textAnchor="middle"
                    fontSize={room.name.length > 18 ? 10 : 12}
                    fontWeight="bold"
                    fill={
                      viewStyle === 'blueprint'
                        ? isSelected
                          ? '#7dd3fc'
                          : '#e2e8f0'
                        : isSelected
                        ? '#78350f'
                        : '#1c1917'
                    }
                  >
                    {room.name}
                  </text>

                  {/* Dimensions & Area */}
                  {room.dimensions && (
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + 68}
                      textAnchor="middle"
                      fontSize="9"
                      fill={viewStyle === 'blueprint' ? '#94a3b8' : '#78716c'}
                      fontFamily="monospace"
                    >
                      {room.dimensions}
                    </text>
                  )}
                  {room.area && (
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + 82}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={
                        viewStyle === 'blueprint'
                          ? '#38bdf8'
                          : isSelected
                          ? '#b45309'
                          : '#57534e'
                      }
                      fontFamily="monospace"
                    >
                      ({room.area})
                    </text>
                  )}

                  {/* Special indicator for active orders inside this classroom */}
                  {hasActiveOrder && (
                    <g transform={`translate(${room.x + 10}, ${room.y + room.height - 28})`}>
                      <rect
                        width={90}
                        height={20}
                        rx="4"
                        fill="#ea580c"
                        filter="url(#glowEffect)"
                      />
                      <text
                        x="45"
                        y="14"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        ☕ {ordersInRoom.length} Active Chai
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* Animated Chettan Walking Route Path */}
          {showChettanRoute && walkingPathD && targetRoom && (
            <g>
              {/* Route Shadow / glow */}
              <path
                d={walkingPathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />
              {/* Route Dashed Active Trail */}
              <path
                d={walkingPathD}
                fill="none"
                stroke="#ea580c"
                strokeWidth="3.5"
                strokeDasharray="8,6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Chettan Runner Marker on the route */}
              <g transform={`translate(${targetRoom.door.x - 16}, ${targetRoom.door.y - 32})`}>
                <circle
                  cx="16"
                  cy="16"
                  r="18"
                  fill="#b45309"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="url(#glowEffect)"
                />
                <text x="16" y="22" textAnchor="middle" fontSize="16">
                  🚴
                </text>
              </g>

              {/* Pulsing Target Beacon at the classroom door */}
              <circle
                cx={targetRoom.door.x}
                cy={targetRoom.door.y}
                r="10"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="4;18;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}

          {/* Structural Pillar Posts along Outer Walls (Black Blocks) */}
          {[
            { x: 105, y: 15 },
            { x: 335, y: 15 },
            { x: 635, y: 15 },
            { x: 865, y: 15 },
            { x: 105, y: 225 },
            { x: 865, y: 225 },
            { x: 105, y: 485 },
            { x: 865, y: 485 },
            { x: 105, y: 740 },
            { x: 865, y: 740 },
            { x: 105, y: 1040 },
            { x: 865, y: 1040 }
          ].map((pillar, i) => (
            <rect
              key={i}
              x={pillar.x}
              y={pillar.y}
              width="14"
              height="14"
              fill={viewStyle === 'blueprint' ? '#cbd5e1' : '#000000'}
            />
          ))}

          {/* Blueprint Signature Block (Bottom Right) */}
          <g transform="translate(680, 1420)">
            <line
              x1="0"
              y1="0"
              x2="250"
              y2="0"
              stroke={viewStyle === 'blueprint' ? '#94a3b8' : '#292524'}
              strokeWidth="1.5"
            />
            <text
              x="125"
              y="22"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              letterSpacing="1"
              fill={viewStyle === 'blueprint' ? '#94a3b8' : '#292524'}
            >
              ARCHITECT&apos;S SIGNATURE
            </text>
          </g>
        </svg>
      </div>

      {/* Selected / Hovered Room Info Panel */}
      <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {targetRoom ? (
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold font-mono shrink-0">
              {targetRoom.code.split('-').pop()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900 text-sm">
                  {targetRoom.code}: {targetRoom.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  {targetRoom.department}
                </span>
              </div>
              <p className="text-stone-600 mt-0.5">
                Area: {targetRoom.area} · Dimensions: {targetRoom.dimensions} · {targetRoom.label}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-500">
            <Info className="w-4 h-4 text-stone-400" />
            <span>Select any classroom or lab on the floor map to assign as delivery point.</span>
          </div>
        )}

        {targetRoom && onSelectRoom && mode === 'interactive_picker' && (
          <button
            onClick={() => onSelectRoom(targetRoom)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Check className="w-4 h-4" />
            <span>Confirm {targetRoom.code}</span>
          </button>
        )}
      </div>
    </div>
  );
};
