import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  ShoppingBag, 
  Target 
} from 'lucide-react';
import Header from './components/Header';
import DigitalClock from './components/DigitalClock';
import QuoteSection from './components/QuoteSection';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import QuickNotes from './components/QuickNotes';
import StatsBar from './components/StatsBar';
import ProductHub from './components/ProductHub';
import { INITIAL_PRODUCTS } from './utils/productData';
import LeadScraper from './components/LeadScraper';
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
  { id: '3', title: 'List study desk on Resale & Donation Hub', priority: 'medium', category: 'Learning', completed: false, createdAt: new Date().toISOString() },
  { id: '4', title: 'Export local lead list for Kochi restaurants', priority: 'low', category: 'Personal', completed: false, createdAt: new Date().toISOString() },
];

const INITIAL_NOTES = `⚡ Daily Quick Notes
- Key priorities for today:
  • Build & test high-impact features
  • Stay focused during Pomodoro blocks
  • Hydrate and stretch

💡 Ideas & Scratchpad:
`;

export default function App() {
  // Navigation: 'productivity', 'resale-hub', 'lead-scraper'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('aura_active_tab') || 'productivity';
  });

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

  // 8. Resale & Donation Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('aura_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  // 9. Help modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aura_active_tab', activeTab);
  }, [activeTab]);

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

  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

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
      } else if ((e.key === 'n' || e.key === 'N') && !isInput && activeTab === 'productivity') {
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
  }, [activeTab]);

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

        {/* Top-Level Navigation Bar */}
        <nav className="flex items-center justify-between border-b border-amber-200/80 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/95 border border-amber-200/80 shadow-xs">
            {/* Tab 1: Productivity */}
            <button
              onClick={() => setActiveTab('productivity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'productivity'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Productivity Hub</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'productivity' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {todos.filter(t => t.completed).length}/{todos.length}
              </span>
            </button>

            {/* Tab 2: Resale & Donation Hub */}
            <button
              onClick={() => setActiveTab('resale-hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'resale-hub'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Resale & Donation Hub</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'resale-hub' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Tab 3: Local Lead Generator */}
            <button
              onClick={() => setActiveTab('lead-scraper')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lead-scraper'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
              }`}
            >
              <Target className="w-4 h-4 text-rose-600" />
              <span>Find Clients & Leads</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold uppercase tracking-wider">
                Auditor
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden md:block">
            {activeTab === 'productivity' && 'Daily habits, focus timer, and task manager'}
            {activeTab === 'resale-hub' && 'Give away or resell items with 1-click social sharing'}
            {activeTab === 'lead-scraper' && 'Scrape and audit commercial leads with CSV export'}
          </div>
        </nav>

        {/* View 1: Productivity Hub */}
        {activeTab === 'productivity' && (
          <div className="space-y-6 animate-in fade-in duration-300">
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
          </div>
        )}

        {/* View 2: Resale & Donation Hub */}
        {activeTab === 'resale-hub' && (
          <div className="animate-in fade-in duration-300">
            <ProductHub
              products={products}
              onUpdateProducts={setProducts}
            />
          </div>
        )}

        {/* View 3: Local Lead Generator & Technical Auditor */}
        {activeTab === 'lead-scraper' && (
          <div className="animate-in fade-in duration-300">
            <LeadScraper />
          </div>
        )}

        {/* Footer */}
        <footer className="pt-6 pb-2 border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">Aura Suite</span>
            <span>•</span>
            <span className="text-slate-600">Productivity, Resale Hub & Lead Generator</span>
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
