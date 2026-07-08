import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw, Check, MessageSquare, Gift } from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface CardContent {
  id: string;
  title: string;
  icon: React.ReactNode;
  hint: string;
  revealedText: string;
  subText: string;
  arabic?: string;
  author?: string;
}

export default function ScratchCard() {
  const { data } = useWeddingData();

  const cards: CardContent[] = [
    {
      id: 'dua',
      title: 'Sacred Blessing',
      icon: <Sparkles className="w-5 h-5 text-gold-400" />,
      hint: 'Scratch to reveal a sacred marital Dua for the couple',
      revealedText: "Barakallahu Laka Wa Baraka 'Alayka Wa Jama'a Baynakuma Fee Khayr",
      subText: '"May Allah bless you and shower His blessings upon you, and join you together in goodness."',
      arabic: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
      author: 'Sunan Abi Dawud'
    },
    {
      id: 'promise',
      title: 'A Silent Vow',
      icon: <Heart className="w-5 h-5 text-gold-400" />,
      hint: `Scratch to reveal the promise ${data.groom_name || 'Sk Raju'} & ${data.bride_name || 'Sabina'} hold for life`,
      revealedText: 'A Covenant of Tranquility, Love & Mercy',
      subText: '"To hold each other\'s hand in times of laughter and prayer, growing together in Taqwa and building our home under the shade of His guidance."',
      author: `${data.groom_name || 'Sk Raju'} & ${data.bride_name || 'Sabina'}`
    },
    {
      id: 'gift',
      title: 'Your Wedding Fortune',
      icon: <Gift className="w-5 h-5 text-gold-400" />,
      hint: 'Scratch to reveal a special thank-you message for your presence',
      revealedText: data.scratch_reward_title || 'Shukran Jazeelan for Gracing Our Journey!',
      subText: '"Your presence completes our happiness. Your prayers are the greatest gift we could ever receive. May Allah bless you abundantly in return."',
      author: 'The Blessed Families'
    }
  ];


  const [activeCardId, setActiveCardId] = useState<string>('dua');
  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Decorative intro */}
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 uppercase block mb-1">Interactive Devotion</span>
        <h3 className="text-2xl md:text-3xl font-serif text-gold-100 font-bold tracking-wide">Blessing Scratch Cards</h3>
        <p className="text-xs text-gold-200/60 max-w-md mx-auto mt-2">
          Interact with our digital wedding favors. Swipe or scratch the golden cards below to reveal heartfelt secrets and marital blessings!
        </p>
        <div className="h-[1px] w-16 bg-gold-400/30 mx-auto mt-4" />
      </div>

      {/* Tabs / Switcher */}
      <div className="flex justify-center gap-3 mb-8">
        {cards.map(card => {
          const isActive = card.id === activeCardId;
          return (
            <button
              key={card.id}
              onClick={() => setActiveCardId(card.id)}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs transition-all border duration-300 ${
                isActive
                  ? 'bg-gold-500 border-gold-400 text-emerald-950 font-semibold shadow-lg shadow-gold-500/10 scale-105'
                  : 'bg-emerald-950/40 border-gold-400/20 text-gold-300 hover:border-gold-300/40 hover:bg-emerald-900/30'
              }`}
            >
              {card.icon}
              <span>{card.title}</span>
            </button>
          );
        })}
      </div>

      {/* Card Arena */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCardId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <ScratchArea card={activeCard} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ScratchArea({ card }: { card: CardContent }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number }[]>([]);

  // Reset state when the active card changes
  useEffect(() => {
    setIsRevealed(false);
    setScratchProgress(0);
    setIsDrawing(false);
    setSparkles([]);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas dimensions
    const width = 360;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    // Draw scratch layer
    drawScratchLayer(ctx, width, height);
  }, [card]);

  const drawScratchLayer = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // 1. Draw semi-transparent gold base so text is visible underneath
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(205, 162, 80, 0.85)'); // Gold medium with transparency
    grad.addColorStop(0.3, 'rgba(235, 212, 150, 0.85)'); // Gold light shiny with transparency
    grad.addColorStop(0.5, 'rgba(157, 117, 44, 0.85)'); // Gold dark with transparency
    grad.addColorStop(0.8, 'rgba(245, 228, 179, 0.85)'); // Gold highlight with transparency
    grad.addColorStop(1, 'rgba(171, 129, 53, 0.85)'); // Gold base with transparency
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Add high-end decorative Islamic geometric border pattern on the scratch cover
    ctx.strokeStyle = 'rgba(74, 49, 11, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Corner flourishes
    const corners = [
      { x: 16, y: 16, dx: 1, dy: 1 },
      { x: w - 16, y: 16, dx: -1, dy: 1 },
      { x: 16, y: h - 16, dx: 1, dy: -1 },
      { x: w - 16, y: h - 16, dx: -1, dy: -1 },
    ];
    corners.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + c.dy * 15);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(c.x + c.dx * 15, c.y);
      ctx.lineTo(c.x, c.y + c.dy * 15);
      ctx.fillStyle = 'rgba(74, 49, 11, 0.2)';
      ctx.fill();
      ctx.stroke();
    });

    // Decorative Mandala/Star inside the golden scratch layer
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 42, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(74, 49, 11, 0.35)';
    ctx.stroke();

    // Star polygons
    drawStar(ctx, w / 2, h / 2, 8, 35, 18);

    // Beautiful typography overlay on the scratch cover
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillStyle = '#4a310b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH WITH LOVE', w / 2, h / 2 + 58);
    
    ctx.font = 'italic 10px sans-serif';
    ctx.fillStyle = 'rgba(74, 49, 11, 0.75)';
    ctx.fillText('using touch or cursor', w / 2, h / 2 + 76);
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = 'rgba(74, 49, 11, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(74, 49, 11, 0.35)';
    ctx.stroke();
  };

  // Get mouse/touch relative positions
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates accurately back to logical dimensions
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    
    return { x, y };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Erase circles where the user scratches with larger brush for smoother effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    // Add additional overlapping circles for smoother coverage
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Add more overlapping circles for even smoother effect
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Trigger sparkles along scratching trail
    if (Math.random() < 0.35) {
      setSparkles(prev => [...prev, { x, y, id: Date.now() + Math.random() }].slice(-15));
    }

    // Periodically compute scratch percentage to auto-reveal
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let erasedCount = 0;

    // Sample every 4th pixel for high speed
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        erasedCount++;
      }
    }

    const percentage = erasedCount / (pixels.length / 16);
    setScratchProgress(Math.min(Math.round((percentage / 0.30) * 100), 100));

    // Fully reveal once crossed 30% cleared
    if (percentage > 0.30 && !isRevealed) {
      setIsRevealed(true);
      // Erase whole canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isRevealed) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleMouseUpOrLeave = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isRevealed) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleForceReveal = () => {
    setIsRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setScratchProgress(100);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setScratchProgress(0);
    setIsDrawing(false);
    setSparkles([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawScratchLayer(ctx, canvas.width, canvas.height);
    }
  };

  return (
    <div className="bg-emerald-950 border border-gold-400/20 shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
      
      {/* Sparkly corner decorative stars */}
      <div className="absolute top-3 left-3 text-gold-500/20"><Sparkles size={14} /></div>
      <div className="absolute top-3 right-3 text-gold-500/20"><Sparkles size={14} /></div>
      <div className="absolute bottom-3 left-3 text-gold-500/20"><Sparkles size={14} /></div>
      <div className="absolute bottom-3 right-3 text-gold-500/20"><Sparkles size={14} /></div>

      <div 
        ref={containerRef}
        className="relative w-[360px] h-[240px] bg-emerald-900/40 rounded-2xl border border-gold-300/10 overflow-hidden flex flex-col justify-center items-center px-6 text-center select-none"
      >
        {/* REVEALED BACKGROUND CONTENT - What lies beneath */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/80 via-emerald-950/95 to-emerald-950">
          
          {/* Subtle floral background pattern */}
          <div className="absolute inset-2 border border-gold-300/10 rounded-xl pointer-events-none" />

          {card.id === 'dua' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
              className="space-y-3 flex flex-col items-center"
            >
              <div className="text-gold-400 font-serif text-lg leading-relaxed px-2 tracking-wide font-medium">
                {card.arabic}
              </div>
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent my-1" />
              <p className="text-xs text-gold-100 font-serif leading-relaxed px-1">
                {card.revealedText}
              </p>
              <p className="text-[11px] text-gold-200/70 font-sans italic leading-relaxed px-2">
                {card.subText}
              </p>
              {card.author && (
                <span className="text-[9px] font-mono tracking-widest text-gold-500 uppercase block mt-1">
                  — {card.author}
                </span>
              )}
            </motion.div>
          )}

          {card.id !== 'dua' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
              className="space-y-3 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
                {card.id === 'promise' ? <Heart size={18} className="animate-pulse text-gold-400 fill-gold-400/10" /> : <Gift size={18} />}
              </div>
              <h4 className="text-sm font-serif font-bold text-gold-100">
                {card.revealedText}
              </h4>
              <p className="text-xs text-gold-200/85 font-sans leading-relaxed px-2 italic">
                {card.subText}
              </p>
              {card.author && (
                <span className="text-[9px] font-mono tracking-widest text-gold-500 uppercase block">
                  — {card.author}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* CANVAS SCRATCH COVER - Overlaid precisely */}
        <canvas
          id={`canvas-${card.id}`}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          className={`absolute inset-0 cursor-crosshair z-10 transition-opacity duration-700 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* SCRATCH TRAIL SPARKLES */}
        {sparkles.map(sp => (
          <motion.div
            key={sp.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 1.5, 0], opacity: [1, 0.8, 0], y: [0, -25, -40] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ left: `${(sp.x / 360) * 100}%`, top: `${(sp.y / 240) * 100}%` }}
            className="absolute w-1.5 h-1.5 bg-gold-200 rounded-full pointer-events-none z-20 shadow-[0_0_8px_#ffd700]"
          />
        ))}
      </div>

      {/* Progress & Bottom Bar Actions */}
      <div className="w-full max-w-[360px] mt-4 flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-gold-400/70 uppercase">Scratch Progress</span>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-24 h-1.5 bg-emerald-900 rounded-full overflow-hidden border border-gold-400/15">
              <div 
                className="h-full bg-gold-500 rounded-full transition-all duration-300" 
                style={{ width: `${scratchProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gold-200 font-bold">{scratchProgress}%</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isRevealed ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-900 border border-gold-400/30 text-[10px] font-mono text-gold-300 hover:text-gold-100 hover:bg-emerald-800 hover:border-gold-300 transition-all uppercase tracking-wider"
            >
              <RotateCcw size={10} />
              <span>Scratch Again</span>
            </button>
          ) : (
            <button
              onClick={handleForceReveal}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gold-500/10 border border-gold-400/40 text-[10px] font-mono text-gold-300 hover:bg-gold-500 hover:text-emerald-950 hover:border-gold-400 transition-all uppercase tracking-wider"
            >
              <Sparkles size={10} />
              <span>Reveal Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Celebration Congratulatory text */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center flex items-center gap-1.5 text-xs text-gold-400 font-sans"
          >
            <Check size={12} className="text-emerald-400 stroke-[3px]" />
            <span>Successfully Unlocked! Alhamdulillah ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
