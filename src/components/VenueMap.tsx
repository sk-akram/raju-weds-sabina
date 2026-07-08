/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Compass } from 'lucide-react';
import { useWeddingData } from '../lib/WeddingDataContext';

interface VenueMapProps {
  showNikah?: boolean;
}

export default function VenueMap({ showNikah = true }: VenueMapProps) {
  const { data } = useWeddingData();
  const [copied, setCopied] = useState(false);

  const allVenues = [
    {
      name: "Bride's Home",
      address: "Pandua, Hooghly, West Bengal",
      lat: 23.2432,
      lng: 88.3789,
      event: "Mehendi & Kheer Pitha",
      days: "Aug 5-6"
    },
    {
      name: "Groom's Home",
      address: "Hooghly, West Bengal",
      lat: 23.2432,
      lng: 88.3789,
      event: "Mehendi",
      days: "Aug 6"
    },
    {
      name: "Gulmohar Garden",
      address: "Hooghly, West Bengal",
      lat: 23.2432,
      lng: 88.3789,
      event: "Main Wedding Day",
      days: "Aug 7"
    },
    {
      name: "Walima Hall",
      address: "Hooghly, West Bengal",
      lat: 23.2432,
      lng: 88.3789,
      event: "Walima Reception",
      days: "Aug 8"
    }
  ];

  // Filter venues based on showNikah prop
  const venues = showNikah ? allVenues : allVenues.filter(v => v.name === "Walima Hall");
  const [selectedVenue, setSelectedVenue] = useState(venues[showNikah ? 2 : 0]); // Default to Gulmohar Garden or Walima Hall

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedVenue.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapProviders = [
    {
      name: 'Google Maps',
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedVenue.name + ", " + selectedVenue.address)}`,
      icon: '🚗'
    },
    {
      name: 'Apple Maps',
      url: `maps://maps.apple.com/?q=${selectedVenue.lat},${selectedVenue.lng}&ll=${selectedVenue.lat},${selectedVenue.lng}`,
      icon: '🍏'
    },
    {
      name: 'Waze Navigation',
      url: `https://waze.com/ul?ll=${selectedVenue.lat},${selectedVenue.lng}&navigate=yes`,
      icon: '⚡'
    }
  ];


  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
      {/* Map Embed Column */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-7 flex flex-col h-[350px] md:h-[450px] relative rounded-3xl overflow-hidden border-2 border-gold-300/40 shadow-2xl group"
      >
        {/* Intricate golden corner ornaments */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-gold-400 z-10" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-gold-400 z-10" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-gold-400 z-10" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-gold-400 z-10" />

        {/* Embedded Map */}
        <iframe
          title="Wedding Venue Map"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedVenue.lng-0.015}%2C${selectedVenue.lat-0.01}%2C${selectedVenue.lng+0.015}%2C${selectedVenue.lat+0.01}&layer=mapnik&marker=${selectedVenue.lat}%2C${selectedVenue.lng}`}
          className="w-full h-full border-0 filter grayscale contrast-115"
          allowFullScreen
          loading="lazy"
        />

        {/* Floating Map Label */}
        <div className="absolute bottom-4 left-4 bg-emerald-950/90 border border-gold-400/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-gold-300 flex items-center gap-2 shadow-lg">
          <Compass size={14} className="animate-spin-slow text-gold-400" style={{ animationDuration: '8s' }} />
          <span>Coordinates: {selectedVenue.lat}° N, {selectedVenue.lng}° E</span>
        </div>
      </motion.div>

      {/* Info & Navigation controls Column */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-5 flex flex-col justify-between bg-emerald-950/60 border border-gold-300/20 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <MapPin size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">Venue Location</span>
              <h4 className="text-xl font-serif text-gold-100 font-semibold">{selectedVenue.name}</h4>
            </div>
          </div>

          {/* Venue Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {venues.map((venue) => (
              <button
                key={venue.name}
                onClick={() => setSelectedVenue(venue)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedVenue.name === venue.name
                    ? 'bg-gold-500 text-emerald-950 font-semibold'
                    : 'bg-emerald-900/40 text-gold-300 hover:bg-emerald-900/60'
                }`}
              >
                {venue.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-gold-400 uppercase">{selectedVenue.event}</span>
            <span className="text-xs text-gold-300">•</span>
            <span className="text-xs text-gold-300">{selectedVenue.days}</span>
          </div>

          {/* Physical Address Block */}
          <div className="bg-emerald-900/40 border border-gold-300/20 rounded-2xl p-4 mb-6">
            <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block mb-1">Physical Address</span>
            <span className="text-xs text-gold-100 leading-relaxed block pr-6 relative">
              {selectedVenue.address}
              <button
                onClick={handleCopyAddress}
                className="absolute top-0 right-0 p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-gold-400 hover:text-gold-300 transition-all cursor-pointer"
                title="Copy Address"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </span>
          </div>
        </div>

        {/* Travel Navigation options */}
        <div>
          <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-3">Navigate with your favorite app</span>
          <div className="grid grid-cols-1 gap-2.5">
            {mapProviders.map((provider) => (
              <a
                key={provider.name}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-gold-400/20 hover:border-gold-400/60 text-gold-100 hover:text-white transition-all text-sm group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base select-none">{provider.icon}</span>
                  <span className="font-serif font-medium">{provider.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-400 group-hover:text-gold-300 transition-colors">
                  <span>Get Directions</span>
                  <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gold-300/10 text-[11px] text-gold-300/60 flex items-center gap-1.5 font-sans justify-center">
            <Navigation size={10} className="text-gold-400" />
            <span>Valet parking is arranged at the Alcove Banquet main gate.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
