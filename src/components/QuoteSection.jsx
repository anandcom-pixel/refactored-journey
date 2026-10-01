import React, { useState } from 'react';
import { Quote, RefreshCw, Edit2, Copy, Check } from 'lucide-react';
import { DEFAULT_QUOTES, getRandomQuote } from '../utils/quotes';

export default function QuoteSection({ customQuote, onSaveCustomQuote }) {
  const [currentCuratedIndex, setCurrentCuratedIndex] = useState(0);
  const [useCustom, setUseCustom] = useState(Boolean(customQuote && customQuote.text));
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customText, setCustomText] = useState(customQuote?.text || '');
  const [customAuthor, setCustomAuthor] = useState(customQuote?.author || '');
  const [copied, setCopied] = useState(false);

  const activeQuote = useCustom && customQuote?.text
    ? customQuote
    : DEFAULT_QUOTES[currentCuratedIndex];

  const handleNextQuote = () => {
    const { index } = getRandomQuote(currentCuratedIndex);
    setCurrentCuratedIndex(index);
    if (useCustom) {
      setUseCustom(false);
    }
  };

  const handleSaveCustom = (e) => {
    e.preventDefault();
    if (customText.trim()) {
      onSaveCustomQuote({
        text: customText.trim(),
        author: customAuthor.trim() || 'Myself',
      });
      setUseCustom(true);
      setIsEditingCustom(false);
    }
  };

  const handleCopyQuote = () => {
    const textToCopy = `"${activeQuote.text}" — ${activeQuote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <Quote className="w-4 h-4 text-amber-600" />
          <span>DAILY WISDOM & MANTRA</span>
          {useCustom && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              CUSTOM
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Switch between custom and curated */}
          {customQuote?.text && (
            <button
              onClick={() => setUseCustom(!useCustom)}
              title={useCustom ? "Switch to curated quotes" : "Switch to your custom mantra"}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors shadow-xs"
            >
              {useCustom ? 'Curated' : 'My Mantra'}
            </button>
          )}

          {/* Random quote button */}
          <button
            onClick={handleNextQuote}
            title="Next inspiring quote"
            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-amber-200 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Edit Custom Quote */}
          <button
            onClick={() => {
              setCustomText(customQuote?.text || activeQuote.text);
              setCustomAuthor(customQuote?.author || '');
              setIsEditingCustom(true);
            }}
            title="Set custom quote or mantra"
            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-amber-200 transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Copy quote */}
          <button
            onClick={handleCopyQuote}
            title="Copy quote"
            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-amber-200 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isEditingCustom ? (
        <form onSubmit={handleSaveCustom} className="space-y-3 mt-1">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Your Daily Quote or Mantra:
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Focus on what moves the needle today."
              rows={2}
              required
              className="w-full bg-amber-50/40 text-slate-900 text-sm p-2.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customAuthor}
              onChange={(e) => setCustomAuthor(e.target.value)}
              placeholder="Author / Tag (e.g. Personal Mantra)"
              className="flex-1 bg-amber-50/40 text-slate-900 text-xs px-2.5 py-1.5 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 hover:text-white transition-colors shadow-sm"
            >
              Save Mantra
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCustom(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="my-auto py-2">
          <p className="text-slate-800 text-sm sm:text-base font-medium italic leading-relaxed">
            "{activeQuote.text}"
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-700 tracking-wide">
              — {activeQuote.author}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {useCustom ? 'Personal Mantra' : 'Daily Inspiration'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
