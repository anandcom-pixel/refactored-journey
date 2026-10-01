import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Briefcase, 
  Download, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Phone, 
  Star, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Flame, 
  MessageCircle,
  X
} from 'lucide-react';
import { searchLeads, exportLeadsToCsv, INITIAL_REAL_LEADS } from '../utils/scraperService';

const COMMON_CATEGORIES = [
  { value: 'Restaurants', label: '🍽️ Restaurants & Dining' },
  { value: 'Shoes & Footwear', label: '👟 Shoes & Footwear' },
  { value: 'Retail', label: '🛍️ Retail Stores' },
  { value: 'Fitness', label: '🏋️ Fitness & Gyms' },
  { value: 'Hotels', label: '🏨 Hotels & Hospitality' },
  { value: 'Bakeries & Cafes', label: '☕ Bakeries & Cafes' },
  { value: 'Salons & Spas', label: '💇 Salons & Beauty Spas' },
  { value: 'Tech Startups', label: '💻 Tech & IT Services' },
  { value: 'custom', label: '✏️ Custom / Type Your Own...' },
];

const PRESET_SEARCHES = [
  { city: 'Thiruvananthapuram', industry: 'Restaurants' },
  { city: 'Thiruvananthapuram', industry: 'Shoes & Footwear' },
  { city: 'Thiruvananthapuram', industry: 'Fitness' },
  { city: 'Thiruvananthapuram', industry: 'Hotels' },
  { city: 'Kochi', industry: 'Retail' },
  { city: 'Bangalore', industry: 'Tech Startups' }
];

