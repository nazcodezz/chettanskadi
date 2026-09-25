import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Wallet,
  MapPin,
  Plus,
  Trash2,
  Check,
  Shield,
  CreditCard
} from 'lucide-react';
import { LocationSelectorModal } from './LocationSelectorModal';

export const ProfileTab: React.FC = () => {
  const {
    studentProfile,
    updateStudentProfile,
    removeSavedLocation,
    addToast
  } = useApp();

  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.collegeEmail);
  const [studentId, setStudentId] = useState(studentProfile.studentId);
  const [department, setDepartment] = useState(studentProfile.department);
  const [semester, setSemester] = useState(studentProfile.semester);
  const [phone, setPhone] = useState(studentProfile.phone);

  const [isEditing, setIsEditing] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [walletAddAmount, setWalletAddAmount] = useState(100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      collegeEmail: email,
      studentId,
      department,
      semester,
      phone
    });
    setIsEditing(false);
    addToast('Profile Saved', 'Your student details were updated', 'success');
  };

  const handleAddWallet = (amount: number) => {
    updateStudentProfile({
      walletBalance: studentProfile.walletBalance + amount
    });
    addToast('Wallet Recharged', `Added ₹${amount} to your campus wallet!`, 'success');
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display">
          Student Profile
        </h1>
        <p className="text-xs text-stone-500">
          Manage your college identity, campus delivery locations, and refreshments wallet
        </p>
      </div>

      {/* College ID Card Look */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 text-white shadow-lg border border-amber-800/40 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/30 text-amber-200 border border-amber-500/40 flex items-center justify-center font-bold text-xl">
              {studentProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  {studentProfile.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-200 border border-amber-400/30">
                  {studentProfile.studentId}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {studentProfile.department}
              </p>
              <p className="text-[11px] text-stone-400">
                {studentProfile.semester} · {studentProfile.collegeEmail}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Student Refreshment Wallet */}
        <div className="mt-5 pt-4 border-t border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              <span>Campus Tea Wallet</span>
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              ₹{studentProfile.walletBalance}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[50, 100, 200].map(amt => (
              <button
                key={amt}
                onClick={() => handleAddWallet(amt)}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-xs font-bold border border-amber-400/30 transition-colors"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-sm text-stone-900">Edit College Credentials</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                College Email ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Student ID / Roll No
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (for Chettan)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Semester / Year
              </label>
              <input
                type="text"
                required
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Saved Delivery Locations */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-800" />
            <h3 className="font-bold text-sm text-stone-900">
              Saved Campus Delivery Locations
            </h3>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spot</span>
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {studentProfile.savedLocations.map((loc, idx) => (
            <div
              key={loc.id || idx}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-bold text-stone-900">{loc.label || loc.room}</p>
                <p className="text-stone-600">
                  {loc.building} · {loc.floor} · {loc.room}
                </p>
                <p className="text-[11px] text-stone-400">Near {loc.landmark}</p>
              </div>

              {studentProfile.savedLocations.length > 1 && (
                <button
                  onClick={() => removeSavedLocation(loc.id || loc.label || '')}
                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={studentProfile.savedLocations[0]}
        onSelectLocation={loc => {
          // Handled inside modal via addSavedLocation
        }}
      />
    </div>
  );
};
