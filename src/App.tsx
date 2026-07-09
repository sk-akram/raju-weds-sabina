/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Clock, Calendar, Heart, MessageCircle, ChevronDown, Award, Mail } from 'lucide-react';
import FloralBackground from './components/FloralBackground';
import AudioPlayer from './components/AudioPlayer';
import CountdownTimer from './components/CountdownTimer';
import VenueMap from './components/VenueMap';
import RSVPForm from './components/RSVPForm';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Storyline from './components/Storyline';
import ScratchCard from './components/ScratchCard';
import RoyalEnvelope from './components/RoyalEnvelope';
import ThemeSwitcher, { THEMES } from './components/ThemeSwitcher';
import WeddingDaySchedule from './components/WeddingDaySchedule';
import { WeddingDataProvider, useWeddingData } from './lib/WeddingDataContext';

function WeddingApp({ showNikah = true }: { showNikah?: boolean }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [themeId, setThemeId] = useState<'nikah' | 'walima'>(showNikah ? 'nikah' : 'walima');
  const { data } = useWeddingData();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8 }
  };

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const themeVariables = {
    '--color-emerald-950': currentTheme.colors.emerald950,
    '--color-emerald-900': currentTheme.colors.emerald900,
    '--color-emerald-800': currentTheme.colors.emerald800,
    '--color-gold-500': currentTheme.colors.gold500,
    '--color-gold-400': currentTheme.colors.gold400,
    '--color-gold-300': currentTheme.colors.gold300,
    '--color-gold-100': currentTheme.colors.gold100,
  } as React.CSSProperties;

  return (
    <div 
      style={themeVariables}
      className={`min-h-screen bg-emerald-950 text-gold-100 overflow-x-hidden selection:bg-gold-500 selection:text-emerald-950 font-sans relative transition-colors duration-1000 theme-${themeId}`}
    >
      <AnimatePresence mode="wait">
        {!envelopeOpen ? (
          <RoyalEnvelope key="envelope" onOpen={() => setEnvelopeOpen(true)} themeId={themeId} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            {/* Dynamic Animated Floral Ambiance & Audio Player */}
            <FloralBackground themeId={themeId} />
            <AudioPlayer />

      {/* SECTION 1: HERO COVER (VERTICAL WELCOME STAGE) */}
      <section className="min-h-screen flex flex-col justify-between items-center py-10 px-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-emerald-950 to-emerald-950">
        
        {/* Faded Background Art Layer */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img 
            src="/src/assets/images/wedding_hero_backdrop_1782331025471.jpg"
            alt="Wedding Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain scale-102"
          />
        </div>

        {/* Top Header - Bismillah and Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="z-10 w-full max-w-xl text-center mt-6"
        >
          <div className="text-gold-400 font-serif text-xl md:text-3xl tracking-normal mb-2 leading-relaxed">
            {data.bismillah_text}
          </div>
          <p className="text-[10px] md:text-xs font-serif italic text-gold-300/70 tracking-widest uppercase">
            {data.bismillah_translation}
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Central Card - Bride & Groom names */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="z-10 text-center max-w-2xl px-6 py-12 md:py-16 bg-emerald-950/80 border-2 border-gold-300/30 rounded-3xl shadow-2xl backdrop-blur-md relative"
        >
          {/* Decorative Internal Border */}
          <div className="absolute inset-2 border border-gold-300/10 rounded-2xl pointer-events-none" />
          <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-gold-400/40 rounded-tl-md" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-gold-400/40 rounded-tr-md" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-gold-400/40 rounded-bl-md" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-gold-400/40 rounded-br-md" />

          <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-gold-400 uppercase">
            The Wedding Invitation
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gold-100 tracking-wide mt-6 mb-2 leading-tight">
            {data.groom_name}
          </h1>
          <span className="text-3xl md:text-4xl font-cursive text-gold-400 block my-2">
            &
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gold-100 tracking-wide mb-6 leading-tight">
            {data.bride_name}
          </h1>

          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent mx-auto" />

          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="text-xs font-mono text-gold-300 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} className="text-gold-400" />
              August 5 – 8, 2026
            </span>
            <span className="text-xs font-sans text-gold-300/80 mt-1 flex items-center gap-1.5 justify-center">
              <MapPin size={12} className="text-gold-400" />
              Gulmohar Garden, Pairagachha, Dankuni
            </span>
          </div>
        </motion.div>

        {/* Bottom Scroll Cue */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="z-10 text-center flex flex-col items-center gap-1.5 mb-2"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400/70">
            Scroll to explore invitation
          </span>
          <ChevronDown size={18} className="text-gold-400" />
        </motion.div>

      </section>

      {/* Dynamic Theme Orchestrator */}
      <ThemeSwitcher currentThemeId={themeId} onThemeChange={setThemeId} showNikah={showNikah} />

      {/* SECTION 2: QURANIC VERSE & COUPLE PRESENTATION */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-gold-400/40 to-transparent" />

        {/* Quranic Verse Block */}
        <motion.div 
          {...fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-gold-300 font-serif text-lg md:text-xl leading-relaxed italic mb-2">
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
          </p>
          <p className="text-gold-300/80 font-serif text-base md:text-lg leading-relaxed italic mb-4">
            "And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them; and He has put love and mercy between your hearts."
          </p>
          <span className="text-xs font-mono text-gold-400 tracking-widest uppercase">
            — Surah Ar-Rum [30:21]
          </span>
          <div className="flex justify-center gap-2 mt-6">
            <Heart size={14} className="text-gold-400 fill-gold-400" />
            <Heart size={18} className="text-gold-500 fill-gold-500 animate-pulse" />
            <Heart size={14} className="text-gold-400 fill-gold-400" />
          </div>
        </motion.div>

        {/* Couples Profile Frame */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Couple Portrait Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 flex justify-center"
          >
            {/* Custom double gold frame */}
            <div className="relative p-2.5 bg-emerald-950 border-2 border-gold-400 rounded-3xl shadow-2xl max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-1 border border-gold-300/35 rounded-2xl pointer-events-none" />
              <img
                src="https://lh3.googleusercontent.com/d/14yYPn8ENKZFoWAqdUp2hokID8IR6Re3s"
                alt="Sk Raju and Sabina Khatun"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-2xl object-contain aspect-3/4 shadow-inner"
              />
              <div className="absolute -bottom-4 -right-4 bg-emerald-900 border border-gold-300 text-gold-100 py-1.5 px-3 rounded-xl text-xs font-serif font-semibold shadow-xl">
                💍 Safar-e-Ishq
              </div>
            </div>
          </motion.div>

          {/* Couples Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 space-y-6 text-center md:text-left"
          >
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block">
              Meet the Bride & Groom
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide">
              The Journey of Love
            </h2>
            <div className="text-sm text-gold-200/90 leading-relaxed font-sans space-y-3">
              <p className="text-center text-lg md:text-xl text-gold-400 font-serif">﷽</p>
              <p>With gratitude to Allah, we are blessed to begin the most beautiful chapter of our lives together.</p>
              {showNikah ? (
                <p>We warmly invite you to join us as we celebrate our Nikah. Your presence, love, and heartfelt duas will make our day truly special as we begin this journey of faith, companionship, and forever.</p>
              ) : (
                <p>We warmly invite you to join us for the Walima reception. Your presence, love, and heartfelt duas will make our celebration truly special.</p>
              )}
              <p>We would be honored to celebrate this blessed occasion with you</p>
              <p className="text-gold-400 font-serif italic">In Sha Allah</p>
              <p className="text-gold-300 font-semibold">Sabina with Raju</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
              <div className="p-4 bg-emerald-900/30 border border-gold-300/10 rounded-2xl relative group hover:border-gold-300/40 transition-colors">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">The Groom</span>
                <h4 className="text-lg font-serif font-bold text-gold-100">Sk Raju</h4>
                <p className="text-xs text-gold-200/70 mt-1">Son of Sk Rajob Ali & Mrs. Luthfa Nesa Begam</p>
                <div className="absolute top-2 right-2 text-gold-500/10 group-hover:text-gold-500/20 text-3xl font-display font-semibold transition-colors">G</div>
              </div>

              <div className="p-4 bg-emerald-900/30 border border-gold-300/10 rounded-2xl relative group hover:border-gold-300/40 transition-colors">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">The Bride</span>
                <h4 className="text-lg font-serif font-bold text-gold-100">Sabina Khatun</h4>
                <p className="text-xs text-gold-200/70 mt-1">Daughter of Mr. Saifullah Mohmad & Mrs. Alima Begum</p>
                <div className="absolute top-2 right-2 text-gold-500/10 group-hover:text-gold-500/20 text-3xl font-display font-semibold transition-colors">B</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE STORY TIMELINE */}
      <section className="py-16 px-4 md:px-8 bg-emerald-950/20 border-t border-gold-300/10">
        <Storyline />
      </section>

      {/* SECTION 3: COUNTDOWN TIMERS */}
      <section className="py-16 px-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 via-emerald-950/80 to-emerald-950">
        <div className="max-w-6xl mx-auto">
          <CountdownTimer showNikah={showNikah} />
        </div>
      </section>

      {/* SECTION 4: CEREMONY SCHEDULE */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto relative" id="schedule">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">Ceremony Schedule</span>
          <h2 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide mt-1">{showNikah ? 'Nikah & Walima' : 'Walima Reception'}</h2>
          <div className="h-[1px] w-24 bg-gold-400/30 mx-auto mt-4" />
        </div>

        <div className={`grid gap-8 items-stretch ${showNikah ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          
          {/* NIKAH CARD - Only shown when showNikah is true */}
          {showNikah && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col bg-emerald-950/60 border border-gold-300/20 rounded-3xl overflow-hidden shadow-2xl relative group hover:border-gold-300/50 transition-colors"
            >
              {/* Image banner */}
              <div className="h-52 md:h-60 relative overflow-hidden">
                <img
                  src={data['nikah_theme_image'] || '/src/assets/images/nikah_stage_1782331038747.jpg'}
                  alt="Nikah Ceremony Venue"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent" />
                <div className="absolute top-4 left-4 bg-gold-500 text-emerald-950 py-1 px-3 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold">
                  The Holy Union
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-gold-100 font-semibold mb-2">Nikah Ceremony</h3>
                  <p className="text-xs text-gold-200/80 leading-relaxed font-sans mb-6">
                    The sacred covenant signing under Islamic law, sealing our companionship with Allah's eternal blessings. Accompanied by a traditional feast.
                  </p>

                  {/* Details list */}
                  <div className="space-y-3.5 font-sans mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] text-gold-400 block font-mono">Date</span>
                        <span className="text-xs text-gold-100 font-semibold">Friday, August 7, 2026</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <Clock size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] text-gold-400 block font-mono">Timing</span>
                        <span className="text-xs text-gold-100 font-semibold">5:30 PM IST</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] text-gold-400 block font-mono">Place</span>
                        <span className="text-xs text-gold-100 font-semibold">Gulmohar Garden, Hooghly</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <Award size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] text-gold-400 block font-mono">Host</span>
                        <span className="text-xs text-gold-100 font-semibold">Both Families</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Islamic Quote inside card */}
                <div className="pt-4 border-t border-gold-300/10 text-center font-serif italic text-xs text-gold-400">
                  "Barakallahu Laka Wa Baraka 'Alayka..."
                </div>
              </div>
            </motion.div>
          )}

          {/* WALIMA CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col bg-emerald-950/60 border border-gold-300/20 rounded-3xl overflow-hidden shadow-2xl relative group hover:border-gold-300/50 transition-colors"
          >
            {/* Image banner */}
            <div className="h-52 md:h-60 relative overflow-hidden">
              <img
                src={data['walima_theme_image'] || '/src/assets/images/walima_banquet_1782331057014.jpg'}
                alt="Walima Reception Banquet"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent" />
              <div className="absolute top-4 left-4 bg-gold-500 text-emerald-950 py-1 px-3 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold">
                The Festive Dinner
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif text-gold-100 font-semibold mb-2">Walima Reception</h3>
                <p className="text-xs text-gold-200/80 leading-relaxed font-sans mb-6">
                  The celebratory dinner banquet hosted by the groom's family to share our gratitude and celebrate our lifelong union with dearest family and friends.
                </p>

                {/* Details list */}
                <div className="space-y-3.5 font-sans mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gold-400 block font-mono">Date</span>
                      <span className="text-xs text-gold-100 font-semibold">Saturday, August 8, 2026</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <Clock size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gold-400 block font-mono">Timing</span>
                      <span className="text-xs text-gold-100 font-semibold">12:00 PM IST onwards</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gold-400 block font-mono">Place</span>
                      <span className="text-xs text-gold-100 font-semibold">Gulmohar Garden, Pairagachha, Dankuni</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <Award size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gold-400 block font-mono">Host</span>
                      <span className="text-xs text-gold-100 font-semibold">Family of Sk Raju</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Islamic Quote inside card */}
              <div className="pt-4 border-t border-gold-300/10 text-center font-serif italic text-xs text-gold-400">
                Host: Family of Sk Raju
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 5: INTERACTIVE VENUE MAP */}
      <section className="py-20 px-4 md:px-8 bg-emerald-950/30 border-y border-gold-300/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">Venue Navigation</span>
            <h2 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide mt-1">Wedding Venues</h2>
            <p className="text-xs text-gold-200/60 font-sans max-w-sm mx-auto mt-2">
              Multiple venues across Pandua, Hooghly for the 4-day celebration. Select a venue to view location details.
            </p>
            <div className="h-[1px] w-24 bg-gold-400/30 mx-auto mt-4" />
          </div>

          <VenueMap showNikah={showNikah} />
        </div>
      </section>

      {/* SECTION 6: RESPONSIVE GALLERY */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto" id="gallery">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">Visual Album</span>
          <h2 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide mt-1">Wedding Gallery</h2>
          <div className="h-[1px] w-24 bg-gold-400/30 mx-auto mt-4" />
        </div>

        <Gallery showNikah={showNikah} />
      </section>

      {/* INTERACTIVE BLESSING SCRATCH CARDS */}
      <section className="py-20 px-4 md:px-8 bg-emerald-950/20 border-t border-gold-300/10">
        <ScratchCard />
      </section>

      {/* SECTION 7: RSVP REGISTRATION */}
      <section className="py-20 px-4 md:px-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/60 via-emerald-950 to-emerald-950 border-t border-gold-300/10" id="rsvp">
        <div className="max-w-4xl mx-auto">
          <RSVPForm showNikah={showNikah} />
        </div>
      </section>

      {/* SECTION 8: GUESTBOOK wishes & prayers */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto border-t border-gold-300/10" id="guestbook">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">Share Your Prayers</span>
          <h2 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide mt-1">Blessings Guestbook</h2>
          <p className="text-xs text-gold-200/60 font-sans max-w-sm mx-auto mt-2">
            Leave a beautiful prayer (Dua) or message of congratulation for Sk Raju & Sabina.
          </p>
          <div className="h-[1px] w-24 bg-gold-400/30 mx-auto mt-4" />
        </div>

        <Guestbook />
      </section>

      {/* FOOTER */}
      <footer className="bg-emerald-950 border-t border-gold-300/20 py-12 px-4 relative overflow-hidden text-center text-gold-200/80 font-sans text-xs">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h3 className="font-display text-lg text-gold-300 tracking-widest uppercase">{data.groom_name} & {data.bride_name}</h3>
          
          <p className="font-cursive text-3xl text-gold-400 my-1">
            Shukran Jazeelan
          </p>
          
          <p className="max-w-md leading-relaxed text-[11px] text-gold-300/60">
            "And He has put love and mercy between your hearts." Thank you from the depths of our hearts for your prayers, warmth, and beautiful greetings on this sacred chapter of our lives.
          </p>
          
          <div className="h-[1px] w-24 bg-gold-300/15" />
          
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400/50">
            <Award size={10} className="text-gold-500 animate-spin-slow" />
            <span>{showNikah ? 'Witness our blessed Nikah in 2026' : 'Join us for the Walima celebration in 2026'}</span>
          </div>

          <div className="h-[1px] w-24 bg-gold-300/15 mt-2" />

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gold-400/40">
            <span>Created by</span>
            <a
              href="https://www.linkedin.com/in/skakram1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors underline"
            >
              Akram
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON: REPLAY ROYAL ENVELOPE */}
      <button
        onClick={() => setEnvelopeOpen(false)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-300 text-emerald-950 font-semibold p-3.5 rounded-full shadow-[0_4px_15px_rgba(207,155,58,0.3)] transition-all duration-300 hover:scale-108 focus:outline-none flex items-center gap-2 group"
        title="View Royal Envelope Invitation"
      >
        <Mail size={16} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-mono uppercase tracking-wider max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
          Envelope Invite
        </span>
      </button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <WeddingDataProvider>
      <Routes>
        <Route path="/" element={<WeddingApp showNikah={true} />} />
        <Route path="/walima" element={<WeddingApp showNikah={false} />} />
        <Route path="/schedule" element={<WeddingDaySchedule />} />
      </Routes>
    </WeddingDataProvider>
  );
}