export default function LeadScraper() {
  const [city, setCity] = useState('Thiruvananthapuram');
  const [selectedCategory, setSelectedCategory] = useState('Restaurants');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [leads, setLeads] = useState(() => INITIAL_REAL_LEADS);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'opportunities', 'healthy', 'no-website'
  const [copiedId, setCopiedId] = useState(null);
  const [lastSearched, setLastSearched] = useState({ city: 'Thiruvananthapuram', industry: 'Restaurants' });

  const getEffectiveCategory = (overrideInd) => {
    if (overrideInd !== undefined && overrideInd !== null) return overrideInd;
    if (isCustomMode) {
      return customCategory.trim() || 'Retail';
    }
    return selectedCategory;
  };

  const handleSearch = async (c = city, ind) => {
    const searchCity = (c || city).trim();
    const searchInd = getEffectiveCategory(ind);
    if (!searchCity || !searchInd) return;

    setIsLoading(true);
    try {
      const results = await searchLeads(searchCity, searchInd);
      setLeads(results);
      setLastSearched({ city: searchCity, industry: searchInd });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (p) => {
    setCity(p.city);
    const match = COMMON_CATEGORIES.find(c => c.value.toLowerCase() === p.industry.toLowerCase());
    if (match) {
      setSelectedCategory(match.value);
      setIsCustomMode(false);
    } else {
      setCustomCategory(p.industry);
      setIsCustomMode(true);
    }
    handleSearch(p.city, p.industry);
  };

  const handleExportCsv = () => {
    exportLeadsToCsv(filteredLeads, lastSearched.city, lastSearched.industry);
  };

  const handleCopyLead = (lead) => {
    const text = `${lead.name} (${lead.industry})\n📍 ${lead.address}\n📞 ${lead.phone}\n🌐 ${lead.website || 'No website'}\nAudit: ${lead.audit?.status || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered leads
  const filteredLeads = leads.filter(lead => {
    if (filterType === 'opportunities') {
      return !lead.website || lead.audit?.opportunity?.includes('High') || lead.audit?.opportunity?.includes('Medium');
    }
    if (filterType === 'no-website') {
      return !lead.website;
    }
    if (filterType === 'healthy') {
      return lead.audit?.isHealthy;
    }
    return true;
  });

  // Metrics
  const totalLeads = leads.length;
  const noWebsiteCount = leads.filter(l => !l.website).length;
  const opportunityCount = leads.filter(l => !l.website || !l.audit?.isHealthy).length;
  const healthyCount = leads.filter(l => l.audit?.isHealthy).length;

  return (
    <div className="space-y-6">
      {/* Search & Scraper Control Banner */}
      <div className="rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Building2 className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Local Client & Business Lead Generator
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Real OpenStreetMap Listings & Live Audits
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live POI directory extraction with real-time HTTP socket audits, SSL checks, and CSV export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleExportCsv}
              disabled={filteredLeads.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Download results as formatted CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export to CSV ({filteredLeads.length})</span>
            </button>
          </div>
        </div>

        {/* Search Inputs Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            {/* Location Input */}
            <div className="sm:col-span-5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Target Location / Region</span>
                </span>
                {city !== 'Thiruvananthapuram' && (
                  <button
                    type="button"
                    onClick={() => setCity('Thiruvananthapuram')}
                    className="text-[10px] text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
                  >
                    Reset default
                  </button>
                )}
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city, town, or region (e.g. Thiruvananthapuram)..."
                  className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors font-medium"
                />
                {city && (
                  <button
                    type="button"
                    onClick={() => setCity('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
                    title="Clear location text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category / Industry Input */}
            <div className="sm:col-span-5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                  <span>Category / Industry</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(!isCustomMode);
                    if (!isCustomMode && !customCategory) {
                      setCustomCategory(selectedCategory);
                    }
                  }}
                  className="text-[10px] text-amber-900 hover:text-amber-950 font-bold bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300 transition-colors cursor-pointer"
                >
                  {isCustomMode ? '← Common Dropdown' : '✏️ Custom Text Box'}
                </button>
              </div>

              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                {isCustomMode ? (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type custom category (e.g. Shoes & Footwear, Fitness, Retail)..."
                    className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors font-medium ring-1 ring-amber-300/40"
                    autoFocus
                  />
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomMode(true);
                        setCustomCategory('');
                      } else {
                        setSelectedCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-8 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors font-medium cursor-pointer"
                  >
                    {COMMON_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Search Leads Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Leads</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Category Suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Categories:
          </span>
          {[
            { label: '👟 Shoes & Footwear', cat: 'Shoes & Footwear' },
            { label: '🛍️ Retail', cat: 'Retail' },
            { label: '🍽️ Restaurants', cat: 'Restaurants' },
            { label: '🏋️ Fitness', cat: 'Fitness' },
            { label: '🏨 Hotels', cat: 'Hotels' },
            { label: '☕ Cafes', cat: 'Bakeries & Cafes' }
          ].map((chip, idx) => {
            const isActive = !isCustomMode && selectedCategory === chip.cat;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setSelectedCategory(chip.cat);
                  handleSearch(city, chip.cat);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Searches:</span>
          {PRESET_SEARCHES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(p)}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              {p.city} • {p.industry}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leads Found</div>
            <div className="text-base font-black text-slate-900 font-mono">{totalLeads}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sales Opportunities</div>
            <div className="text-base font-black text-rose-700 font-mono">{opportunityCount}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">No Website</div>
            <div className="text-base font-black text-amber-800 font-mono">{noWebsiteCount}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Healthy Sites</div>
            <div className="text-base font-black text-emerald-700 font-mono">{healthyCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200/80 text-xs">
          {[
            { id: 'all', label: `All Leads (${leads.length})` },
            { id: 'opportunities', label: `🔥 High Pitch Opportunity (${opportunityCount})` },
            { id: 'no-website', label: `⚠️ No Website (${noWebsiteCount})` },
            { id: 'healthy', label: `✅ Healthy Websites (${healthyCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredLeads.length}</span> leads in{' '}
          <span className="font-bold text-amber-800">{lastSearched.city}</span> ({lastSearched.industry})
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-2xl bg-white/95 border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50/70 border-b border-amber-200/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Business Name & Rating</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Website URL</th>
                <th className="py-3 px-4">Technical Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto text-amber-500 mb-2" />
                    <p className="font-bold text-slate-800 text-sm">
                      Searching real listings & running live technical website audits...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Querying directory for <span className="font-bold text-amber-800">{isCustomMode ? customCategory : selectedCategory}</span> in <span className="font-bold text-amber-800">{city}</span>
                    </p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No leads match this filter.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try switching to 'All Leads' or search a different city.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const hasWebsite = Boolean(lead.website);
                  const isHealthy = lead.audit?.isHealthy;
                  const isOpportunity = !hasWebsite || lead.audit?.opportunity?.includes('High');

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Business Name & Rating */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                              {lead.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center text-amber-600 font-bold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                                {lead.rating}
                              </span>
                              <span>•</span>
                              <span>{lead.reviews} reviews</span>
                              <span>•</span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                                {lead.source || 'OpenStreetMap'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Address */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px] mb-1">
                          {lead.industry}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{lead.address}</span>
                        </div>
                      </td>

                      {/* Contact Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-medium whitespace-nowrap">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>

                      {/* Website URL */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hasWebsite ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-900 font-medium underline flex items-center gap-1 max-w-[160px] truncate"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200">
                            No Website
                          </span>
                        )}
                      </td>

                      {/* Technical Audit Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isHealthy ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : hasWebsite ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            )}
                            <span className={`font-bold text-[11px] ${
                              isHealthy ? 'text-emerald-700' : hasWebsite ? 'text-amber-800' : 'text-rose-700'
                            }`}>
                              {lead.audit?.status || 'Audit Pending'}
                            </span>
                          </div>

                          {/* Technical metadata pills */}
                          <div className="flex items-center gap-1 flex-wrap text-[10px]">
                            {lead.audit?.responseTimeMs > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                ⚡ {lead.audit.responseTimeMs}ms
                              </span>
                            )}
                            {hasWebsite && (
                              <span className={`px-1.5 py-0.5 rounded font-medium ${
                                lead.audit?.hasSsl
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                                {lead.audit?.hasSsl ? 'SSL Active' : 'No SSL'}
                              </span>
                            )}
                            {isOpportunity && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                                🎯 Pitch Opportunity
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Lead */}
                          <button
                            type="button"
                            onClick={() => handleCopyLead(lead)}
                            title="Copy lead contact info"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-2xs"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-amber-700" />
                            )}
                          </button>

                          {/* WhatsApp Pitch */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Hello ${lead.name}, I noticed your business in ${lead.city} and wanted to connect regarding your online presence!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contact via WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
