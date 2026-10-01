import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DigitalClock from './components/DigitalClock';
import QuoteSection from './components/QuoteSection';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import QuickNotes from './components/QuickNotes';
import StatsBar from './components/StatsBar';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

const THEMES = [
  { id: 'sunlight', name: 'Golden Sunlight', bg: 'bg-[#FFFDF5]', accent: 'from-amber-500 to-yellow-500', orb1: 'bg-amber-200/40', orb2: 'bg-yellow-200/35' },
  { id: 'honey', name: 'Warm Honey', bg: 'bg-[#FEFCE8]', accent: 'from-amber-600 to-yellow-600', orb1: 'bg-amber-300/30', orb2: 'bg-yellow-300/30' },
  { id: 'citrus', name: 'Morning Citrus', bg: 'bg-[#FFFBEB]', accent: 'from-orange-500 to-amber-500', orb1: 'bg-orange-200/30', orb2: 'bg-amber-200/35' },
  { id: 'cream', name: 'Sunlit Cream', bg: 'bg-[#FFF7ED]', accent: 'from-amber-500 to-orange-400', orb1: 'bg-amber-200/30', orb2: 'bg-orange-200/30' }
];

const INITIAL_TODOS = [
  { id: '1', title: 'Review morning priorities & goals', priority: 'high', category: 'Focus', completed: true, createdAt: new Date().toISOString() },
  { id: '2', title: 'Complete first 25-min Pomodoro deep work sprint', priority: 'high', category: 'Work', completed: false, createdAt: new Date().toISOString() },
  { id: '3', title: 'Draft notes and organize ideas in scratchpad', priority: 'medium', category: 'Learning', completed: false, createdAt: new Date().toISOString() },
  { id: '4', title: 'Take a screen break & drink water', priority: 'low', category: 'Personal', completed: false, createdAt: new Date().toISOString() },
];

const INITIAL_NOTES = `⚡ Daily Quick Notes
- Key priorities for today:
  • Build & test high-impact features
  • Stay focused during Pomodoro blocks
  • Hydrate and stretch

💡 Ideas & Scratchpad:
`;

export default function App() {
  // 1. User Name
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('aura_username') || 'Alex';
  });

  // 2. Todos
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('aura_todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TODOS;
  });

  // 3. Quick Notes
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('aura_notes');
    return saved !== null ? saved : INITIAL_NOTES;
  });

  // 4. Custom Quote
  const [customQuote, setCustomQuote] = useState(() => {
    const saved = localStorage.getItem('aura_custom_quote');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // 5. Pomodoro completed sessions
  const [pomodoroSessions, setPomodoroSessions] = useState(() => {
    const saved = localStorage.getItem('aura_pomo_sessions');
    return saved ? parseInt(saved, 10) : 1;
  });

  // 6. Clock 24h preference
  const [is24Hour, setIs24Hour] = useState(() => {
    return localStorage.getItem('aura_clock_24h') === 'true';
  });

  // 7. Theme (Warm Yellow Theme default)
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('aura_yellow_theme_idx');
    return saved ? parseInt(saved, 10) : 0;
  });

  // 8. Help modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aura_username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('aura_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('aura_notes', notes);
  }, [notes]);

  useEffect(() => {
    if (customQuote) {
      localStorage.setItem('aura_custom_quote', JSON.stringify(customQuote));
    }
  }, [customQuote]);

  useEffect(() => {
    localStorage.setItem('aura_pomo_sessions', pomodoroSessions.toString());
  }, [pomodoroSessions]);

  useEffect(() => {
    localStorage.setItem('aura_clock_24h', is24Hour.toString());
  }, [is24Hour]);

  useEffect(() => {
    localStorage.setItem('aura_yellow_theme_idx', themeIdx.toString());
  }, [themeIdx]);

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      } else if ((e.key === 'n' || e.key === 'N') && !isInput) {
        e.preventDefault();
        const input = document.getElementById('todo-input');
        if (input) input.focus();
      } else if ((e.key === 't' || e.key === 'T') && !isInput) {
        e.preventDefault();
        cycleTheme();
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePomodoroComplete = () => {
    setPomodoroSessions((prev) => prev + 1);
  };

  const handleResetDay = () => {
    if (window.confirm("Reset today's Pomodoro sessions and completed status?")) {
      setPomodoroSessions(0);
      setTodos(todos.map(t => ({ ...t, completed: false })));
    }
  };

  const currentTheme = THEMES[themeIdx] || THEMES[0];

  return (
    <div className={`min-h-screen ${currentTheme.bg} text-slate-800 transition-colors duration-500 selection:bg-amber-500/25 selection:text-amber-950 relative overflow-x-hidden`}>
      {/* Background warm golden ambient glow orbs */}
      <div className={`fixed top-0 left-1/4 w-96 h-96 ${currentTheme.orb1} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />
      <div className={`fixed bottom-10 right-1/4 w-96 h-96 ${currentTheme.orb2} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 relative z-10">
        {/* Header */}
        <Header
          userName={userName}
          onUpdateUserName={setUserName}
          currentTheme={currentTheme}
          onCycleTheme={cycleTheme}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Top Section: Digital Clock & Daily Quote Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5">
            <DigitalClock
              is24Hour={is24Hour}
              onToggleFormat={() => setIs24Hour(!is24Hour)}
            />
          </div>
          <div className="lg:col-span-7">
            <QuoteSection
              customQuote={customQuote}
              onSaveCustomQuote={setCustomQuote}
            />
          </div>
        </div>

        {/* Quick Stats Bar */}
        <StatsBar
          todos={todos}
          pomodoroSessions={pomodoroSessions}
          onResetDay={handleResetDay}
        />

        {/* Core Productivity Grid: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Column 1: Interactive To-Do List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <TodoList
              todos={todos}
              onUpdateTodos={setTodos}
            />
          </div>

          {/* Column 2: Pomodoro Focus Timer (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <PomodoroTimer
              completedSessions={pomodoroSessions}
              onSessionComplete={handlePomodoroComplete}
            />
          </div>

          {/* Column 3: Minimalist Quick Notes (3 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <QuickNotes
              notes={notes}
              onUpdateNotes={setNotes}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-2 border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">Aura Productivity</span>
            <span>•</span>
            <span className="text-slate-600">Warm & energetic workspace for daily momentum</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-amber-700 font-semibold transition-colors cursor-pointer"
            >
              Shortcuts (Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-amber-300 text-[10px] text-amber-900 font-bold">?</kbd>)
            </button>
            <button
              onClick={handleResetDay}
              className="hover:text-rose-600 font-medium transition-colors cursor-pointer"
              title="Reset day's completed tasks & pomodoro count"
            >
              Reset Day
            </button>
          </div>
        </footer>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
