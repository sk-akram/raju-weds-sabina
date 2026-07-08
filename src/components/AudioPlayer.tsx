/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element with a beautiful royalty-free soft ambient wedding instrumental track
    // Soft romantic sitar-flute style background track
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Standard cleanup
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Audio play blocked by browser policy. User interaction required:", error);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expanded control panel on hover / active */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: isPlaying ? 1 : 0.7, scale: 1, y: 0 }}
        className="bg-emerald-950/90 border border-gold-300/30 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-3"
        id="wedding-music-player"
      >
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-600 text-emerald-950 flex items-center justify-center transition-all shadow-md cursor-pointer"
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase">Ambient Melody</span>
          <span className="text-xs font-serif text-gold-100 font-medium whitespace-nowrap">Soft Sitar & Surbahar</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-gold-300/20 pl-2">
          <button 
            onClick={toggleMute}
            className="text-gold-300 hover:text-gold-100 transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-emerald-900/50 rounded-lg appearance-none cursor-pointer accent-gold-500"
          />
        </div>

        {/* Pulsing Visualizer Lines */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4 w-4 overflow-hidden">
            <span className="w-0.5 bg-gold-400 rounded-full animate-[bounce_1s_infinite_100ms]" style={{ height: '30%' }} />
            <span className="w-0.5 bg-gold-400 rounded-full animate-[bounce_0.8s_infinite_300ms]" style={{ height: '80%' }} />
            <span className="w-0.5 bg-gold-400 rounded-full animate-[bounce_1.2s_infinite_500ms]" style={{ height: '50%' }} />
            <span className="w-0.5 bg-gold-400 rounded-full animate-[bounce_0.9s_infinite_200ms]" style={{ height: '90%' }} />
          </div>
        )}
      </motion.div>

      {/* Floating play invitation when not playing */}
      {!isPlaying && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-gold-500 text-emerald-950 font-serif text-xs py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5 border border-gold-200"
        >
          <Music size={12} className="animate-spin" />
          <span>Tap to play wedding music</span>
        </motion.div>
      )}
    </div>
  );
}
