import React, { useState } from 'react';
import { CampusLocation } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, Check, Star, Building2, X, Compass, Layers } from 'lucide-react';
import { INITIAL_CAMPUS_LOCATIONS } from '../../data/initialData';
import { NorthBlockFloorMap } from '../map/NorthBlockFloorMap';
import { MapRoom, NORTH_BLOCK_ROOMS } from '../../data/northBlockMapData';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: CampusLocation;
  onSelectLocation: (loc: CampusLocation) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation
}) => {
  const { studentProfile, addSavedLocation } = useApp();
  const [activeTab, setActiveTab] = useState<'floor_map' | 'saved' | 'campus' | 'custom'>('floor_map');

  // Custom location form state
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [building, setBuilding] = useState('North Block');
  const [floor, setFloor] = useState('1st Floor');
  const [room, setRoom] = useState('');
  const [landmark, setLandmark] = useState('');
  const [label, setLabel] = useState('');
  const [saveAsFavorite, setSaveAsFavorite] = useState(true);

  if (!isOpen) return null;

  const handleRoomFromMap = (mRoom: MapRoom) => {
    if (!mRoom.isDeliverable) return;

    const newLoc: CampusLocation = {
      department: mRoom.department,
      building: 'North Block',
      floor: '1st Floor',
      room: `${mRoom.code} (${mRoom.name})`,
      roomCode: mRoom.code,
      landmark: `${mRoom.wing.toUpperCase()} Wing · Area ${mRoom.area}`,
      label: mRoom.name
    };

    onSelectLocation(newLoc);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) return;

    const newLoc: CampusLocation = {
      department,
      building,
      floor,
      room,
      landmark: landmark || 'In classroom',
      label: label || `${room} (${building})`
    };

    if (saveAsFavorite) {
      addSavedLocation(newLoc);
    }
    onSelectLocation(newLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                Select Campus Delivery Point
              </h3>
              <p className="text-xs text-stone-500">
                Pick directly on the North Block floor map or choose saved locations
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

        {/* Tab Filters */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('floor_map')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'floor_map'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>North Block Floor Map (1st Floor)</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Saved ({studentProfile.savedLocations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('campus')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'campus'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>All Campus Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-amber-700 text-amber-900 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Spot</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1">
          {/* TAB 1: INTERACTIVE FLOOR MAP */}
          {activeTab === 'floor_map' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  📍 Tap any classroom (e.g. <b>NB-1-109 A System Lab</b>, <b>NB-1-110 CE 3A</b>) to dispatch Chettan directly to that door.
                </span>
              </div>

              <NorthBlockFloorMap
                selectedRoomCode={selectedLocation.roomCode}
                onSelectRoom={handleRoomFromMap}
                mode="interactive_picker"
              />
            </div>
          )}

          {/* TAB 2: SAVED SHORTCUTS */}
          {activeTab === 'saved' && (
            <div className="space-y-2.5">
              {studentProfile.savedLocations.map((loc, idx) => {
                const isSelected =
                  selectedLocation.room === loc.room &&
                  selectedLocation.building === loc.building;

                return (
                  <div
                    key={loc.id || idx}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">
                          {loc.label || loc.room}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {loc.building} · {loc.floor} · {loc.room}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Landmark: {loc.landmark}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-stone-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: CAMPUS ZONES */}
          {activeTab === 'campus' && (
            <div className="space-y-2.5">
              {INITIAL_CAMPUS_LOCATIONS.map((loc, idx) => {
                const isSelected =
                  selectedLocation.room === loc.room &&
                  selectedLocation.building === loc.building;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-stone-900">
                        {loc.label || loc.department}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {loc.building} · {loc.floor} · {loc.room}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Near: {loc.landmark}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-stone-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: CUSTOM LOCATION FORM */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-stone-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                >
                  <option>Civil Engineering (North Block)</option>
                  <option>Computer Science & Engineering</option>
                  <option>Electronics & Communication</option>
                  <option>Mechanical Engineering</option>
                  <option>Electrical & Electronics</option>
                  <option>MBA / Management Studies</option>
                  <option>Central Library & Amenities</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Building Block
                  </label>
                  <select
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-stone-300 p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                  >
                    <option>North Block</option>
                    <option>Main Academic Block</option>
                    <option>South Block</option>
                    <option>PG & Research Block</option>
                    <option>Workshop Block</option>
                    <option>Amenities / Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Floor Level
                  </label>
                  <select
                    value={floor}
                    onChange={e => setFloor(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-stone-300 p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                  >
                    <option>1st Floor (FFL +106.30)</option>
                    <option>Ground Floor</option>
                    <option>2nd Floor</option>
                    <option>3rd Floor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Room / Lab Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NB-1-109 A"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. System Lab"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nearby Landmark / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite North staircase, beside UPS room"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsFavorite}
                  onChange={e => setSaveAsFavorite(e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-600"
                />
                <span>Save this spot to my favorite shortcuts</span>
              </label>

              <button
                type="submit"
                disabled={!room.trim()}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors mt-2"
              >
                Set As Delivery Location
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
