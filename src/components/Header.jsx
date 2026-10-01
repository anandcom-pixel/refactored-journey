import React, { useState } from 'react';
import { Sun, Moon, Sunrise, Sunset, Sparkles, Edit3, Check, X, HelpCircle, Palette } from 'lucide-react';

export default function Header({ userName, onUpdateUserName, currentTheme, onCycleTheme, onOpenHelp }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good morning', icon: <Sunrise className="w-5 h-5 text-amber-500" /> };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good afternoon', icon: <Sun className="w-5 h-5 text-amber-500" /> };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good evening', icon: <Sunset className="w-5 h-5 text-orange-500" /> };
    } else {
      return { text: 'Good night', icon: <Moon className="w-5 h-5 text-indigo-500" /> };
    }
  });

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-amber-200/70">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 shadow-sm">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-slate-500">
              {greeting.icon}
              {greeting.text},
            </span>
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-0.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                maxLength={24}
                placeholder="Your name"
                className="bg-white text-slate-900 font-bold text-xl sm:text-2xl px-2.5 py-0.5 rounded-lg border-2 border-amber-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 transition-colors"
                title="Save name"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelName}
                className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="group flex items-center gap-2 cursor-pointer mt-0.5"
              title="Click to edit name"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                {userName || 'Friend'}
              </h1>
              <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Bright energy and clear focus for your day.
          </p>
        </div>
      </div>

      {/* Header controls: Theme cycle and Help */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onCycleTheme}
          title={`Theme: ${currentTheme.name} (Click to switch)`}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-xs font-semibold text-slate-700 hover:text-amber-800 transition-all shadow-sm hover:shadow"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span className="capitalize">{currentTheme.name}</span>
        </button>

        <button
          onClick={onOpenHelp}
          title="Keyboard shortcuts & tips"
          className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-slate-600 hover:text-amber-700 transition-colors shadow-sm hover:shadow"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
