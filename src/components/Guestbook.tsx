/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Send, Sparkles } from 'lucide-react';
import { GuestbookMessage, GuestRelationship } from '../types';
import { fetchGuestbook, createGuestbookEntry, likeGuestbookEntry } from '../lib/api';

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<GuestRelationship>(GuestRelationship.WELL_WISHER);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadGuestbook();
  }, []);

  const loadGuestbook = async () => {
    const entries = await fetchGuestbook();
    setMessages(entries.map(e => ({
      id: e.id,
      name: e.name,
      relationship: e.relationship as GuestRelationship,
      message: e.message,
      createdAt: e.created_at,
      likes: e.likes,
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    setSyncStatus('syncing');

    const result = await createGuestbookEntry({
      name: name.trim(),
      relationship,
      message: messageText.trim(),
    });

    if (result.success) {
      setSyncStatus('success');
      setName('');
      setMessageText('');
      setRelationship(GuestRelationship.WELL_WISHER);
      await loadGuestbook();
    } else {
      setSyncStatus('error');
    }

    setIsSubmitting(false);
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleLike = async (id: string) => {
    await likeGuestbookEntry(id);
    await loadGuestbook();
  };

  const relationshipLabels = {
    [GuestRelationship.FRIEND]: 'Friend',
    [GuestRelationship.FAMILY]: 'Family Member',
    [GuestRelationship.GROOM_SIDE]: 'Groom\'s Side',
    [GuestRelationship.BRIDE_SIDE]: 'Bride\'s Side',
    [GuestRelationship.WELL_WISHER]: 'Well Wisher',
  };

  const relationshipColors = {
    [GuestRelationship.FRIEND]: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/20',
    [GuestRelationship.FAMILY]: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
    [GuestRelationship.GROOM_SIDE]: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    [GuestRelationship.BRIDE_SIDE]: 'bg-gold-500/15 text-gold-300 border-gold-400/20',
    [GuestRelationship.WELL_WISHER]: 'bg-purple-500/15 text-purple-300 border-purple-400/20',
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Write a message Column */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-5 bg-emerald-950/70 border border-gold-300/20 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative"
      >
        <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-gold-400/30 rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-gold-400/30 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-gold-400/30 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-gold-400/30 rounded-br" />

        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-gold-400" size={20} />
          <h4 className="text-xl font-serif text-gold-100 font-semibold">Write a Dua / Prayer</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          <div>
            <label htmlFor="guestName" className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="guestName"
              required
              placeholder="e.g. Aunt Fatima or Sk Habib"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-emerald-900/40 border border-gold-300/20 focus:border-gold-500 rounded-xl text-gold-100 placeholder:text-gold-200/30 focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
            />
          </div>

          <div>
            <label htmlFor="relationship" className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block mb-1">
              Your Relationship
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as GuestRelationship)}
              className="w-full px-4 py-2 bg-emerald-900/40 border border-gold-300/20 focus:border-gold-500 rounded-xl text-gold-100 focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
            >
              {Object.values(GuestRelationship).map((rel) => (
                <option key={rel} value={rel} className="bg-emerald-950 text-gold-100">
                  {relationshipLabels[rel]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="guestMsg" className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block mb-1">
              Your Blessing / Message
            </label>
            <textarea
              id="guestMsg"
              required
              rows={4}
              placeholder="May Allah swt fill your lives with barakah, rahmah, and eternal joy..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-4 py-2 bg-emerald-900/40 border border-gold-300/20 focus:border-gold-500 rounded-xl text-gold-100 placeholder:text-gold-200/30 focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs placeholder:italic"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !messageText.trim()}
            className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 active:scale-98 text-emerald-950 font-serif font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gold-500/40 disabled:text-emerald-950/40 relative"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} />
                <span>Publish Blessing</span>
              </>
            )}
            {syncStatus !== 'idle' && (
              <span className={`absolute -top-2 -right-2 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${
                syncStatus === 'syncing' ? 'bg-blue-500 text-white animate-pulse' :
                syncStatus === 'success' ? 'bg-green-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {syncStatus === 'syncing' ? '...' : syncStatus === 'success' ? '✓' : '✗'}
              </span>
            )}
          </button>
        </form>
      </motion.div>

      {/* Message wall Column */}
      <div className="lg:col-span-7 flex flex-col h-[400px] md:h-[480px]">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-xs font-mono text-gold-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={12} className="text-gold-400 animate-pulse" />
            <span>Blessing Wall ({messages.length})</span>
          </span>
          <span className="text-[10px] font-sans text-gold-300/60">Scroll to view more</span>
        </div>

        {/* Scrollable container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scroll">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-emerald-950/40 border border-gold-300/10 rounded-2xl p-4 md:p-5 relative group hover:border-gold-300/30 transition-all shadow-md"
              >
                {/* Relationship Tag */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h5 className="font-serif text-sm text-gold-100 font-semibold flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-gold-400" />
                      {msg.name}
                    </h5>
                    <span className="text-[9px] font-mono text-gold-300/50 mt-0.5 block">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${relationshipColors[msg.relationship]}`}>
                    {relationshipLabels[msg.relationship]}
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-xs text-gold-200/90 font-sans leading-relaxed whitespace-pre-line italic font-serif">
                  "{msg.message}"
                </p>

                {/* Bless / Like Counter */}
                <div className="flex justify-end mt-3 border-t border-gold-300/5 pt-2">
                  <button
                    onClick={() => handleLike(msg.id)}
                    className="flex items-center gap-1 text-[10px] font-mono text-gold-400 hover:text-rose-400 transition-colors bg-emerald-900/30 hover:bg-emerald-900/60 py-1 px-2.5 rounded-lg border border-gold-400/10 cursor-pointer"
                    title="Send Amen / Blessing"
                  >
                    <Heart size={10} className="fill-rose-500 text-rose-500 animate-pulse" />
                    <span>Send Blessing ({msg.likes})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
