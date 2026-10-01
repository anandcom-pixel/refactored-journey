import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Clock, 
  ListPlus 
} from 'lucide-react';

export default function QuickNotes({ notes, onUpdateNotes }) {
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setSaveStatus('Saving...');
    onUpdateNotes(val);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaveStatus('Saved');
    }, 400);
    return () => clearTimeout(timer);
  }, [notes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([notes || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const dateStr = new Date().toISOString().split('T')[0];
    element.download = `notes-${dateStr}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleInsertTimestamp = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const insertion = `[${timeStr}] `;
    onUpdateNotes((notes ? notes + '\n' : '') + insertion);
  };

  const handleInsertBullet = () => {
    const bullet = `• `;
    onUpdateNotes((notes ? notes + '\n' : '') + bullet);
  };

  const handleClear = () => {
    onUpdateNotes('');
    setShowClearConfirm(false);
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  return (
    <div className="relative rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Scratchpad</h2>
        </div>

        {/* Live Auto-save indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className={`inline-flex rounded-full h-2 w-2 ${saveStatus === 'Saving...' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="font-mono text-slate-600">{saveStatus}</span>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="flex items-center justify-between gap-1.5 py-2 text-xs border-b border-amber-100">
        <div className="flex items-center gap-1">
          <button
            onClick={handleInsertTimestamp}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            title="Insert current timestamp"
          >
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Time</span>
          </button>
          <button
            onClick={handleInsertBullet}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            title="Insert bullet point"
          >
            <ListPlus className="w-3 h-3 text-amber-600" />
            <span>Bullet</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            title="Copy notes to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            title="Download as .txt file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {notes && !showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Clear notes"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {showClearConfirm && (
            <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              <span className="text-[10px] text-rose-700 font-bold">Clear?</span>
              <button
                onClick={handleClear}
                className="text-[10px] text-rose-700 font-bold hover:underline ml-1 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="text-[10px] text-slate-500 hover:text-slate-800 ml-1 cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex-1 my-2">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Capture quick thoughts, phone numbers, ideas, or meeting notes here... (Automatically saved)"
          className="w-full h-full min-h-[220px] bg-transparent text-slate-800 placeholder-slate-400 text-sm leading-relaxed p-1 focus:outline-none resize-none font-sans"
        />
      </div>

      {/* Footer stats */}
      <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'} • {charCount} chars</span>
        <span className="text-slate-400 font-mono">localStorage sync</span>
      </div>
    </div>
  );
}
