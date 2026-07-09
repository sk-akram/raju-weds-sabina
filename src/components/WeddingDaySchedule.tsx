/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { weddingCeremonies } from '../lib/ceremonyData';

interface CeremonyEvent {
  time: string;
  event: string;
  details: string;
}

interface CeremonyDay {
  day: string;
  date: string;
  venue: string;
  events: CeremonyEvent[];
}

export default function WeddingDaySchedule() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gold-400" />
            <h2 className="font-serif text-4xl md:text-5xl text-gold-100 font-bold">
              Wedding Ceremony Schedule
            </h2>
            <Calendar className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-gold-300/80 font-mono text-lg">August 5 - 8, 2026</p>
        </motion.div>

        <div className="space-y-8">
          {weddingCeremonies.map((dayData, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
              className="bg-emerald-950/60 border border-gold-300/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="mb-6 pb-4 border-b border-gold-300/20">
                <h3 className="font-serif text-2xl text-gold-100 font-bold mb-2">
                  {dayData.day}
                </h3>
                <p className="text-gold-300/80 font-semibold mb-1">{dayData.date}</p>
                <div className="flex items-center gap-2 text-gold-300/60 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{dayData.venue}</span>
                </div>
              </div>

              <div className="space-y-4">
                {dayData.events.map((ceremony, eventIndex) => (
                  <motion.div
                    key={eventIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (dayIndex * 0.1) + (eventIndex * 0.05) }}
                    className="bg-emerald-950/40 border border-gold-300/10 rounded-xl p-4 hover:border-gold-300/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 pt-1">
                        <div className="flex items-center gap-2 text-gold-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-gold-300 font-mono text-xs mt-1 whitespace-nowrap">
                          {ceremony.time}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-gold-100 font-semibold mb-1">
                          {ceremony.event}
                        </h4>
                        <p className="text-gold-300/70 text-sm leading-relaxed">
                          {ceremony.details}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
