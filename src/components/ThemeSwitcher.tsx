import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Check, Compass } from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface WeddingTheme {
  id: 'nikah' | 'walima';
  name: string;
  arabicName: string;
  tagline: string;
  swatches: { name: string; hex: string }[];
  colors: {
    emerald950: string;
    emerald900: string;
    emerald800: string;
    gold500: string;
    gold400: string;
    gold300: string;
    gold100: string;
  };
}

export const THEMES: WeddingTheme[] = [
  {
    id: 'nikah',
    name: 'Blushing Nikah',
    arabicName: 'النكاح المبارك',
    tagline: 'Deep Burgundy, Royal Blue & Rose Blush — Warm Romance',
    swatches: [
      { name: 'Deep Burgundy', hex: '#2d0a11' },
      { name: 'Royal Blue', hex: '#1e3a8a' },
      { name: 'Blush Pink', hex: '#f3a4b0' },
      { name: 'Cream Ivory', hex: '#fdf4f5' }
    ],
    colors: {
      emerald950: '#2d0a11',
      emerald900: '#4a151f',
      emerald800: '#63202f',
      gold500: '#f3a4b0',
      gold400: '#ffc0ce',
      gold300: '#e8d5e0',
      gold100: '#fff5f6',
    }
  },
  {
    id: 'walima',
    name: 'Walima Chic',
    arabicName: 'وليمة العرس',
    tagline: 'Deep Navy Blue, Royal Blue & Silver — Modern Luxury',
    swatches: [
      { name: 'Navy Blue', hex: '#050914' },
      { name: 'Royal Blue', hex: '#1e3a8a' },
      { name: 'Silver', hex: '#c2ae95' },
      { name: 'Light Blue', hex: '#60a5fa' }
    ],
    colors: {
      emerald950: '#050914',
      emerald900: '#1e3a8a',
      emerald800: '#3b82f6',
      gold500: '#e8d5b7',
      gold400: '#f0e6d3',
      gold300: '#f7f0e6',
      gold100: '#faf8f5',
    }
  }
];

interface ThemeSwitcherProps {
  currentThemeId: 'nikah' | 'walima';
  onThemeChange: (id: 'nikah' | 'walima') => void;
  showNikah?: boolean;
}

export default function ThemeSwitcher({ currentThemeId, onThemeChange, showNikah = true }: ThemeSwitcherProps) {
  const { data } = useWeddingData();
  // Filter themes based on showNikah prop
  const availableThemes = showNikah ? THEMES : THEMES.filter(t => t.id === 'walima');
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8 z-20">
      
      {/* Decorative Gold Filigree Border Box */}
      <div className="relative p-6 md:p-8 bg-emerald-950/40 border border-gold-400/20 rounded-3xl shadow-3xl backdrop-blur-md overflow-hidden">
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        {/* Framing borders */}
        <div className="absolute inset-2.5 border border-gold-400/10 rounded-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          
          {/* Theme text / introductory statement */}
          <div className="text-center md:text-left space-y-2 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Compass size={16} className="text-gold-400 animate-spin-slow" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 uppercase">
                Ceremony Experience Deck
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-gold-100 font-bold tracking-wide">
              Customize Atmosphere
            </h3>
            <p className="text-xs text-gold-200/80 leading-relaxed font-sans">
              Experience the digital invitation in the official color palettes selected for our main wedding events.
            </p>
          </div>

          {/* Interactive Button Group */}
          <div className={`grid gap-4 w-full md:w-auto flex-1 max-w-2xl ${showNikah ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {availableThemes.map((t) => {
              const isActive = t.id === currentThemeId;
              return (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id)}
                  className={`relative p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-500 cursor-pointer focus:outline-none overflow-hidden group ${
                    isActive
                      ? 'border-gold-400 bg-emerald-900/40 shadow-[0_10px_25px_rgba(207,155,58,0.15)] scale-[1.03]'
                      : 'border-gold-400/10 bg-emerald-950/20 hover:border-gold-400/35 hover:bg-emerald-900/10'
                  }`}
                >
                  {/* Selected Active Glow Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 to-transparent pointer-events-none"
                    />
                  )}

                  {/* Header part with active check */}
                  <div className="flex justify-between items-start w-full gap-2 mb-3">
                    <div>
                      <span className="text-[8px] font-mono text-gold-400/75 block uppercase tracking-wider">
                        {t.id === 'nikah' ? 'NIKAH THEME' : 'WALIMA THEME'}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-gold-100 group-hover:text-gold-300 transition-colors">
                        {t.name}
                      </h4>
                    </div>
                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-emerald-950">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gold-400/20 flex items-center justify-center text-gold-400/30 group-hover:border-gold-400/40 transition-colors" />
                    )}
                  </div>

                  {/* Color Swatch Preview - EXACT matching user's images */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {t.swatches.map((sw, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm relative group/swatch"
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      >
                        {/* Hover tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/swatch:block bg-stone-950 text-white text-[8px] font-mono uppercase tracking-widest py-0.5 px-1.5 rounded whitespace-nowrap z-30 shadow-md">
                          {sw.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Theme Image Preview */}
                  <div className="mt-3 rounded-lg overflow-hidden border border-gold-400/20 relative h-24 bg-emerald-950/30">
                    <img
                      src={t.id === 'nikah' ? data['nikah_theme_image'] || '/images/Nikah.png' : data['walima_theme_image'] || '/images/Walima.png'}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log(`Loaded theme image for ${t.id}:`, t.id === 'nikah' ? data['nikah_theme_image'] : data['walima_theme_image'])}
                      onError={(e) => {
                        console.error(`Failed to load theme image for ${t.id}:`, t.id === 'nikah' ? data['nikah_theme_image'] : data['walima_theme_image']);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Tiny Arabic calligraphy watermarked */}
                  <span className="absolute bottom-1 right-2 text-[10px] font-serif italic text-gold-400/5 select-none pointer-events-none">
                    {t.arabicName}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Dynamic description of the current active theme */}
        <div className="mt-5 pt-4 border-t border-gold-400/10 flex items-center justify-center sm:justify-start gap-2">
          <Sparkles size={11} className="text-gold-400 animate-pulse" />
          <span className="text-[10px] font-mono text-gold-300/80 uppercase tracking-widest">
            {THEMES.find(t => t.id === currentThemeId)?.tagline}
          </span>
        </div>

      </div>
    </div>
  );
}
