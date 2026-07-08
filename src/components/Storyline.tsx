import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Star, Calendar, Quote, BookOpen, 
  ChevronLeft, ChevronRight, MapPin, Coffee, Camera, 
  Gift, Utensils, Cake, Compass, Eye, X, Maximize2,
  Film, Play
} from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  rotateLeft?: boolean;
}

interface StoryChapter {
  id: number;
  title: string;
  period: string;
  date: string;
  badge: string;
  poetry: string;
  story: string;
  media: MediaItem[];
  colorClass: string;
}

const getNodeIcon = (index: number) => {
  switch (index) {
    case 0: return <Heart size={16} className="text-gold-400 fill-gold-400/20" />;
    case 1: return <Compass size={16} className="text-gold-400" />;
    case 2: return <Star size={16} className="text-gold-400 fill-gold-400/20" />;
    default: return <Sparkles size={16} className="text-gold-400" />;
  }
};

function ChapterCard({
  ch,
  isExpanded,
  onToggle,
  isEven,
  onZoom,
}: {
  key?: React.Key;
  ch: StoryChapter;
  isExpanded: boolean;
  onToggle: () => void;
  isEven: boolean;
  onZoom: (url: string, title: string, isVideo: boolean) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMedia = ch.media[activeIdx] || ch.media[0];

  useEffect(() => {
    if (ch.media.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ch.media.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [ch.media.length]);

  const decoration = (
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, ptIdx) => (
        <motion.div
          key={ptIdx}
          className="absolute bg-gold-400 rounded-full"
          style={{
            width: Math.random() * 3 + 1.5 + 'px',
            height: Math.random() * 3 + 1.5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  return (
    <div 
      className={`flex flex-col md:flex-row items-stretch md:items-center relative ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* 1. Timeline node point (Center Trunk) */}
      <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
        <motion.button
          whileHover={{ scale: 1.15 }}
          onClick={onToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 focus:outline-none cursor-pointer ${
            isExpanded 
              ? 'bg-gold-400 border-gold-300 text-emerald-950 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110'
              : 'bg-emerald-950 border-gold-400/30 text-gold-400 hover:border-gold-400'
          }`}
        >
          {getNodeIcon(ch.id - 1)}
        </motion.button>
      </div>

      {/* 2. Horizontal branch connection (Hidden on Mobile) */}
      <div 
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[calc(50%-1.5rem)] border-t border-dashed border-gold-400/20 pointer-events-none ${
          isEven ? 'left-6 pr-6' : 'right-6 pl-6'
        }`} 
      />

      {/* 3. Memory Card Panel */}
      <div className="w-full md:w-[45%] pl-12 md:pl-0">
        <motion.div
          layout="position"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative overflow-hidden rounded-2xl border border-gold-400/25 shadow-xl hover:border-gold-400/45 transition-all duration-500 bg-gradient-to-br ${
            ch.colorClass
          }`}
        >
          {decoration}
          
          {/* Inner gold frame border */}
          <div className="absolute inset-2 border border-gold-400/5 rounded-xl pointer-events-none" />

          {/* Card main layout */}
          <div className="p-5 md:p-6 relative z-10 flex flex-col justify-between h-full">
            
            {/* Meta Place & Badge Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[10px] font-mono tracking-wider uppercase py-0.5 px-2.5 rounded-full">
                <MapPin size={10} />
                {ch.period}
              </span>
              
              {ch.badge && (
                <span className="text-gold-300/60 text-[10px] font-sans font-medium tracking-wide">
                  {ch.badge}
                </span>
              )}
            </div>

            {/* Occasion / Title */}
            <h4 className="text-lg md:text-xl font-serif font-bold text-gold-100 tracking-wide mb-3">
              {ch.title}
            </h4>

            {/* Display active media directly inside card */}
            {activeMedia && (
              <div className="w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-gold-400/20 shadow-md relative group bg-emerald-950/40 mb-3 flex flex-col items-center justify-center">
                {activeMedia.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video
                      src={activeMedia.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-950/90 border border-gold-400/30 text-gold-300 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Autoplay
                    </div>
                  </div>
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={ch.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 cursor-zoom-in group-hover:scale-105"
                    onClick={() => onZoom(activeMedia.url, ch.title, false)}
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Hover Maximize controller */}
                <div 
                  onClick={() => onZoom(activeMedia.url, ch.title, activeMedia.type === 'video')}
                  className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10"
                >
                  <div className="w-9 h-9 rounded-full bg-black/70 border border-gold-400/40 flex items-center justify-center text-gold-300 shadow">
                    <Maximize2 size={14} />
                  </div>
                </div>
              </div>
            )}

            {/* Clubbed Thumbnails navigation */}
            {ch.media.length > 1 && (
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto py-1 scrollbar-none w-full">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gold-400/50 mr-1 shrink-0">
                  Memory ({ch.media.length}):
                </span>
                {ch.media.map((item, mIdx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(mIdx)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 relative ${
                      activeIdx === mIdx 
                        ? 'border-gold-400 ring-1 ring-gold-400 scale-105 shadow-md bg-emerald-900/40' 
                        : 'border-gold-400/20 hover:border-gold-400/50 opacity-60 hover:opacity-100 bg-emerald-950/20'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-emerald-900/80 flex items-center justify-center text-gold-300">
                        <Film size={14} />
                        <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
                          <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Beautiful static narrative prose and poetry removed entirely */}
          </div>
        </motion.div>
      </div>

      <div className="hidden md:block w-[45%]" />
    </div>
  );
}

export default function Storyline() {
  const { data } = useWeddingData();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; isVideo: boolean } | null>(null);

  // High quality, chronological collection of defaults clubbed with Google Drive files
  const defaultChapters: StoryChapter[] = [
    {
      id: 1,
      title: "Blessed Beginnings",
      period: "First Connection",
      date: "March 02, 2026",
      badge: "The Blessed Start",
      poetry: "Two hearts, distant yet destined, whispering their first prayer into the spring breeze.",
      story: "Our journeys quietly began to intertwine. What started as warm introductions and matching hopes grew rapidly into a deep sense of compatibility, guided by mutual respect and matching values. We realized that this beautiful connection was an answered prayer, starting our beautiful journey toward a shared life under the shade of Rahmah.",
      colorClass: "from-emerald-950 via-emerald-900/35 to-emerald-950",
      media: [
        { id: "ch1-m1", type: "image", url: "https://lh3.googleusercontent.com/d/1pI_GTs-izEWW3rbApaRn1yht6RfkZ9Yb" }
      ]
    },
    {
      id: 2,
      title: "Shared Moments",
      period: "Rajkot, Sights & Celebrations",
      date: "April & May 2026",
      badge: "Shared Milestones",
      poetry: "Like calm waters reflecting the sky, our dreams mirrored each other in perfect harmony and sweet joy.",
      story: "From walking along the tranquil shores of Atal Sarovar to lovely coffee dates, movies, birthday surprises, and fine dining at The Heritage Palace, we discovered effortless laughter and endless comfort in each other. Every smile and quiet moment shared together strengthened the bridge of mutual trust and companionship.",
      colorClass: "from-emerald-950 via-emerald-900/40 to-emerald-950",
      media: [
        { id: "ch2-m0", type: "image", url: "https://lh3.googleusercontent.com/d/1A3uzgkU3E-l2WvI7FVIwQ0S2yQyTePc1" },
        { id: "ch2-m1", type: "image", url: "https://lh3.googleusercontent.com/d/1xF28zJsjrD3mbiA9eiArA-4RWWTptVmt" },
        { id: "ch2-m2", type: "image", url: "https://lh3.googleusercontent.com/d/1nnBeJoFt0s2VmWXviwMYIFgPQqiFHZl2" },
        { id: "ch2-m3", type: "image", url: "https://lh3.googleusercontent.com/d/1xVuw5zWFXr21SQ6bkqppB8p36a7a5iwf" },
        { id: "ch2-m4", type: "image", url: "https://lh3.googleusercontent.com/d/1wuCf0xLWLlCuZmAJ_fP7B1SESRonpCN5" },
        { id: "ch2-m5", type: "image", url: "https://lh3.googleusercontent.com/d/1YZ9aNcyy1VxP0CwypIXUZmUXROvpWw75" },
        { id: "ch2-m6", type: "image", url: "https://lh3.googleusercontent.com/d/1YrBVwvffKgGz9zE5ccTBu1DyyLj9zTC-" },
        { id: "ch2-m7", type: "image", url: "https://lh3.googleusercontent.com/d/1IGJOD45PGxx9qPEBP8GcgnKMk5otGow2" },
        { id: "ch2-m8", type: "image", url: "https://lh3.googleusercontent.com/d/1wlzdSSS2d2Cce-stP7tOx3HcOsNjcheC" },
        { id: "ch2-m9", type: "image", url: "https://lh3.googleusercontent.com/d/1D948XPqop6FI06VuiFTo3HUftOiWNMJn" }
      ]
    },
    {
      id: 3,
      title: "Engagement",
      period: "Home, Baat Pakki",
      date: "June 19, 2026",
      badge: "Shared Moments",
      poetry: "Bound by a sacred covenant of love, respect, and mutual devotion under His divine blessings.",
      story: "Surrounded by the warmth of our closest family, we celebrated our official Engagement (Baat Pakki). Exchanging rings and heartfelt prayers, we took a monumental step toward weaving our futures together. Our hearts are filled with gratitude and beautiful hope for the life we are going to build as companions for Jannah, Insha'Allah.",
      colorClass: "from-emerald-950 via-emerald-900/45 to-emerald-950",
      media: [
        { id: "ch3-m1", type: "image", url: "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l" },
        { id: "ch3-m2", type: "image", url: "https://lh3.googleusercontent.com/d/1vG9BnDEGgqg9mIKoKGatblmzgFGtsZnd" },
        { id: "ch3-m3", type: "image", url: "https://lh3.googleusercontent.com/d/1sZzuVpkco8vB_XHOpKTaqlF2Dyc7e77T" }
      ]
    }
  ];

  // Merge spreadsheet synchronized overrides dynamically if present
  const chapters: StoryChapter[] = defaultChapters.map((ch) => {
    const titleKey = `chapter${ch.id}_title`;
    const periodKey = `chapter${ch.id}_period`;
    const dateKey = `chapter${ch.id}_date`;
    const badgeKey = `chapter${ch.id}_badge`;
    const poetryKey = `chapter${ch.id}_poetry`;
    const storyKey = `chapter${ch.id}_story`;
    const imageKey = `chapter${ch.id}_image`;

    const customMedia = data[imageKey] ? [
      { id: `custom-${ch.id}`, type: "image" as const, url: data[imageKey] },
      ...ch.media.filter(m => m.url !== data[imageKey])
    ] : ch.media;

    return {
      ...ch,
      title: data[titleKey] || ch.title,
      period: data[periodKey] || ch.period,
      date: data[dateKey] || ch.date,
      badge: data[badgeKey] || ch.badge,
      poetry: data[poetryKey] || ch.poetry,
      story: data[storyKey] || ch.story,
      media: customMedia
    };
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleZoom = (url: string, title: string, isVideo: boolean) => {
    setLightboxImg({ url, title, isVideo });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 relative">
      
      {/* Decorative Section Title */}
      <div className="text-center mb-16 relative z-10">
        <span className="text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase block mb-2">Our Blessed Chronicle</span>
        <h3 className="text-3xl md:text-4xl font-serif text-gold-100 font-bold tracking-wide">Safar-e-Ishq — Memory Lane</h3>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto mt-5" />
      </div>

      {/* Main Flow Timeline Container */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Glow down the middle */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold-400/10 via-gold-400/40 to-gold-400/10 -translate-x-1/2 pointer-events-none" />

        <div className="space-y-12 md:space-y-16 relative z-10">
          {chapters.map((ch, idx) => (
            <ChapterCard
              key={ch.id}
              ch={ch}
              isExpanded={expandedId === ch.id}
              onToggle={() => toggleExpand(ch.id)}
              isEven={idx % 2 === 0}
              onZoom={handleZoom}
            />
          ))}
        </div>
      </div>

      {/* Love days tracker / Footer blessing statement card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-20 bg-gradient-to-r from-emerald-950/70 via-emerald-950 to-emerald-950/70 border border-gold-400/25 rounded-3xl p-8 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden group hover:border-gold-400/45 transition-all duration-300"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400" />
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400" />
        
        <h5 className="text-xs font-mono uppercase text-gold-400 tracking-[0.25em] mb-2">Blessed Companionship</h5>
        <div className="flex justify-center items-center gap-3 my-4">
          <Heart size={16} className="text-gold-400 fill-gold-400 animate-pulse" />
          <span className="text-xl md:text-2xl font-serif text-gold-100 font-semibold tracking-wide">
            {data.groom_name || 'Sk Raju'} & {data.bride_name || 'Sabina Khatun'}
          </span>
          <Heart size={16} className="text-gold-400 fill-gold-400 animate-pulse" />
        </div>
        <p className="text-xs md:text-sm text-gold-200/70 max-w-lg mx-auto leading-relaxed italic">
          "And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts." (Surah Ar-Rum 30:21)
        </p>
        <p className="text-[10px] text-gold-400/50 uppercase font-mono tracking-widest mt-6">
          To the Sacred Nikah
        </p>
      </motion.div>

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxImg(null)} />

            <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center z-10">
              
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute -top-12 right-0 md:-right-4 text-gold-400 hover:text-white bg-white/5 hover:bg-white/10 border border-gold-400/20 p-2 rounded-full transition-all cursor-pointer focus:outline-none"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl border border-gold-400/25 bg-emerald-950/20 shadow-2xl relative"
              >
                {lightboxImg.isVideo ? (
                  <video
                    src={lightboxImg.url}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-[70vh] object-contain rounded-xl"
                  />
                ) : (
                  <img
                    src={lightboxImg.url}
                    alt={lightboxImg.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl transition-all duration-300"
                  />
                )}
              </motion.div>

              <p className="text-gold-200 font-serif text-center mt-4 text-sm md:text-base font-semibold px-6 max-w-2xl">
                {lightboxImg.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
