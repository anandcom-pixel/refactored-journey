import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Gift, 
  DollarSign, 
  Plus, 
  Search, 
  Share2, 
  Edit2, 
  Trash2, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  MessageCircle,
  Globe,
  X,
  Link as LinkIcon,
  Maximize2
} from 'lucide-react';
import ProductModal from './ProductModal';
import { generateProductSlug } from '../utils/productData';

// Instagram Vector Icon
function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Facebook Vector Icon
function FacebookIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Dynamic Base URL Resolver (avoids localhost so shared links work for external recipients)
function getLiveDomain() {
  if (typeof window === 'undefined') return 'https://aura-dashboard.vercel.app';
  
  // 1. User-customized production domain in localStorage
  const saved = localStorage.getItem('aura_production_domain');
  if (saved && saved.trim()) {
    let clean = saved.trim();
    if (!/^https?:\/\//i.test(clean)) clean = `https://${clean}`;
    return clean.replace(/\/+$/, '');
  }

  // 2. If running in live production (e.g. Vercel preview or custom domain)
  const host = window.location.hostname;
  if (host && host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.') && !host.startsWith('10.')) {
    return window.location.origin;
  }

  // 3. Fallback when developing locally to ensure social share URLs are valid public links
  return 'https://aura-dashboard.vercel.app';
}

export default function ProductHub({ products, onUpdateProducts }) {
  const [filter, setFilter] = useState('all'); // all, resale, donation
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Dynamic Base Domain configuration
  const [productionDomain, setProductionDomain] = useState(() => getLiveDomain());
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [tempDomainInput, setTempDomainInput] = useState('');

  // Target direct product from URL (?product=id or #product-id)
  const [highlightedProductId, setHighlightedProductId] = useState(null);

  // Full photo preview lightbox modal
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Notifications & Copy feedback
  const [copiedAction, setCopiedAction] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (!notificationMessage) return;
    const timer = setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notificationMessage]);

  // Deep Link Detection and Auto-Scroll to Target Product
  useEffect(() => {
    const detectTargetProduct = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('product');
      const hash = window.location.hash || '';
      const hashId = hash.startsWith('#product-') ? hash.replace('#product-', '') : (hash.startsWith('#') ? hash.substring(1) : null);
      
      const targetId = queryId || hashId;
      if (targetId) {
        setHighlightedProductId(targetId);
        
        // Find matching product in list
        const matched = products.find(p => p.id === targetId || p.slug === targetId);
        if (matched) {
          // If current category filter hides it, switch to 'all' so it is visible
          setFilter(prevFilter => (prevFilter !== 'all' && prevFilter !== matched.category ? 'all' : prevFilter));
        }

        // Scroll target card into view smoothly
        setTimeout(() => {
          const el = document.getElementById(`product-${targetId}`) || document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 250);
      }
    };

    detectTargetProduct();
    window.addEventListener('hashchange', detectTargetProduct);
    window.addEventListener('popstate', detectTargetProduct);
    return () => {
      window.removeEventListener('hashchange', detectTargetProduct);
      window.removeEventListener('popstate', detectTargetProduct);
    };
  }, [products]);

  // Compute metrics
  const totalListings = products.length;
  const resaleItems = products.filter(p => p.category === 'resale');
  const donationItems = products.filter(p => p.category === 'donation');
  const totalResaleValue = resaleItems.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

  // Save customized production domain
  const handleSaveDomain = (newDomain) => {
    let clean = (newDomain || '').trim();
    if (clean) {
      if (!/^https?:\/\//i.test(clean)) clean = `https://${clean}`;
      clean = clean.replace(/\/+$/, '');
      localStorage.setItem('aura_production_domain', clean);
      setProductionDomain(clean);
    } else {
      localStorage.removeItem('aura_production_domain');
      setProductionDomain(getLiveDomain());
    }
    setIsDomainModalOpen(false);
  };

  // Formatter for rich social shares pointing DIRECTLY to the specific individual product
  const getProductShareData = (product) => {
    const isDonation = product.category === 'donation';
    const priceText = isDonation ? 'FREE DONATION' : `₹${parseFloat(product.price || 0).toLocaleString('en-IN')}`;
    const priceDisplay = isDonation ? 'FREE DONATION' : `₹${parseFloat(product.price || 0).toLocaleString('en-IN')}`;
    
    // Clean direct product URL without duplicating query param (?product=) and hash anchor (#product-)
    const directProductUrl = `${productionDomain}/?product=${encodeURIComponent(product.id)}`;

    // Clean preview thumbnail or image reference for WhatsApp unfurling
    let imageReferenceText = '';
    if (product.imageUrl) {
      if (/^https?:\/\//i.test(product.imageUrl)) {
        // Public web URLs automatically generate visual thumbnail preview cards in WhatsApp
        imageReferenceText = `Photo Preview:\n${product.imageUrl}\n\n`;
      } else {
        // Device upload base64 images - point buyer to direct listing photo
        imageReferenceText = `Photo: HD photo attached (view in listing link)\n\n`;
      }
    }

    // WhatsApp formatted text with standard emojis (🏷️, 💰, 📍, 📝, 📞)
    const whatsAppText = 
`🏷️ *${product.title}*
💰 Price: ${priceText}
📍 Location: ${product.city}
🏷️ Condition: ${product.condition}

${imageReferenceText}📝 Description:
${product.description || 'Quality pre-owned item ready for resale or donation.'}

${product.phone ? `📞 Contact: ${product.phone}\n` : ''}Direct Product Link:
${directProductUrl}

Shared via Aura Resale & Donation Hub`;

    // Facebook quote & direct link
    const facebookQuote = `🏷️ ${product.title} (Price: ${priceText}) - ${product.description || ''} | Link: ${directProductUrl}`;

    // Instagram formatted caption (with standard emojis)
    const instagramCaption = 
`🏷️ ${product.title}
💰 Price: ${priceText}
📍 Location: ${product.city}
🏷️ Condition: ${product.condition}

${product.imageUrl && /^https?:\/\//i.test(product.imageUrl) ? `Photo Preview: ${product.imageUrl}\n\n` : ''}📝 Description:
${product.description || 'Quality pre-owned item ready for resale or donation.'}

${product.phone ? `📞 Contact: ${product.phone}\n` : ''}Direct Product Link:
${directProductUrl}

#resale #preloved #donation #${product.category} #${(product.city || 'local').toLowerCase().replace(/[^a-z0-9]/g, '')} #aurahub`;

    return {
      title: product.title,
      priceDisplay,
      priceText,
      directProductUrl,
      whatsAppText,
      facebookQuote,
      instagramCaption
    };
  };

  // WhatsApp Share handler
  const handleWhatsAppShare = (product) => {
    const data = getProductShareData(product);
    const url = `https://wa.me/?text=${encodeURIComponent(data.whatsAppText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Facebook Share handler (uses direct product URL for the Facebook preview scraper)
  const handleFacebookShare = (product) => {
    const data = getProductShareData(product);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.directProductUrl)}&quote=${encodeURIComponent(data.facebookQuote)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Instagram Share handler (copies formatted caption with direct product link and alerts user)
  const handleInstagramShare = (product) => {
    const data = getProductShareData(product);
    navigator.clipboard.writeText(data.instagramCaption);
    setCopiedAction(`${product.id}-instagram`);
    
    // Exact requested notification string
    setNotificationMessage('Product details copied! Paste them into your Instagram post or story.');
    
    setTimeout(() => setCopiedAction(null), 2500);
  };

  // Copy full details & direct link
  const handleCopyDetails = (product) => {
    const data = getProductShareData(product);
    navigator.clipboard.writeText(data.whatsAppText);
    setCopiedAction(`${product.id}-copy`);
    setNotificationMessage(`Product details & direct link for "${product.title}" copied!`);
    setTimeout(() => setCopiedAction(null), 2500);
  };

  // Copy direct product URL only
  const handleCopyDirectLinkOnly = (product) => {
    const data = getProductShareData(product);
    navigator.clipboard.writeText(data.directProductUrl);
    setCopiedAction(`${product.id}-link`);
    setNotificationMessage(`Direct link for "${product.title}" copied!`);
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      onUpdateProducts([productData, ...products]);
    }
    setEditingProduct(null);
  };

  // Filter & Sort
  const filteredProducts = products.filter(p => {
    if (filter === 'resale') return p.category === 'resale';
    if (filter === 'donation') return p.category === 'donation';
    return true;
  }).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) ||
           p.city.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Listings</div>
            <div className="text-lg font-black text-slate-900 font-mono">{totalListings}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">For Resale</div>
            <div className="text-lg font-black text-amber-800 font-mono">
              {resaleItems.length} <span className="text-xs text-slate-400 font-normal">(₹{totalResaleValue.toLocaleString()})</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <Gift className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Free Donations</div>
            <div className="text-lg font-black text-emerald-700 font-mono">{donationItems.length}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-100 via-pink-100 to-rose-100 text-pink-700">
            <InstagramIcon className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Social Channels</div>
            <div className="text-xs font-bold text-slate-800 mt-1">WhatsApp • FB • Instagram</div>
          </div>
        </div>
      </div>

      {/* Live Share Domain Banner (Replaces localhost in shared links) */}
      <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Globe className="w-4 h-4 text-amber-700" />
            <span>Live Sharing Domain:</span>
          </div>
          <code className="px-2.5 py-0.5 rounded-lg bg-white border border-amber-300 font-mono text-[11px] text-amber-900 font-bold shadow-2xs">
            {productionDomain}
          </code>
          <span className="text-[11px] text-slate-500">
            (Product share links route to this live site instead of localhost)
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setTempDomainInput(productionDomain);
            setIsDomainModalOpen(true);
          }}
          className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer"
        >
          Configure Domain
        </button>
      </div>

      {/* Action Bar: Filters, Search & Add Button */}
      <div className="rounded-2xl bg-white/95 border border-amber-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200/80 text-xs self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'resale', label: '💰 For Sale' },
            { id: 'donation', label: '🎁 Free Donations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort & Add */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, city..."
              className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Add Listing Button */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ List Product</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center flex flex-col items-center justify-center rounded-2xl bg-white/60 border border-dashed border-amber-200 p-8">
            <ShoppingBag className="w-12 h-12 text-amber-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No items found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Try adjusting your search filter, or be the first to list an item for resale or donation!
            </p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-600 cursor-pointer"
            >
              List an Item Now
            </button>
          </div>
        ) : (
          filteredProducts.map(product => {
            const isDonation = product.category === 'donation';
            const isTarget = highlightedProductId === product.id || highlightedProductId === product.slug;
            const shareData = getProductShareData(product);

            return (
              <div
                key={product.id}
                id={`product-${product.id}`}
                data-product-id={product.id}
                data-product-slug={product.slug || generateProductSlug(product.title, product.id)}
                className={`group rounded-2xl bg-white/95 border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between scroll-mt-24 ${
                  isTarget
                    ? 'border-amber-500 ring-4 ring-amber-400/40 shadow-xl scale-[1.01]'
                    : 'border-amber-200/80 hover:border-amber-300'
                }`}
              >
                {/* Target Linked Item Banner */}
                {isTarget && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3.5 py-1.5 text-xs font-bold flex items-center justify-between shadow-xs">
                    <span className="flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Shared Product Linked Directly</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setHighlightedProductId(null)}
                      className="text-slate-950 hover:bg-black/10 px-1 rounded font-mono text-xs cursor-pointer"
                      title="Dismiss highlight"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Prominent Image & Badges with Full Lightbox Click */}
                <div 
                  onClick={() => setSelectedPhoto(product)}
                  className="relative h-52 sm:h-56 w-full bg-slate-100 overflow-hidden cursor-pointer group/img"
                  title="Click to view full photo"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Gradient overlay for high badge contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    {isDonation ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-[11px] shadow-sm flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        <span>FREE DONATION</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-0.5">
                        <span>₹{parseFloat(product.price).toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  {/* Condition badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold shadow-xs">
                      {product.condition}
                    </span>
                  </div>

                  {/* Enlarge Callout on hover */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 hover:bg-slate-950 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md border border-white/20">
                      <Maximize2 className="w-3 h-3 text-amber-400" />
                      <span>View Photo</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {product.title}
                    </h3>

                    {/* Location and Direct Link Copy Pill */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{product.city}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyDirectLinkOnly(product)}
                        title="Copy direct product URL"
                        className="text-[10px] text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 font-mono font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs"
                      >
                        <LinkIcon className="w-2.5 h-2.5 text-amber-700" />
                        <span>{copiedAction === `${product.id}-link` ? 'Copied' : `#${product.id}`}</span>
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Contact info if available */}
                  {product.phone && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{product.phone}</span>
                    </div>
                  )}

                  {/* Social Share Buttons with Specific Product Deep Link */}
                  <div className="mt-3 pt-2.5 border-t border-amber-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-amber-600" />
                        <span>Share Specific Item:</span>
                      </div>
                      <span className="text-[10px] text-amber-800/90 font-medium font-mono truncate max-w-[130px]" title={shareData.directProductUrl}>
                        ?product={product.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {/* WhatsApp Share */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppShare(product)}
                        title="Share on WhatsApp with direct product link, price, and description"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20 shrink-0" />
                        <span className="truncate">WhatsApp</span>
                      </button>

                      {/* Facebook Share */}
                      <button
                        type="button"
                        onClick={() => handleFacebookShare(product)}
                        title="Share on Facebook with direct preview URL to this item"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <FacebookIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">Facebook</span>
                      </button>

                      {/* Instagram Share */}
                      <button
                        type="button"
                        onClick={() => handleInstagramShare(product)}
                        title="Copy Instagram caption formatted specifically for this item"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-900 border border-pink-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedAction === `${product.id}-instagram` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                            <span className="text-pink-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <InstagramIcon className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                            <span className="truncate">Instagram</span>
                          </>
                        )}
                      </button>

                      {/* Copy Link / Details */}
                      <button
                        type="button"
                        onClick={() => handleCopyDetails(product)}
                        title="Copy direct product link & full details to clipboard"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedAction === `${product.id}-copy` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Edit & Delete Controls */}
                    <div className="flex items-center justify-end gap-1 pt-1 text-slate-400">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded-md hover:bg-slate-100 hover:text-amber-800 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 rounded-md hover:bg-rose-50 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Instagram & Share Notification Toast */}
      {notificationMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-pink-500/40 backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shrink-0 mt-0.5 shadow-md">
            <InstagramIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Ready</span>
            </div>
            <p className="text-xs text-slate-200 font-medium mt-1 leading-relaxed">
              {notificationMessage}
            </p>
          </div>
          <button
            onClick={() => setNotificationMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Domain Settings Modal */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Globe className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Configure Live Share Domain</h3>
                  <p className="text-xs text-slate-500">Shared social links will route to this base URL</p>
                </div>
              </div>
              <button
                onClick={() => setIsDomainModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Production / Live Website URL
                </label>
                <input
                  type="url"
                  value={tempDomainInput}
                  onChange={(e) => setTempDomainInput(e.target.value)}
                  placeholder="https://your-app.vercel.app"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Replaces localhost so shared links on WhatsApp, Facebook, and Instagram work for anyone on the internet.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => setTempDomainInput(window.location.origin)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Current Window ({window.location.host})
                </button>
                <button
                  type="button"
                  onClick={() => setTempDomainInput('https://aura-dashboard.vercel.app')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 transition-colors cursor-pointer"
                >
                  Default Vercel URL
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={() => setIsDomainModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveDomain(tempDomainInput)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Save Domain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit / Add Modal */}
      <ProductModal
        key={editingProduct?.id || (isModalOpen ? 'open' : 'closed')}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Full-resolution Product Photo Lightbox */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white rounded-2xl border border-amber-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-amber-100 bg-amber-50/50">
              <div className="min-w-0 pr-4">
                <h3 className="font-bold text-slate-900 text-base truncate">{selectedPhoto.title}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="font-bold text-amber-800">
                    {selectedPhoto.category === 'donation' ? 'Free Donation' : `₹${parseFloat(selectedPhoto.price || 0).toLocaleString()}`}
                  </span>
                  <span>•</span>
                  <span>{selectedPhoto.city}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{selectedPhoto.condition}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                title="Close photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View */}
            <div className="max-h-[65vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Footer with quick action buttons */}
            <div className="p-3.5 bg-white border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 truncate max-w-md">
                {selectedPhoto.description || 'Listing photo'}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handleWhatsAppShare(selectedPhoto);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
