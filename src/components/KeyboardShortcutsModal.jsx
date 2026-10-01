import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start or pause Pomodoro focus timer' },
    { key: 'N', desc: 'Jump to add new task' },
    { key: 'T', desc: 'Cycle dashboard themes' },
    { key: 'Esc', desc: 'Close dialogs or cancel task edit' },
    { key: '?', desc: 'Open this help dialog' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-amber-200 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Keyboard className="w-5 h-5 text-amber-600" />
            <span>Productivity Dashboard Tips & Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          <p className="text-xs text-slate-600 mb-3 font-medium">
            Boost your daily workflow efficiency with quick keyboard shortcuts:
          </p>

          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
              <span className="text-xs text-slate-700 font-medium">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-xs font-mono font-bold text-amber-900 shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-amber-100 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            All data persists locally in your browser.
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
