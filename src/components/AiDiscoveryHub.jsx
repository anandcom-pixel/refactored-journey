import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ExternalLink, 
  Download, 
  Share2, 
  Star, 
  Check, 
  Copy, 
  Key, 
  X, 
  Compass, 
  Target, 
  Tag, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { 
  AI_CATEGORIES, 
  PROMPT_IDEAS, 
  searchAiApps, 
  exportAiAppsToCsv, 
  generateShareSummary,
  testGeminiApiKey
} from '../utils/aiDiscoveryService';

export default function AiDiscoveryHub() {
  const [category, setCategory] = useState('All');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [specificNeed, setSpecificNeed] = useState('');
  
  // Results and Loading
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchMeta, setSearchMeta] = useState({ category: 'All', need: '', source: 'Curated Expert Catalog', isLiveGemini: false });
  
  // Filtering & Search within results
  const [pricingFilter, setPricingFilter] = useState('all'); // 'all', 'free', 'freemium', 'paid', 'open-source', 'favorites'
  const [resultsFilterQuery, setResultsFilterQuery] = useState('');
  
  // Saved Favorites (stored in localStorage)
  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_saved_ai_apps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Gemini API Key (stored in localStorage)
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('aura_gemini_api_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState(apiKey);
  const [showKeyVisibility, setShowKeyVisibility] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState({ state: 'idle', message: '' });
  const [apiErrorBanner, setApiErrorBanner] = useState(null);

  // Notifications
  const [copiedAction, setCopiedAction] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_saved_ai_apps', JSON.stringify(savedFavorites));
    } catch (e) {
      console.error(e);
    }
  }, [savedFavorites]);

  // Initial Load: Fetch top recommended AI apps
  useEffect(() => {
    let ignore = false;
    searchAiApps({ category: 'All', specificNeed: '', apiKey })
      .then(res => {
        if (!ignore) {
          setApps(res.apps);
          setSearchMeta({ category: 'All', need: 'Top essential tools', source: res.source, isLiveGemini: res.isLiveGemini });
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [apiKey]);

  const effectiveCategory = isCustomCategory ? (customCategory.trim() || 'Custom') : category;

  // Open API Key Modal
  const handleOpenApiKeyModal = () => {
    setTempApiKeyInput(apiKey);
    setShowKeyVisibility(false);
    setKeyTestStatus({ state: 'idle', message: '' });
    setIsApiKeyModalOpen(true);
  };

  // Test API Key Connection
  const handleTestApiKey = async () => {
    const cleanKey = tempApiKeyInput.trim();
    if (!cleanKey) {
      setKeyTestStatus({ state: 'error', message: 'Please enter an API key first.' });
      return;
    }
    setKeyTestStatus({ state: 'testing', message: 'Connecting to Google Gemini API...' });
    const res = await testGeminiApiKey(cleanKey);
    if (res.success) {
      setKeyTestStatus({ state: 'success', message: 'Connection successful! Gemini API key is valid.' });
    } else {
      setKeyTestStatus({ state: 'error', message: res.error || 'Connection failed. Please check the key.' });
    }
  };

  // Search handler
  const handleSearch = async (overrideCat, overrideNeed) => {
    const searchCat = overrideCat !== undefined ? overrideCat : effectiveCategory;
    const searchNeed = overrideNeed !== undefined ? overrideNeed : specificNeed;

    setIsLoading(true);
    setApiErrorBanner(null);
    try {
      const res = await searchAiApps({
        category: searchCat,
        specificNeed: searchNeed,
        apiKey
      });

      setApps(res.apps);
      setSearchMeta({
        category: searchCat,
        need: searchNeed || 'Curated Top Tools',
        source: res.source,
        isLiveGemini: res.isLiveGemini
      });
      setPricingFilter('all');
      setResultsFilterQuery('');

      if (res.isLiveGemini) {
        setToastMessage(`✨ Live Gemini 3.8 Flash generated ${res.apps.length} tailored recommendations!`);
      } else if (res.apiError) {
        setApiErrorBanner(`Gemini API: ${res.apiError}. Displaying curated recommendations.`);
        setToastMessage('Live query notice. Curated recommendations loaded.');
      } else if (res.isMissingApiKey) {
        setToastMessage('Viewing curated recommendations. Configure Gemini API key for live searches!');
      }
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('AI App Search failed:', err);
      setToastMessage('Search encountered an issue. Loaded curated catalog.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptIdeaClick = (idea) => {
    setCategory(idea.category);
    setIsCustomCategory(false);
    setSpecificNeed(idea.prompt);
    handleSearch(idea.category, idea.prompt);
  };

  // Toggle favorite
  const handleToggleFavorite = (app) => {
    const isFav = savedFavorites.some(f => f.id === app.id || f.name.toLowerCase() === app.name.toLowerCase());
    if (isFav) {
      setSavedFavorites(savedFavorites.filter(f => f.id !== app.id && f.name.toLowerCase() !== app.name.toLowerCase()));
      setToastMessage(`Removed "${app.name}" from favorites`);
    } else {
      setSavedFavorites([app, ...savedFavorites]);
      setToastMessage(`Saved "${app.name}" to favorites! ⭐`);
    }
    setTimeout(() => setToastMessage(null), 2500);
  };

  const isAppFavorited = (app) => {
    return savedFavorites.some(f => f.id === app.id || f.name.toLowerCase() === app.name.toLowerCase());
  };

  // Copy individual app research note
  const handleCopyAppNote = (app) => {
    const note = `🤖 ${app.name} (${app.pricingTier})\n🔗 ${app.url}\n\n📝 Overview:\n${app.overview}\n\n🎯 Why it fits your need:\n${app.whyItFits}\n\n💡 Key Features:\n${app.keyFeatures.map(f => `• ${f}`).join('\n')}\n\n💰 Pricing:\n${app.pricingDetails}`;
    navigator.clipboard.writeText(note);
    setCopiedAction(`${app.id}-note`);
    setToastMessage(`Research note for "${app.name}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedAction(null);
      setToastMessage(null);
    }, 2500);
  };

  // Export to CSV
  const handleExportCsv = () => {
    const listToExport = pricingFilter === 'favorites' ? savedFavorites : filteredApps;
    exportAiAppsToCsv(listToExport, searchMeta.category, searchMeta.need);
    setToastMessage(`Exported ${listToExport.length} AI tools to CSV!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Share research report
  const handleShareReport = async () => {
    const listToShare = pricingFilter === 'favorites' ? savedFavorites : filteredApps;
    const summary = generateShareSummary(listToShare, searchMeta.category, searchMeta.need);

    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare({ text: summary })) {
      try {
        await navigator.share({
          title: `AI Research Report: ${searchMeta.category}`,
          text: summary
        });
        setToastMessage('Research report shared successfully!');
        setTimeout(() => setToastMessage(null), 2500);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedAction('share-all');
      setToastMessage('Complete AI Research Brief copied to clipboard! Ready to paste into Slack or Docs.');
      setTimeout(() => {
        setCopiedAction(null);
        setToastMessage(null);
      }, 3000);
    } catch {
      setToastMessage('Failed to copy to clipboard.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Save API Key
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const cleanKey = tempApiKeyInput.trim();
    setApiKey(cleanKey);
    localStorage.setItem('aura_gemini_api_key', cleanKey);
    setIsApiKeyModalOpen(false);
    setApiErrorBanner(null);
    setToastMessage(cleanKey ? '✅ Gemini API Key saved! Live AI queries enabled.' : 'Gemini API Key removed. Using curated catalog.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Apps
  const displaySourceList = pricingFilter === 'favorites' ? savedFavorites : apps;

  const filteredApps = displaySourceList.filter(app => {
    // Pricing filter
    if (pricingFilter === 'free' && app.pricingTier !== 'Free') return false;
    if (pricingFilter === 'freemium' && app.pricingTier !== 'Freemium') return false;
    if (pricingFilter === 'paid' && app.pricingTier !== 'Paid') return false;
    if (pricingFilter === 'open-source' && app.pricingTier !== 'Open Source') return false;

    // Search query within results
    if (!resultsFilterQuery.trim()) return true;
    const q = resultsFilterQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.overview.toLowerCase().includes(q) ||
      app.whyItFits.toLowerCase().includes(q) ||
      app.keyFeatures.some(f => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Search & AI Configuration Banner */}
      <div className="rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 shadow-sm">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  AI App Discovery & Research Hub
                </h2>
                {apiKey ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Gemini 3.8 Flash Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Curated Expert Catalog
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluate authentic AI websites, analyze key features, and generate custom rationale for your exact workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenApiKeyModal}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-sm ${
              apiKey
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 border border-amber-500 font-extrabold hover:shadow-md'
            }`}
            title="Configure your Google Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-700' : 'text-slate-950'}`} />
            <span>{apiKey ? 'API Key Active (Manage)' : '🔑 Configure Gemini API Key'}</span>
            {apiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-amber-300 font-bold uppercase tracking-wider">
                Setup
              </span>
            )}
          </button>
        </div>

        {/* Input Controls: Category + Specific Need Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Category Dropdown (4 cols) */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  setIsCustomCategory(val === 'custom');
                }}
                className="w-full bg-slate-50 hover:bg-white text-slate-900 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
              >
                {AI_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. 3D Generative Mesh, Law & Legal"
                  className="w-full mt-1.5 bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              )}
            </div>

            {/* Specific Need Input (8 cols) */}
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>Specific Use Case or Need</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">Describe your exact requirement</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={specificNeed}
                    onChange={(e) => setSpecificNeed(e.target.value)}
                    placeholder="e.g. 'Generate vector SVG logos with transparent background' or 'Build React web apps from prompt'"
                    className="w-full bg-slate-50 hover:bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                  {specificNeed && (
                    <button
                      type="button"
                      onClick={() => setSpecificNeed('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Search & Analyze AI Apps</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Inspiration / Prompt Ideas Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example Searches:</span>
            {PROMPT_IDEAS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptIdeaClick(idea)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-medium border border-amber-200/80 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-amber-700">{idea.category}:</span> {idea.prompt.slice(0, 48)}...
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Clear Guidance / Fallback Banner when API key is missing */}
      {!apiKey && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/80 to-yellow-50/50 border border-amber-300/80 p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0 mt-0.5 sm:mt-0">
                <Info className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5 flex-wrap">
                  <span>Curated Preview Mode</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300">
                    No Gemini API Key
                  </span>
                </h4>
                <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                  You are viewing our verified catalog of top AI tools. To run <strong>live, real-time AI searches</strong> powered by Google's Gemini models tailored to your custom requirements, click <strong>Configure Gemini API Key</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
              <button
                type="button"
                onClick={handleOpenApiKeyModal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>🔑 Configure Gemini API Key</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Gemini API Error / Notice Banner */}
      {apiErrorBanner && (
        <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 text-xs text-rose-900 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Live AI Query Notice: </span>
              <span>{apiErrorBanner}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenApiKeyModal}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold border border-rose-300 transition-colors cursor-pointer"
            >
              Update Key
            </button>
            <button
              type="button"
              onClick={() => setApiErrorBanner(null)}
              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Results Header, Filters & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-amber-50/80 p-1 rounded-xl border border-amber-200/80 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All Recommended (${apps.length})` },
            { id: 'freemium', label: 'Freemium' },
            { id: 'free', label: '100% Free' },
            { id: 'open-source', label: 'Open Source' },
            { id: 'paid', label: 'Paid' },
            { id: 'favorites', label: `⭐ Saved (${savedFavorites.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPricingFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                pricingFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Controls: Search within, Export CSV, Share All */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={resultsFilterQuery}
              onChange={(e) => setResultsFilterQuery(e.target.value)}
              placeholder="Filter results..."
              className="bg-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-amber-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-36 sm:w-44"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredApps.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Export research notes to CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleShareReport}
            disabled={filteredApps.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Share complete research brief"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{copiedAction === 'share-all' ? 'Copied Brief!' : 'Share Notes'}</span>
          </button>
        </div>
      </div>

      {/* Meta Bar info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredApps.length}</strong> AI applications
          {searchMeta.need && (
            <span> for <strong className="text-amber-800 font-medium">"{searchMeta.need}"</strong></span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{searchMeta.source}</span>
        </span>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="rounded-2xl bg-white/95 border border-amber-200/80 p-12 text-center text-slate-500 shadow-sm space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">
            Evaluating and curating AI websites...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {apiKey ? 'Querying Google Gemini 3.8 Flash for real-world AI applications matching your use case...' : 'Scoring curated expert catalog with customized requirement analysis...'}
          </p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-2xl bg-white/95 border border-amber-200/80 p-12 text-center text-slate-500 shadow-sm space-y-2">
          <Compass className="w-8 h-8 text-amber-300 mx-auto" />
          <h3 className="font-semibold text-slate-700 text-sm">
            {pricingFilter === 'favorites' ? 'No saved favorite AI apps yet.' : 'No AI applications match this filter.'}
          </h3>
          <p className="text-xs text-slate-400">
            {pricingFilter === 'favorites' ? 'Click the star icon on any tool card to bookmark it here for quick access.' : 'Try selecting "All Recommended" or typing a different search query above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map((app) => {
            const isFavorited = isAppFavorited(app);
            const isCopied = copiedAction === `${app.id}-note`;

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-white/95 border border-amber-200/80 hover:border-amber-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                {/* Header: Title, Category, Badge, Star Button */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                          {app.name}
                        </h3>
                        {app.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {app.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {app.category}
                        </span>
                      </div>

                      {/* Domain link */}
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline mt-1 font-mono"
                      >
                        <span>{app.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(app)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        isFavorited
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-amber-600'
                      }`}
                      title={isFavorited ? 'Remove from favorites' : 'Bookmark to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-500 text-amber-600' : ''}`} />
                    </button>
                  </div>

                  {/* Overview Note */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                    {app.overview}
                  </p>

                  {/* Why it fits your need Highlight Box */}
                  <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-amber-50/90 to-yellow-50/70 border border-amber-200/90 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                      <Target className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Why it fits your requirement:</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {app.whyItFits}
                    </p>
                  </div>

                  {/* Key Features List */}
                  {Array.isArray(app.keyFeatures) && app.keyFeatures.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Key Capabilities:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                        {app.keyFeatures.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer: Pricing Details & Action Buttons */}
                <div className="pt-3 border-t border-amber-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {/* Pricing info */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      app.pricingTier === 'Free' || app.pricingTier === '100% Free'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : app.pricingTier === 'Open Source'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : app.pricingTier === 'Freemium'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {app.pricingTier}
                    </span>
                    <span className="text-slate-500 truncate text-[11px] font-medium" title={app.pricingDetails}>
                      {app.pricingDetails}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyAppNote(app)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy structured research notes for this tool"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Note</span>
                        </>
                      )}
                    </button>

                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Gemini API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Key className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Configure Gemini API Key</h3>
                  <p className="text-xs text-slate-500">Enable real-time AI tool discovery & synthesis</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Google Gemini API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKeyVisibility(!showKeyVisibility)}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showKeyVisibility ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showKeyVisibility ? "text" : "password"}
                    value={tempApiKeyInput}
                    onChange={(e) => {
                      setTempApiKeyInput(e.target.value);
                      if (keyTestStatus.state !== 'idle') {
                        setKeyTestStatus({ state: 'idle', message: '' });
                      }
                    }}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Your key is stored strictly in your browser's <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-slate-600">localStorage</code> and called directly with <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-slate-600">responseMimeType: 'application/json'</code>.
                </p>
              </div>

              {/* Test Connection Button & Status */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleTestApiKey}
                  disabled={!tempApiKeyInput.trim() || keyTestStatus.state === 'testing'}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {keyTestStatus.state === 'testing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Verifying with Google Gemini...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Test API Key Connection</span>
                    </>
                  )}
                </button>

                {keyTestStatus.state === 'success' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{keyTestStatus.message}</span>
                  </div>
                )}

                {keyTestStatus.state === 'error' && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-tight">{keyTestStatus.message}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1 text-slate-700">
                <div className="font-bold text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>How to get a free API key:</span>
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-amber-800 underline inline-flex items-center gap-0.5"
                  >
                    <span>Google AI Studio</span>
                    <ExternalLink className="w-3 h-3 text-amber-700" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline font-semibold">Google AI Studio</a>.<br />
                  2. Click <strong>Create API Key</strong> (Gemini 3.8 Flash is 100% free with generous limits).<br />
                  3. Paste the key above, test connection, and click <strong>Save Key</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      setTempApiKeyInput('');
                      localStorage.removeItem('aura_gemini_api_key');
                      setIsApiKeyModalOpen(false);
                      setToastMessage('Gemini API Key removed. Using curated catalog.');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Remove Key
                  </button>
                ) : <span />}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
