import React, { useState } from 'react';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Sparkles, Calendar, MapPin, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  onPlanHoliday: (destinationId?: string) => void;
}

export const HolidayDiscoveryView: React.FC<Props> = ({ onPlanHoliday }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredDestinations = filter === 'all'
    ? DESTINATIONS_DATA
    : DESTINATIONS_DATA.filter((d) => d.id === filter);

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-300 uppercase mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Posch Holidays & Resorts Curated Escapes</span>
        </div>
        <h2 className="text-xl font-bold font-display">Verified Holiday Packages</h2>
        <p className="text-xs text-blue-200 mt-1">
          Handcrafted luxury itineraries with private transfers, 5-star resort accommodations, and 24/7 dedicated travel concierge.
        </p>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition ${
              filter === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            All Destinations
          </button>
          {DESTINATIONS_DATA.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                soundManager.playClick();
                setFilter(d.id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition ${
                filter === d.id ? 'bg-amber-400 text-slate-950' : 'bg-blue-900/60 text-blue-200 hover:text-white'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Package Cards List */}
      <div className="space-y-4">
        {filteredDestinations.map((dest) => {
          const pkg = dest.holidayPackage;
          return (
            <div
              key={dest.id}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              {/* Image Hero */}
              <div className="relative h-48 w-full bg-slate-900">
                <img
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-950/80 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Posch Verified Itinerary
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.country}</span>
                    <span>·</span>
                    <span>{pkg.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display leading-tight">{pkg.title}</h3>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-4 space-y-3">
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <strong className="text-slate-800">Resort Experience: </strong>
                  {pkg.resortType}
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                    Signature Highlights:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inclusions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                    Posch Inclusions:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.inclusions.map((inc, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200/80 px-2 py-0.5 rounded-lg font-medium"
                      >
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Best Season: {pkg.bestSeason}
                  </span>
                </div>

                {/* Plan Enquiry Button */}
                <button
                  onClick={() => {
                    soundManager.playSuccessChime();
                    onPlanHoliday(dest.id);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enquire for {dest.name} Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
