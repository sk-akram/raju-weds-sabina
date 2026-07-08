import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Mail, MailOpen } from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface RoyalEnvelopeProps {
  onOpen: () => void;
  key?: string;
  themeId?: 'classic' | 'nikah' | 'walima';
}

export default function RoyalEnvelope({ onOpen, themeId = 'classic' }: RoyalEnvelopeProps) {
  const { data } = useWeddingData();
  const [isOpened, setIsOpened] = useState(false);

  const [flapOpened, setFlapOpened] = useState(false);
  const [cardSlidOut, setCardSlidOut] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; angle: number; speed: number }[]>([]);

  const triggerSparkles = () => {
    const newParticles = Array.from({ length: 32 }).map((_, i) => {
      const angle = (i * 11.25 * Math.PI) / 180;
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        scale: Math.random() * 0.9 + 0.35,
        angle,
        speed: Math.random() * 8 + 5,
      };
    });
    setParticles(newParticles);
  };

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    triggerSparkles();

    // Stage 1: Rotate top flap open with realistic 3D timing
    setTimeout(() => {
      setFlapOpened(true);
    }, 400);

    // Stage 2: Slide the gilded invitation card up out of the envelope
    // The top flap takes 1.1s to rotate (completing at 1500ms).
    // We wait until 1700ms (adding a 200ms elegant pause) before sliding the card up.
    setTimeout(() => {
      setCardSlidOut(true);
    }, 1700);

    // Stage 3: Fade out full envelope to reveal website
    // Allow the user ample time to appreciate the physical card sliding out
    setTimeout(() => {
      onOpen();
    }, 4600);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] overflow-hidden p-4 perspective-[1500px] transition-all duration-1000 theme-${themeId} ${
      themeId === 'nikah' 
        ? 'from-neutral-950 via-[#1c0407] to-neutral-950' 
        : themeId === 'walima' 
          ? 'from-neutral-950 via-[#040c1e] to-neutral-950' 
          : 'from-neutral-950 via-emerald-950 to-neutral-950'
    }`}>
      
      {/* Heavy textured luxury background backdrop */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(circle,_transparent_20%,_#000_100%),_url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

      {/* Atmospheric gold fairy light particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-tr from-gold-300 to-amber-400 rounded-full blur-[1.5px]"
            style={{
              width: Math.random() * 5 + 3 + 'px',
              height: Math.random() * 5 + 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: Math.random() * 8 + 7,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-xl flex flex-col items-center justify-center z-10">
        
        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isOpened ? { opacity: 0, y: -40, transition: { duration: 0.5 } } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-10 select-none"
        >
          <div className="text-gold-400/90 font-serif text-xl tracking-widest mb-2 font-medium">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto my-2" />
          <p className="text-[10px] font-mono tracking-[0.3em] text-gold-300/65 uppercase">
            S A C R E D   I N V I T A T I O N
          </p>
        </motion.div>

        {/* PHYSICAL ENVELOPE ASSEMBLY */}
        <motion.div
          initial={{ opacity: 1, scale: 0.88, rotateX: 15, y: 30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`relative w-full aspect-[1.4] bg-gradient-to-br rounded-3xl transition-all duration-1000 ${
            themeId === 'nikah'
              ? 'from-[#22070c] to-[#0a0103] border border-[#42121b]/40 shadow-[0_30px_70px_rgba(0,0,0,0.95),_inset_0_2px_4px_rgba(255,255,255,0.08)]'
              : themeId === 'walima'
                ? 'from-[#050914] to-[#010205] border border-[#1d2a45]/40 shadow-[0_30px_70px_rgba(0,0,0,0.95),_inset_0_2px_4px_rgba(255,255,255,0.08)]'
                : 'from-[#0b2119] to-[#030d09] border border-emerald-800/40 shadow-[0_30px_70px_rgba(0,0,0,0.9),_inset_0_2px_4px_rgba(255,255,255,0.1)]'
          } ${
            cardSlidOut ? 'scale-[0.93] translate-y-12 opacity-100 shadow-[0_15px_45px_rgba(0,0,0,0.8)]' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1200px',
          }}
        >
          {/* Subtle Paper Linen Overlay on Envelope */}
          <div className="absolute inset-0 opacity-[0.24] pointer-events-none rounded-3xl bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />

          {/* Deep physical pocket shadow cast from behind the card */}
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-black/45 z-[3] pointer-events-none rounded-b-3xl shadow-[inset_0_12px_24px_rgba(0,0,0,0.85)]" />

          {/* Luxurious Interior Gold Foil Lining Wallpaper (Visible once card slides up) */}
          <div className="absolute inset-2.5 rounded-[22px] overflow-hidden pointer-events-none z-[1] opacity-[0.22] mix-blend-screen">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='${
                  themeId === 'nikah' 
                    ? '%23e16d80' 
                    : themeId === 'walima' 
                      ? '%23c2ae95' 
                      : '%23cf9b3a'
                }' fill-opacity='0.65' stroke='${
                  themeId === 'nikah' 
                    ? '%23f3a4b0' 
                    : themeId === 'walima' 
                      ? '%23dfd5c6' 
                      : '%23e7ce90'
                }' stroke-width='1.2'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          {/* Golden Embossed Backplate Frame on Envelope */}
          <div className={`absolute inset-4 border-2 rounded-[20px] pointer-events-none z-[2] ${
            themeId === 'nikah' ? 'border-[#f3a4b0]/15' : themeId === 'walima' ? 'border-[#c2ae95]/15' : 'border-gold-400/15'
          }`} />
          <div className={`absolute inset-[18px] border rounded-[18px] pointer-events-none z-[2] ${
            themeId === 'nikah' ? 'border-[#f3a4b0]/5' : themeId === 'walima' ? 'border-[#c2ae95]/5' : 'border-gold-400/5'
          }`} />

          {/* GILDED PHYSICAL INVITATION CARD */}
          <motion.div
            initial={{ y: 35, scale: 0.96, rotateZ: 0 }}
            animate={
              cardSlidOut 
                ? { y: -165, scale: 1.05, rotateZ: -1 } 
                : { y: 35, scale: 0.96, rotateZ: 0 }
            }
            transition={{ type: 'spring', stiffness: 45, damping: 14 }}
            className={`absolute w-[92%] h-[92%] border-[5px] border-double rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden select-none pointer-events-none z-[12] ${
              themeId === 'nikah'
                ? 'bg-gradient-to-br from-[#fdfbf7] via-[#fdf7f8] to-[#fcf3f5] border-[#e16d80]'
                : themeId === 'walima'
                  ? 'bg-gradient-to-br from-[#fcfbfa] via-[#f9f7f4] to-[#f4f0e8] border-[#c2ae95]'
                  : 'bg-gradient-to-br from-neutral-50 via-amber-50/95 to-amber-50 border-gold-400'
            }`}
            style={{
              backgroundImage: `radial-gradient(circle_at_center, rgba(255,255,255,0.97) 0%, rgba(254,251,241,0.97) 100%), url('https://www.transparenttextures.com/patterns/handmade-paper.png')`,
              boxShadow: '0 20px 45px rgba(0,0,0,0.7), inset 0 0 1px 1.5px #fff, inset 0 0 35px rgba(212,175,55,0.06)',
            }}
          >
            {/* Elegant Inner Card Filigree and borders */}
            <div className={`absolute inset-2 border rounded-lg pointer-events-none ${
              themeId === 'nikah' ? 'border-[#e16d80]/25' : themeId === 'walima' ? 'border-[#c2ae95]/25' : 'border-gold-500/25'
            }`} />
            <div className={`absolute inset-3.5 border-[2px] rounded-md pointer-events-none ${
              themeId === 'nikah' ? 'border-[#e16d80]/10' : themeId === 'walima' ? 'border-[#c2ae95]/10' : 'border-gold-500/10'
            }`} />
            
            {/* Watermarked Center Medallion for luxurious physical look */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <svg className={`w-80 h-80 ${
                themeId === 'nikah' ? 'text-[#e16d80]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-amber-900'
              }`} viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 82C29.6 87 13 70.4 13 50S29.6 13 50 13s37 16.6 37 37-16.6 37-37 37z" />
                <path d="M50 19c-17.1 0-31 13.9-31 31s13.9 31 31 31 31-13.9 31-31-13.9-31-31-31zm0 54c-12.7 0-23-10.3-23-23s10.3-23 23-23 23 10.3 23 23-10.3 23-23 23z" />
                <path d="M50 29c-11.6 0-21 9.4-21 21s9.4 21 21 21 21-9.4 21-21-9.4-21-21-21zm0 34c-7.2 0-13-5.8-13-13s5.8-13 13-13 13 5.8 13 13-5.8 13-13 13z" />
                <path d="M50 37c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13-5.8-13-13-13zm0 18c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
              </svg>
            </div>

            {/* Corner flourishes on card using premium vector ornament stamps */}
            <svg className={`absolute top-4 left-4 w-10 h-10 pointer-events-none ${
              themeId === 'nikah' ? 'text-[#e16d80]/50' : themeId === 'walima' ? 'text-[#c2ae95]/50' : 'text-gold-500/60'
            }`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M 20 50 L 20 20 L 50 20" />
              <path d="M 28 42 L 28 28 L 42 28" opacity="0.5" />
              <circle cx="28" cy="28" r="2" fill="currentColor" />
            </svg>
            <svg className={`absolute top-4 right-4 w-10 h-10 rotate-90 pointer-events-none ${
              themeId === 'nikah' ? 'text-[#e16d80]/50' : themeId === 'walima' ? 'text-[#c2ae95]/50' : 'text-gold-500/60'
            }`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M 20 50 L 20 20 L 50 20" />
              <path d="M 28 42 L 28 28 L 42 28" opacity="0.5" />
              <circle cx="28" cy="28" r="2" fill="currentColor" />
            </svg>
            <svg className={`absolute bottom-4 left-4 w-10 h-10 -rotate-90 pointer-events-none ${
              themeId === 'nikah' ? 'text-[#e16d80]/50' : themeId === 'walima' ? 'text-[#c2ae95]/50' : 'text-gold-500/60'
            }`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M 20 50 L 20 20 L 50 20" />
              <path d="M 28 42 L 28 28 L 42 28" opacity="0.5" />
              <circle cx="28" cy="28" r="2" fill="currentColor" />
            </svg>
            <svg className={`absolute bottom-4 right-4 w-10 h-10 rotate-180 pointer-events-none ${
              themeId === 'nikah' ? 'text-[#e16d80]/50' : themeId === 'walima' ? 'text-[#c2ae95]/50' : 'text-gold-500/60'
            }`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M 20 50 L 20 20 L 50 20" />
              <path d="M 28 42 L 28 28 L 42 28" opacity="0.5" />
              <circle cx="28" cy="28" r="2" fill="currentColor" />
            </svg>

            <div className="text-center mt-4">
              <span className={`text-[9px] font-mono tracking-[0.3em] uppercase block font-bold ${
                themeId === 'nikah' ? 'text-[#8a9f95]' : themeId === 'walima' ? 'text-amber-900/60' : 'text-amber-900/60'
              }`}>
                UNDER THE GRACE OF ALMIGHTY
              </span>
              <span className={`text-[10px] font-serif italic block mt-1 ${
                themeId === 'nikah' ? 'text-[#e16d80]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-600'
              }`}>
                The Blessed Union Of
              </span>
              
              {/* Husband name */}
              <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-wide mt-3 ${
                themeId === 'nikah'
                  ? 'text-[#2d0a11]'
                  : themeId === 'walima'
                    ? 'text-[#10182b]'
                    : 'text-emerald-950'
              }`}
                style={{
                  textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.9), 0px 1px 1px rgba(0,0,0,0.15)'
                }}
              >
                {data.groom_name || 'Sk Raju'}
              </h2>
              
              <div className="flex items-center justify-center gap-3 my-2">
                <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent to-transparent ${
                  themeId === 'nikah' ? 'via-[#e16d80]' : themeId === 'walima' ? 'via-[#c2ae95]' : 'via-gold-500'
                }`} />
                <Heart size={14} className={`fill-current/25 animate-pulse ${
                  themeId === 'nikah' ? 'text-[#e16d80]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-500'
                }`} />
                <div className={`h-[1px] w-12 bg-gradient-to-l from-transparent to-transparent ${
                  themeId === 'nikah' ? 'via-[#e16d80]' : themeId === 'walima' ? 'via-[#c2ae95]' : 'via-gold-500'
                }`} />
              </div>
              
              {/* Wife name */}
              <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-wide ${
                themeId === 'nikah'
                  ? 'text-[#2d0a11]'
                  : themeId === 'walima'
                    ? 'text-[#10182b]'
                    : 'text-emerald-950'
              }`}
                style={{
                  textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.9), 0px 1px 1px rgba(0,0,0,0.15)'
                }}
              >
                {data.bride_name || 'Sabina Khatun'}
              </h2>
            </div>

            <div className="text-center mb-4 space-y-2">
              <div className="text-[11px] font-serif italic leading-relaxed max-w-xs mx-auto text-amber-900/80">
                "And among His signs is that He created for you mates from among yourselves that you may dwell in tranquility..."
                <span className={`block text-[9px] font-sans font-semibold mt-1 not-italic uppercase tracking-widest ${
                  themeId === 'nikah' ? 'text-[#e16d80]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-600'
                }`}>— Surah Ar-Rum 21</span>
              </div>
              <div className={`h-[1px] w-20 mx-auto ${
                themeId === 'nikah' ? 'bg-[#e16d80]/20' : themeId === 'walima' ? 'bg-[#c2ae95]/20' : 'bg-gold-500/20'
              }`} />
              <p className={`text-[10px] font-mono font-bold tracking-[0.25em] uppercase ${
                themeId === 'nikah' ? 'text-[#2d0a11]' : themeId === 'walima' ? 'text-[#10182b]' : 'text-emerald-900'
              }`}>
                {data.wedding_date || 'August 07, 2026'}
              </p>
              
              <div className={`inline-flex items-center gap-2 py-1 px-4 border rounded-full mt-2 shadow-md ${
                themeId === 'nikah'
                  ? 'bg-[#2d0a11] text-[#fdf4f5] border-[#f3a4b0]'
                  : themeId === 'walima'
                    ? 'bg-[#050914] text-[#dfd5c6] border-[#c2ae95]'
                    : 'bg-emerald-950 text-gold-300 border-gold-400'
              }`}>
                <Sparkles size={10} className="animate-spin-slow" />
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                  {themeId === 'nikah' ? 'NIKAH INVITATION' : themeId === 'walima' ? 'WALIMA INVITATION' : 'ROYAL INVITATION'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* LUXURIOUS FRONT POCKET PANEL (Sleeve design with realistic shadows and decorative gold foil) */}
          <div 
            className={`absolute bottom-0 left-0 w-full h-[65%] rounded-b-3xl border-t z-20 pointer-events-none shadow-[0_-8px_20px_rgba(0,0,0,0.45),_inset_0_1px_1px_rgba(255,255,255,0.15)] ${
              themeId === 'nikah'
                ? 'bg-gradient-to-br from-[#2f0a10] to-[#0c0103] border-t-[#f3a4b0]/25 border-x border-b border-[#2d0a11]/40'
                : themeId === 'walima'
                  ? 'bg-gradient-to-br from-[#0c1424] to-[#010308] border-t-[#c2ae95]/25 border-x border-b border-[#1d2a45]/40'
                  : 'bg-gradient-to-br from-[#0e2d22] to-[#030d09] border-t-gold-400/25 border-x border-b border-emerald-800/40'
            }`}
          >
            {/* Fine Linen Texture Layer on Pocket */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-[0.16] rounded-b-3xl" />
            
            {/* Elegant Embossed Metallic Border Frame */}
            <div className={`absolute inset-3 md:inset-4 border rounded-b-2xl pointer-events-none ${
              themeId === 'nikah' ? 'border-[#f3a4b0]/15' : themeId === 'walima' ? 'border-[#c2ae95]/15' : 'border-gold-400/15'
            }`} />
            <div className={`absolute inset-[15px] md:inset-[19px] border border-dashed rounded-b-xl pointer-events-none ${
              themeId === 'nikah' ? 'border-[#f3a4b0]/5' : themeId === 'walima' ? 'border-[#c2ae95]/5' : 'border-gold-400/5'
            }`} />

            {/* Corner Ornate Accents inside Pocket Frame */}
            <svg className={`absolute bottom-5 left-5 w-5 h-5 pointer-events-none opacity-40 ${
              themeId === 'nikah' ? 'text-[#f3a4b0]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-400'
            }`} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 0 40 L 0 10 C 0 5, 5 0, 10 0 L 40 0" strokeLinecap="round" transform="rotate(-90 20 20)" />
            </svg>
            <svg className={`absolute bottom-5 right-5 w-5 h-5 pointer-events-none opacity-40 ${
              themeId === 'nikah' ? 'text-[#f3a4b0]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-400'
            }`} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 0 40 L 0 10 C 0 5, 5 0, 10 0 L 40 0" strokeLinecap="round" transform="rotate(180 20 20)" />
            </svg>

            {/* A subtle gold foil monogram printed at the bottom of the envelope */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-35">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                themeId === 'nikah' ? 'border-[#f3a4b0]/30 text-[#f3a4b0]' : themeId === 'walima' ? 'border-[#c2ae95]/30 text-[#c2ae95]' : 'border-gold-400/30 text-gold-400'
              }`}>
                <span className="text-[10px] font-serif font-bold tracking-wider">R&S</span>
              </div>
              <span className={`text-[6px] font-mono tracking-[0.3em] uppercase mt-1.5 ${
                themeId === 'nikah' ? 'text-[#f3a4b0]' : themeId === 'walima' ? 'text-[#c2ae95]' : 'text-gold-400'
              }`}>
                MEMORIES
              </span>
            </div>
          </div>

          {/* TOP FLAP - SVG-based physical pointed flap with anti-aliased luxury borders */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={
              flapOpened 
                ? { rotateX: 180, zIndex: 1, filter: 'brightness(0.55) drop-shadow(0 -5px 8px rgba(0,0,0,0.3))' } 
                : { rotateX: 0, zIndex: 28, filter: 'brightness(1) drop-shadow(0 10px 15px rgba(0,0,0,0.4))' }
            }
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            style={{ 
              originY: '0%', 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
              width: '100%',
              height: '52%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="pointer-events-none"
          >
            <svg 
              viewBox="0 0 500 250" 
              className="w-full h-full overflow-visible drop-shadow-[0_2px_3px_rgba(255,255,255,0.06)]" 
              preserveAspectRatio="none"
            >
              <defs>
                {/* Gradients for different themes */}
                <linearGradient id="flapGradClassic" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f3428" />
                  <stop offset="100%" stopColor="#051510" />
                </linearGradient>
                <linearGradient id="flapGradNikah" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#44131d" />
                  <stop offset="100%" stopColor="#190408" />
                </linearGradient>
                <linearGradient id="flapGradWalima" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e2c48" />
                  <stop offset="100%" stopColor="#040916" />
                </linearGradient>

                {/* Gold gradients for borders */}
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cf9b3a" />
                  <stop offset="50%" stopColor="#fdf3e1" />
                  <stop offset="100%" stopColor="#b58732" />
                </linearGradient>
                <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e16d80" />
                  <stop offset="50%" stopColor="#fdf4f5" />
                  <stop offset="100%" stopColor="#b44b5c" />
                </linearGradient>
                <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c2ae95" />
                  <stop offset="50%" stopColor="#f5f0e8" />
                  <stop offset="100%" stopColor="#8c775d" />
                </linearGradient>

                {/* Paper linen pattern overlay inside SVG */}
                <pattern id="linenPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <image href="https://www.transparenttextures.com/patterns/black-linen.png" width="100" height="100" opacity="0.14" />
                </pattern>
              </defs>

              {/* Main Pointed Flap Shape with a gorgeous, slightly rounded tip */}
              <path 
                d="M 0 0 L 500 0 L 270 230 C 260 240 240 240 230 230 L 0 0 Z" 
                fill={
                  themeId === 'nikah' 
                    ? 'url(#flapGradNikah)' 
                    : themeId === 'walima' 
                      ? 'url(#flapGradWalima)' 
                      : 'url(#flapGradClassic)'
                } 
              />

              {/* Linen pattern overlay path */}
              <path 
                d="M 0 0 L 500 0 L 270 230 C 260 240 240 240 230 230 L 0 0 Z" 
                fill="url(#linenPattern)" 
                style={{ mixBlendMode: 'overlay' }}
              />

              {/* Outer Gold foil decorative line matching the shape exactly */}
              <path 
                d="M 12 4 L 488 4 L 264 214 C 257 221 243 221 236 214 L 12 4" 
                fill="none" 
                stroke={
                  themeId === 'nikah' 
                    ? 'url(#roseGoldGrad)' 
                    : themeId === 'walima' 
                      ? 'url(#silverGrad)' 
                      : 'url(#goldGrad)'
                } 
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Inner delicate dashed gold line */}
              <path 
                d="M 22 4 L 478 4 L 261 201 C 255 206 245 206 239 201 L 22 4" 
                fill="none" 
                stroke={
                  themeId === 'nikah' 
                    ? 'url(#roseGoldGrad)' 
                    : themeId === 'walima' 
                      ? 'url(#silverGrad)' 
                      : 'url(#goldGrad)'
                } 
                strokeWidth="0.8"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            </svg>
          </motion.div>

          {/* WAX SEAL STAMP BUTTON - Genuine hand poured irregular physical wax look */}
          <AnimatePresence>
            {!isOpened && (
              <motion.button
                onClick={handleOpen}
                exit={{ scale: 0, opacity: 0, rotate: -45, transition: { duration: 0.5 } }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.06, rotate: 2 }}
                whileTap={{ scale: 0.94 }}
                className="absolute z-35 w-26 h-26 flex items-center justify-center cursor-pointer group focus:outline-none"
                style={{
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  // Irregular biological shape like squeezed real wax
                  borderRadius: '43% 57% 48% 52% / 48% 46% 54% 52%',
                  background: themeId === 'nikah'
                    ? 'radial-gradient(circle_at_35% 35%, #fdbdc7 0%, #d43f5e 50%, #5c0617 100%)'
                    : themeId === 'walima'
                      ? 'radial-gradient(circle_at_35% 35%, #e1d3c1 0%, #a38c72 50%, #2f1b18 100%)'
                      : 'radial-gradient(circle_at_35% 35%, #ffeaa7 0%, #dbb362 50%, #5d3f0a 100%)',
                  boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.45), inset -3px -3px 8px rgba(0, 0, 0, 0.6), 0 12px 30px rgba(0,0,0,0.65)',
                }}
              >
                {/* Glossy liquid glaze reflection layer on the wax */}
                <div 
                  className="absolute inset-1 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none" 
                  style={{ borderRadius: '43% 57% 48% 52% / 48% 46% 54% 52%' }}
                />

                {/* Inner Wax Ring Rim */}
                <div 
                  className="absolute w-[76%] h-[76%] border-2 border-amber-950/20 bg-amber-800/20"
                  style={{
                    borderRadius: '45% 55% 46% 54% / 48% 48% 52% 52%',
                    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.6), 1px 1px 2px rgba(255,255,255,0.25)'
                  }}
                />

                {/* Inner Crest calligraphy details */}
                <div className="relative flex flex-col items-center justify-center text-center">
                  <Heart className="w-5 h-5 text-amber-100 fill-amber-100/15 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]" />
                  <span className="text-[10px] font-serif text-amber-50 font-bold tracking-[0.15em] mt-0.5 filter drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
                    R & S
                  </span>
                  <span className="text-[6px] font-mono text-amber-200/90 font-semibold tracking-widest uppercase mt-1 animate-pulse filter drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
                    OPEN
                  </span>
                </div>

                {/* Pulsing golden aura back glow behind wax */}
                <div className="absolute inset-0 -z-10 rounded-full bg-gold-400/10 blur-md scale-105 group-hover:scale-115 transition-transform duration-500 animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Sparkly dynamic burst particles upon cracking wax seal */}
          <div className="absolute left-1/2 top-1/2 w-0 h-0 z-40 pointer-events-none">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                animate={{
                  x: Math.cos(p.angle) * p.speed * 25,
                  y: Math.sin(p.angle) * p.speed * 25,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
                style={{
                  background: themeId === 'nikah'
                    ? 'linear-gradient(to right, #fdf4f5, #f3a4b0, #e16d80)'
                    : themeId === 'walima'
                      ? 'linear-gradient(to right, #f5f0e8, #c2ae95, #3a221d)'
                      : 'linear-gradient(to right, #faf3e1, #dbb362, #9d6425)',
                  boxShadow: themeId === 'nikah'
                    ? '0 0 10px #f3a4b0, 0 0 20px #e16d80'
                    : themeId === 'walima'
                      ? '0 0 10px #c2ae95, 0 0 20px #c2ae95'
                      : '0 0 10px #dbb362, 0 0 20px #cf9b3a',
                }}
              />
            ))}
          </div>

        </motion.div>

        {/* Envelope Touch Guidance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isOpened ? { opacity: 0 } : { opacity: 0.8 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex items-center gap-2.5 text-gold-400/85 text-xs font-mono"
        >
          <Mail size={14} className="animate-bounce text-gold-400" />
          <span>Press the physical Amber Wax Seal to unbox your invitation</span>
        </motion.div>

        {/* Cinematic Unfolding States */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-14 text-center flex flex-col items-center gap-2.5"
            >
              <div className="flex items-center gap-2 text-xs text-gold-300 font-mono">
                <MailOpen size={13} className="text-gold-400 animate-pulse" />
                <span>Presenting the Gilded Card...</span>
              </div>
              {/* Deluxe Golden progress slider bar */}
              <div className="w-56 h-1 bg-emerald-950 rounded-full overflow-hidden border border-gold-400/20 shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 shadow-[0_0_8px_#ffd700]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
