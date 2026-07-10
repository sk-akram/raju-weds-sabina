/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Download, Sparkles } from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  showNikah?: boolean;
}

export default function CountdownTimer({ showNikah = true }: CountdownTimerProps) {
  const { data } = useWeddingData();

  // Strip "Friday, " or other weekdays and append time for standard date parsing
  const getParsedDate = () => {
    if (data.wedding_date) {
      try {
        const cleanDateStr = data.wedding_date.replace(/^[a-zA-Z]+,\s*/, '') + (showNikah ? ' 17:30:00' : ' 12:00:00');
        const parsed = new Date(cleanDateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch (e) {
        console.warn('Could not parse wedding date from context:', e);
      }
    }
    return showNikah ? new Date('2026-08-07T17:30:00+05:30') : new Date('2026-08-08T12:00:00+05:30');
  };

  const targetDate = getParsedDate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCompleted, setIsCompleted] = useState(false);


  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsCompleted(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDownloadICS = () => {
    const nikahEvent = showNikah ? [
      'BEGIN:VEVENT',
      'UID:raju-sabina-wedding-2026',
      'DTSTAMP:20260624T120000Z',
      'DTSTART:20260807T120000Z', // 5:30 PM IST is 12:00 PM UTC
      'DTEND:20260807T130000Z',
      'SUMMARY:Nikah Ceremony - Sk Raju & Sabina Khatun',
      'DESCRIPTION:You are cordially invited to witness and celebrate the sacred union (Nikah) of Sk Raju and Sabina Khatun at Gulmohar Garden, Hooghly.',
      'LOCATION:Gulmohar Garden, Hooghly, West Bengal, India',
      'SEQUENCE:0',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ] : [];

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Raju and Sabina Wedding//Digital Invitation//EN',
      ...nikahEvent,
      'BEGIN:VEVENT',
      'UID:raju-sabina-walima-2026',
      'DTSTAMP:20260624T120000Z',
      'DTSTART:20260808T063000Z', // Walima Reception Aug 8, 2026, 12:00 PM IST is 6:30 AM UTC
      'DTEND:20260808T093000Z',
      'SUMMARY:Walima Reception - Sk Raju & Sabina Khatun',
      'DESCRIPTION:Join us for the joyous Walima wedding reception of Sk Raju and Sabina Khatun at Gulmohar Garden, Pairagachha, Dankuni.',
      'LOCATION:Gulmohar Garden, Pairagachha, Dankuni, West Bengal 712304',
      'SEQUENCE:0',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'raju_sabina_wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGoogleCalendarLink = () => {
    if (showNikah) {
      // August 7, 2026, 5:30 PM IST to 6:30 PM IST
      const start = '20260807T120000Z';
      const end = '20260807T130000Z';
      const title = encodeURIComponent('Nikah Ceremony - Sk Raju & Sabina');
      const details = encodeURIComponent('You are cordially invited to celebrate the Nikah of Sk Raju & Sabina Khatun at Gulmohar Garden, Hooghly.');
      const location = encodeURIComponent('Gulmohar Garden, Hooghly, West Bengal, India');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    } else {
      // August 8, 2026, 12:00 PM IST to 3:30 PM IST
      const start = '20260808T063000Z';
      const end = '20260808T093000Z';
      const title = encodeURIComponent('Walima Reception - Sk Raju & Sabina');
      const details = encodeURIComponent('Join us for the joyous Walima wedding reception of Sk Raju and Sabina Khatun at Gulmohar Garden, Pairagachha, Dankuni.');
      const location = encodeURIComponent('Gulmohar Garden, Pairagachha, Dankuni, West Bengal 712304');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    }
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const timerItems = [
    { 
      label: 'Days', 
      value: timeLeft.days, 
      max: 100, 
      progress: Math.min(timeLeft.days, 100) / 100 
    },
    { 
      label: 'Hours', 
      value: timeLeft.hours, 
      max: 24, 
      progress: timeLeft.hours / 24 
    },
    { 
      label: 'Minutes', 
      value: timeLeft.minutes, 
      max: 60, 
      progress: timeLeft.minutes / 60 
    },
    { 
      label: 'Seconds', 
      value: timeLeft.seconds, 
      max: 60, 
      progress: timeLeft.seconds / 60 
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-emerald-950/50 border border-gold-300/30 rounded-3xl backdrop-blur-lg shadow-2xl relative overflow-hidden max-w-3xl mx-auto">
      {/* Invisible SVG for reusable gold gradients */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="gold-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f3e5ab" />
            <stop offset="100%" stopColor="#aa7c11" />
          </linearGradient>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Elegant background lighting accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative Ornate Corner Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold-400/30 rounded-tl-2xl m-3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-gold-400/30 rounded-tr-2xl m-3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-gold-400/30 rounded-bl-2xl m-3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold-400/30 rounded-br-2xl m-3 pointer-events-none" />

      {/* Subtle outer geometric trim */}
      <div className="absolute inset-1.5 border border-gold-400/10 rounded-[22px] pointer-events-none" />

      <div className="flex items-center gap-2 text-gold-400 text-xs font-mono uppercase tracking-[0.2em] mb-6 relative z-10">
        <Sparkles size={14} className="animate-pulse text-gold-400" />
        <span>Countdown to the Blessed Day</span>
        <Sparkles size={14} className="animate-pulse text-gold-400" />
      </div>

      {isCompleted ? (
        <h3 className="text-2xl md:text-3xl font-serif text-gold-100 text-center py-6 leading-relaxed relative z-10">
          The Blessed Day has Arrived!<br />
          <span className="text-xl text-gold-300 font-cursive text-3xl mt-2 block">Barakallahu lakum wa baraka 'alaykum</span>
        </h3>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 w-full px-2 py-4 relative z-10">
          {timerItems.map((item, index) => {
            const strokeOffset = circumference - (item.progress * circumference);
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center justify-center relative group"
              >
                {/* SVG Dial Ring */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Track ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke="rgba(212, 175, 55, 0.08)"
                      strokeWidth="3.5"
                    />
                    
                    {/* Active progress ring */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke="url(#gold-ring-gradient)"
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                      style={{ filter: "url(#gold-glow)" }}
                    />
                  </svg>

                  {/* Centered Numbers */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl md:text-4xl font-serif font-bold text-gold-100 tracking-tight leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-gold-400 mt-1">
                      {item.label}
                    </span>
                  </div>

                  {/* Pulsing glow ring on hover */}
                  <div className="absolute inset-0 rounded-full border border-gold-400/0 group-hover:border-gold-400/25 group-hover:scale-105 transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full px-4 justify-center relative z-10">
        <a
          href={getGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-emerald-950 font-serif font-semibold px-6 py-3 rounded-full transition-all text-xs sm:text-sm shadow-xl cursor-pointer hover:shadow-gold-500/20 hover:scale-[1.02]"
          id="add-to-google-cal"
        >
          <Calendar size={16} />
          <span>Add to Google Calendar</span>
        </a>

        <button
          onClick={handleDownloadICS}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-950 border border-gold-300/40 text-gold-100 hover:text-white font-serif font-semibold px-6 py-3 rounded-full transition-all text-xs sm:text-sm shadow-md cursor-pointer hover:scale-[1.02]"
          id="download-ical"
        >
          <Download size={16} />
          <span>Download Apple/iCal Event</span>
        </button>
      </div>

      <div className="text-xs text-center text-gold-300/60 font-serif italic mt-6 max-w-md relative z-10">
        {showNikah
          ? "Insha'Allah on Friday, August 7, 2026 at 5:30 PM — Nikah Ceremony at Gulmohar Garden."
          : "Insha'Allah on Saturday, August 8, 2026 at 12:00 PM — Walima Reception at Gulmohar Garden."
        }
      </div>
    </div>
  );
}
