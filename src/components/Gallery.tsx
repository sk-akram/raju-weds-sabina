/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';
import { useWeddingData } from '../lib/WeddingDataContext';

interface GalleryProps {
  showNikah?: boolean;
}

export default function Gallery({ showNikah = true }: GalleryProps) {
  const { data } = useWeddingData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pre-wedding' | 'ceremony' | 'reception'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [];

  // Dynamically load all 3 gallery items from spreadsheet overrides or fallbacks
  for (let i = 1; i <= 3; i++) {
    const urlKey = `gallery${i}_url`;
    const captionKey = `gallery${i}_caption`;
    const categoryKey = `gallery${i}_category`;

    // High quality default fallback details
    let fallbackUrl = "";
    let fallbackCaption = "";
    let fallbackCategory: 'pre-wedding' | 'ceremony' | 'reception' = "pre-wedding";

    if (i === 1) {
      fallbackUrl = "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l";
      fallbackCaption = "The Blessed Couple entering the Grand Banquet Hall";
      fallbackCategory = "pre-wedding";
    } else if (i === 2) {
      fallbackUrl = "/src/assets/images/nikah_stage_1782331038747.jpg";
      fallbackCaption = "Nikah Stage - Traditional Low Seating & Soft Drapes";
      fallbackCategory = "ceremony";
    } else if (i === 3) {
      fallbackUrl = "/src/assets/images/walima_banquet_1782331057014.jpg";
      fallbackCaption = "Walima Reception Banquet - Emerald and Gold Tableware";
      fallbackCategory = "reception";
    }

    galleryItems.push({
      id: `item-${i}`,
      url: data[urlKey] || fallbackUrl,
      caption: data[captionKey] || fallbackCaption,
      category: (data[categoryKey] as any) || fallbackCategory,
    });
  }

  // Filter items based on showNikah prop and active filter
  const itemsToFilter = showNikah ? galleryItems : galleryItems.filter(item => item.category !== 'ceremony');

  const filteredItems = itemsToFilter.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null || prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null || prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  const categories: ('all' | 'pre-wedding' | 'ceremony' | 'reception')[] = showNikah
    ? ['all', 'pre-wedding', 'ceremony', 'reception']
    : ['all', 'pre-wedding', 'reception'];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Premium Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-serif tracking-wide border cursor-pointer transition-all duration-300 ${
              activeFilter === cat
                ? 'bg-gold-400 border-gold-300 text-emerald-950 font-semibold shadow-[0_0_12px_rgba(234,179,8,0.25)]'
                : 'bg-emerald-950/40 border-gold-400/20 text-gold-300 hover:border-gold-400/50'
            }`}
          >
            {cat === 'all' ? 'All Memories' : cat}
          </button>
        ))}
      </div>

      {/* Grid gallery layout with modern grid columns */}
      <motion.div
        layout
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const originalIndex = galleryItems.findIndex((g) => g.id === item.id);
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLightboxIndex(originalIndex)}
                className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-400/30 hover:border-gold-400/80 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] transition-all cursor-pointer shadow-lg group bg-emerald-950/50 p-3"
              >
                {/* Inner elegant frame border */}
                <div className="absolute inset-2 border border-gold-400/10 rounded-xl pointer-events-none z-10" />

                <div className="w-full h-full rounded-lg overflow-hidden relative flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Decorative light overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="text-center">
                      <span className="text-[9px] font-mono uppercase text-gold-400 tracking-widest flex items-center justify-center gap-1 mb-1">
                        <Sparkles size={8} className="text-gold-400 animate-pulse" /> {item.category}
                      </span>
                      <h5 className="text-xs sm:text-sm font-serif text-gold-100 font-semibold leading-snug">
                        {item.caption}
                      </h5>
                    </div>
                  </div>

                  {/* View Icon Hover Badge */}
                  <div className="absolute top-3 right-3 bg-emerald-950/85 border border-gold-400/30 p-2 rounded-full text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Eye size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-emerald-950/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setLightboxIndex(null);
              if (e.key === 'ArrowLeft') handlePrev();
              if (e.key === 'ArrowRight') handleNext();
            }}
            tabIndex={0}
          >
            {/* Backdrop Area - allows closing by clicking outer area */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxIndex(null)} />

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-emerald-900/50 border border-gold-300/30 text-gold-300 hover:text-white cursor-pointer z-50"
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>

            {/* Prev Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-emerald-900/50 border border-gold-300/30 text-gold-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer z-50"
              aria-label="Previous Image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Navigation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-emerald-900/50 border border-gold-300/30 text-gold-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer z-50"
              aria-label="Next Image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Display active image container */}
            <div className="max-w-4xl max-h-[70vh] w-full flex items-center justify-center relative p-2 z-10 pointer-events-none">
              <motion.img
                key={galleryItems[lightboxIndex].url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={galleryItems[lightboxIndex].url}
                alt={galleryItems[lightboxIndex].caption}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-gold-400/30 shadow-2xl"
              />
            </div>

            {/* Image Details Caption Panel */}
            <motion.div 
              key={`caption-${lightboxIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center max-w-lg px-4 z-10 pointer-events-none"
            >
              <div className="flex items-center justify-center gap-1.5 text-gold-400 text-[10px] font-mono uppercase tracking-widest mb-1.5">
                <Sparkles size={10} className="animate-pulse" />
                <span>{galleryItems[lightboxIndex].category}</span>
                <Sparkles size={10} className="animate-pulse" />
              </div>
              <h4 className="text-base sm:text-lg font-serif text-gold-100 font-medium">
                {galleryItems[lightboxIndex].caption}
              </h4>
              <div className="text-[10px] text-gold-400/50 font-mono mt-1.5">
                {lightboxIndex + 1} of {galleryItems.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
