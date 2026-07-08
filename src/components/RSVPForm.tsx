/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Users, ClipboardCheck, Sparkles, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { RSVP, AttendanceStatus } from '../types';

interface RSVPFormProps {
  showNikah?: boolean;
}

export default function RSVPForm({ showNikah = true }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: showNikah ? AttendanceStatus.BOTH : AttendanceStatus.WALIMA,
    guestsCount: 1,
    dietaryPref: 'halal',
    prayer: '',
  });

  const [savedRSVP, setSavedRSVP] = useState<RSVP | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('raju_sabina_wedding_rsvp');
    if (existing) {
      try {
        setSavedRSVP(JSON.parse(existing));
      } catch (e) {
        console.error('Failed to parse existing RSVP from local storage', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guestsCount' ? parseInt(value, 10) : value,
    }));
  };

  const handleAttendanceChange = (status: AttendanceStatus) => {
    setFormData((prev) => ({
      ...prev,
      attendance: status,
      // If declining, guest count must be 0
      guestsCount: status === AttendanceStatus.DECLINE ? 0 : Math.max(prev.guestsCount, 1),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Please provide your full name so we can welcome you.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Please provide an email or phone number for confirmation updates.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          attendance: formData.attendance,
          guests_count: formData.guestsCount,
          dietary_pref: formData.dietaryPref,
          prayer: formData.prayer.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newRSVP: RSVP = {
          id: result.id.toString(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          attendance: formData.attendance,
          guestsCount: formData.guestsCount,
          dietaryPref: formData.dietaryPref,
          prayer: formData.prayer.trim(),
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('raju_sabina_wedding_rsvp', JSON.stringify(newRSVP));
        setSavedRSVP(newRSVP);
      } else {
        setError('Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (savedRSVP) {
      setFormData({
        fullName: savedRSVP.fullName,
        email: savedRSVP.email,
        phone: savedRSVP.phone,
        attendance: savedRSVP.attendance,
        guestsCount: savedRSVP.guestsCount,
        dietaryPref: savedRSVP.dietaryPref,
        prayer: savedRSVP.prayer || '',
      });
      setSavedRSVP(null);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to withdraw your RSVP?')) {
      localStorage.removeItem('raju_sabina_wedding_rsvp');
      setSavedRSVP(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        attendance: AttendanceStatus.BOTH,
        guestsCount: 1,
        dietaryPref: 'halal',
        prayer: '',
      });
    }
  };

  const attendanceLabels = {
    [AttendanceStatus.BOTH]: 'Nikah & Walima',
    [AttendanceStatus.NIKAH]: 'Nikah Only',
    [AttendanceStatus.WALIMA]: 'Walima Only',
    [AttendanceStatus.DECLINE]: 'Regretfully Decline',
  };

  // Filter available attendance options based on showNikah
  const availableAttendanceOptions = showNikah
    ? Object.values(AttendanceStatus)
    : [AttendanceStatus.WALIMA, AttendanceStatus.DECLINE];

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <AnimatePresence mode="wait">
        {savedRSVP ? (
          /* Confirmation Success Card */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-cream-50 border-2 border-gold-400 rounded-3xl p-6 md:p-8 shadow-2xl relative text-center text-emerald-950"
            id="rsvp-confirmation"
          >
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-gold-500 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-gold-500 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-gold-500 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-gold-500 rounded-br-lg" />

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-900/10 flex items-center justify-center text-emerald-800 mb-4 border border-emerald-900/20">
                <CheckCircle2 size={36} className="text-emerald-700" />
              </div>

              <span className="text-[10px] font-mono tracking-widest text-gold-600 uppercase">RSVP Registered</span>
              <h4 className="text-2xl md:text-3xl font-serif text-emerald-900 font-semibold mt-1 mb-2">
                Shukran, {savedRSVP.fullName}!
              </h4>
              <p className="text-sm text-emerald-850 max-w-md mx-auto leading-relaxed font-sans mb-6">
                Your response has been registered. We are absolutely honored to have your presence to witness the union of Sk Raju & Sabina Khatun.
              </p>

              {/* RSVP Receipt Details Grid */}
              <div className="w-full bg-emerald-900/5 rounded-2xl p-5 border border-gold-300/30 text-left mb-6 max-w-md mx-auto space-y-3 font-sans">
                <div className="flex justify-between border-b border-emerald-900/10 pb-2">
                  <span className="text-xs text-emerald-800/80 font-medium">Attendance</span>
                  <span className="text-xs font-serif font-bold text-emerald-900">{attendanceLabels[savedRSVP.attendance]}</span>
                </div>
                
                {savedRSVP.attendance !== AttendanceStatus.DECLINE && (
                  <>
                    <div className="flex justify-between border-b border-emerald-900/10 pb-2">
                      <span className="text-xs text-emerald-800/80 font-medium">Guests Attending</span>
                      <span className="text-xs font-bold text-emerald-900">{savedRSVP.guestsCount} {savedRSVP.guestsCount === 1 ? 'Person' : 'People'}</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-900/10 pb-2">
                      <span className="text-xs text-emerald-800/80 font-medium">Dietary Pref</span>
                      <span className="text-xs font-bold capitalize text-emerald-900">{savedRSVP.dietaryPref}</span>
                    </div>
                  </>
                )}

                {(savedRSVP.email || savedRSVP.phone) && (
                  <div className="flex justify-between border-b border-emerald-900/10 pb-2">
                    <span className="text-xs text-emerald-800/80 font-medium">Contact</span>
                    <span className="text-xs font-bold text-emerald-900">{savedRSVP.phone || savedRSVP.email}</span>
                  </div>
                )}

                {savedRSVP.prayer && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-emerald-800/70 uppercase block mb-0.5">Your Blessing / Message</span>
                    <p className="text-xs text-emerald-900 italic font-serif leading-relaxed">"{savedRSVP.prayer}"</p>
                  </div>
                )}
              </div>

              {/* Edit/Withdraw buttons */}
              <div className="flex items-center gap-3 w-full max-w-md mx-auto">
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-1.5 flex-1 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-emerald-950 font-serif text-xs font-medium py-2 px-4 rounded-xl transition-all shadow-md cursor-pointer"
                  id="edit-rsvp-btn"
                >
                  <Edit size={14} />
                  <span>Update RSVP</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-1.5 flex-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 hover:text-rose-800 font-serif text-xs font-medium py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                  id="delete-rsvp-btn"
                >
                  <Trash2 size={14} />
                  <span>Withdraw RSVP</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* RSVP Form Card */
          <motion.form
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="bg-gold-50 border-2 border-gold-300 rounded-3xl p-6 md:p-8 shadow-2xl relative text-emerald-950"
            id="rsvp-form"
          >
            {/* Vintage styling corner decoration overlays */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-gold-400 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-gold-400 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-gold-400 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-gold-400 rounded-br-lg" />

            <div className="text-center mb-6">
              <span className="text-[10px] font-mono tracking-widest text-gold-600 uppercase">Honoring Us With Your Response</span>
              <h4 className="text-2xl md:text-3xl font-serif text-emerald-900 font-bold mt-1">Submit RSVP</h4>
              <p className="text-xs text-emerald-850 max-w-sm mx-auto leading-relaxed font-sans mt-2">
                We kindly request you to RSVP by July 25, 2026 to help us prepare the banquet and welcome you with complete hospitality.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-start gap-2 mb-4 font-sans"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4 font-sans">
              {/* Attendance Selection Buttons (Pill grid) */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-2">
                  Will you join us?
                </label>
                <div className={`grid gap-2 ${showNikah ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
                  {availableAttendanceOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleAttendanceChange(status)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all text-xs font-serif font-semibold cursor-pointer ${
                        formData.attendance === status
                          ? 'bg-emerald-900 border-emerald-950 text-gold-200 shadow-md scale-102'
                          : 'bg-white border-gold-200 hover:border-gold-300 text-emerald-900 hover:bg-emerald-50'
                      }`}
                    >
                      {attendanceLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-200 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm text-emerald-950"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                    Phone / Contact Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter contact number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-200 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm text-emerald-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-200 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm text-emerald-950"
                  />
                </div>

                <div>
                  <label htmlFor="dietaryPref" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                    Dietary Preference
                  </label>
                  <select
                    id="dietaryPref"
                    name="dietaryPref"
                    value={formData.dietaryPref}
                    onChange={handleChange}
                    disabled={formData.attendance === AttendanceStatus.DECLINE}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-200 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm text-emerald-950 disabled:bg-emerald-950/5 disabled:text-emerald-950/45"
                  >
                    <option value="halal">Traditional Halal (Non-Veg)</option>
                    <option value="vegetarian">Pure Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="none">No Specific Restrictions</option>
                  </select>
                </div>
              </div>

              {formData.attendance !== AttendanceStatus.DECLINE && (
                <div>
                  <label htmlFor="guestsCount" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                    Number of Accompanying Guests (excluding you)
                  </label>
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-gold-600" />
                    <input
                      type="range"
                      id="guestsCount"
                      name="guestsCount"
                      min="0"
                      max="5"
                      value={formData.guestsCount}
                      onChange={handleChange}
                      className="flex-1 h-1.5 bg-gold-200/50 rounded-lg appearance-none cursor-pointer accent-emerald-900"
                    />
                    <span className="text-sm font-bold text-emerald-900 w-12 text-right">
                      {formData.guestsCount === 0 ? 'Just Me' : `+ ${formData.guestsCount}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800/70 italic mt-1 block">
                    {formData.guestsCount === 0 
                      ? "Only you will be attending." 
                      : `Total of ${formData.guestsCount + 1} guests will be accommodated.`}
                  </span>
                </div>
              )}

              <div>
                <label htmlFor="prayer" className="text-[11px] font-mono uppercase tracking-wider text-gold-700 block mb-1">
                  Send a Blessed Prayer or Message (Dua)
                </label>
                <textarea
                  id="prayer"
                  name="prayer"
                  rows={3}
                  placeholder="May Allah bless your union with peace, love, and happiness..."
                  value={formData.prayer}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-200 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm text-emerald-950 placeholder:italic"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 active:scale-98 text-gold-200 font-serif py-3 rounded-xl transition-all shadow-lg text-sm font-semibold relative cursor-pointer disabled:bg-emerald-900/70"
                id="submit-rsvp-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gold-200 border-t-transparent rounded-full animate-spin mr-1" />
                    <span>Sealing RSVP...</span>
                  </>
                ) : (
                  <>
                    <ClipboardCheck size={18} />
                    <span>Confirm Attendance</span>
                    <Sparkles size={14} className="absolute right-4 animate-pulse text-gold-300" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
