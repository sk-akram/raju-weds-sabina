/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flower, Leaf, Sparkles, Star } from 'lucide-react';

interface Sprinkle {
  id: number;
  x: number; // percentage width
  size: number;
  delay: number;
  duration: number;
  type: 'sparkle' | 'star' | 'leaf' | 'flower';
  color: string;
  rotate: number;
}

interface FloralBackgroundProps {
  themeId: 'classic' | 'nikah' | 'walima';
}

export default function FloralBackground({ themeId }: FloralBackgroundProps) {
  const [sprinkles, setSprinkles] = useState<Sprinkle[]>([]);

  useEffect(() => {
    // Generate a premium set of falling gold sprinkles (sparkles, stars, gold leaves, and foil flowers)
    const initialSprinkles: Sprinkle[] = Array.from({ length: 32 }).map((_, index) => {
      const rand = Math.random();
      let type: 'sparkle' | 'star' | 'leaf' | 'flower' = 'sparkle';
      if (rand > 0.75) {
        type = 'star';
      } else if (rand > 0.5) {
        type = 'leaf';
      } else if (rand > 0.25) {
        type = 'flower';
      }

      let colorClass = '';

      if (themeId === 'nikah') {
        // Blushing Burgundy & Rose Gold theme - Shiny Rose Golds and Blushing Coppers
        colorClass = type === 'leaf'
          ? 'text-[#8a9f95]/60 md:text-[#8a9f95]/75' // Mint Sage Gold accent leaf
          : Math.random() > 0.5
            ? 'text-[#f3a4b0] md:text-[#f3a4b0]' // Shiny Blush Pink foil
            : 'text-[#e16d80] md:text-[#e16d80]'; // Brilliant Rose Gold
      } else if (themeId === 'walima') {
        // Ink & Espresso theme - Champagne Gold, Rich Bronze, and Platinum White Gold
        colorClass = type === 'leaf'
          ? 'text-[#c2ae95]/65 md:text-[#c2ae95]/80' // Smoked Champagne Bronze leaf
          : Math.random() > 0.5
            ? 'text-amber-200 md:text-amber-200' // Shimmering White Gold
            : 'text-amber-400 md:text-amber-400'; // Honey gold glitter
      } else {
        // Classic Royal Emerald theme - 24K Sunlit Gold and Radiant Brass
        colorClass = type === 'leaf'
          ? 'text-[#dbb362]/60 md:text-[#dbb362]/75' // Gilded leaf
          : Math.random() > 0.5
            ? 'text-gold-300 md:text-gold-300' // Sunlit Gold
            : 'text-gold-400 md:text-gold-400'; // 24K Yellow Gold foil
      }

      return {
        id: index,
        x: Math.random() * 100,
        size: Math.random() * 14 + 8,
        delay: Math.random() * -15, // Negative delay so some particles start mid-screen
        duration: Math.random() * 12 + 10,
        type,
        color: colorClass,
        rotate: Math.random() * 360,
      };
    });
    setSprinkles(initialSprinkles);
  }, [themeId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Decorative luxury corner arches (fixed with dynamic gold glow) */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 border-l-4 border-t-4 border-gold-400/25 rounded-tl-full pointer-events-none m-4 shadow-[0_0_15px_rgba(207,155,58,0.08)] transition-colors duration-1000 animate-pulse" />
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 border-r-4 border-t-4 border-gold-400/25 rounded-tr-full pointer-events-none m-4 shadow-[0_0_15px_rgba(207,155,58,0.08)] transition-colors duration-1000 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 border-l-4 border-b-4 border-gold-400/25 rounded-bl-full pointer-events-none m-4 shadow-[0_0_15px_rgba(207,155,58,0.08)] transition-colors duration-1000 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 border-r-4 border-b-4 border-gold-400/25 rounded-br-full pointer-events-none m-4 shadow-[0_0_15px_rgba(207,155,58,0.08)] transition-colors duration-1000 animate-pulse" />

      {/* Falling premium gold sprinkles */}
      <AnimatePresence>
        {sprinkles.map((sprinkle) => (
          <div
            key={sprinkle.id}
            className={`floral-particle ${sprinkle.color}`}
            style={{
              left: `${sprinkle.x}%`,
              animationDelay: `${sprinkle.delay}s`,
              animationDuration: `${sprinkle.duration}s`,
            }}
          >
            {sprinkle.type === 'sparkle' ? (
              <Sparkles size={sprinkle.size} style={{ transform: `rotate(${sprinkle.rotate}deg)` }} className="drop-shadow-[0_0_4px_rgba(255,215,0,0.55)] animate-pulse" />
            ) : sprinkle.type === 'star' ? (
              <Star size={sprinkle.size} style={{ transform: `rotate(${sprinkle.rotate}deg)` }} className="fill-current drop-shadow-[0_0_4px_rgba(255,215,0,0.55)]" />
            ) : sprinkle.type === 'flower' ? (
              <Flower size={sprinkle.size} style={{ transform: `rotate(${sprinkle.rotate}deg)` }} className="fill-current/15 drop-shadow-[0_0_3px_rgba(255,215,0,0.4)]" />
            ) : (
              <Leaf size={sprinkle.size} style={{ transform: `rotate(${sprinkle.rotate}deg)` }} className="fill-current/10 drop-shadow-[0_0_3px_rgba(255,215,0,0.4)]" />
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
