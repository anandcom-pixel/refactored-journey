import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe } from 'lucide-react';

export default function DigitalClock({ is24Hour, onToggleFormat }) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format hours, minutes, seconds
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  let ampm = '';

  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
  }
  const formattedHours = String(hours).padStart(2, '0');

  // Formatted date
  const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = time.toLocaleDateString(undefined, dateOptions);

  // Timezone offset
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300">
      {/* Background ambient warm glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>LIVE CLOCK</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>

        {/* 12H / 24H Toggle */}
        <button
          onClick={onToggleFormat}
          title={`Switch to ${is24Hour ? '12-hour (AM/PM)' : '24-hour'} format`}
          className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="font-mono font-bold">{is24Hour ? '24H' : '12H'}</span>
          <span className="text-[10px] text-amber-700 uppercase font-medium">FORMAT</span>
        </button>
      </div>

      {/* Main Digital Clock Display */}
      <div className="flex items-baseline gap-2 my-1">
        <div className="flex items-center text-4xl sm:text-5xl font-black tracking-tight font-mono text-slate-900">
          <span>{formattedHours}</span>
          <span className="text-amber-500 animate-pulse px-0.5">:</span>
          <span>{minutes}</span>
          <span className="text-slate-400 text-2xl sm:text-3xl font-medium ml-1.5 font-mono">
            :{seconds}
          </span>
        </div>

        {!is24Hour && (
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            {ampm}
          </span>
        )}
      </div>

      {/* Date & Timezone */}
      <div className="mt-3 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[130px]">{timeZoneName}</span>
        </div>
      </div>
    </div>
  );
}
