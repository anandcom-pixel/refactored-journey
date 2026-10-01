import React, { useState } from 'react';
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
  MessageCircle
} from 'lucide-react';
import ProductModal from './ProductModal';

export default function ProductHub({ products, onUpdateProducts }) {
  const [filter, setFilter] = useState('all'); // all, resale, donation
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Compute metrics
  const totalListings = products.length;
  const resaleItems = products.filter(p => p.category === 'resale');
  const donationItems = products.filter(p => p.category === 'donation');
  const totalResaleValue = resaleItems.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

  // Social Sharing Handlers
  const getShareMessage = (product) => {
    const isDonation = product.category === 'donation';
    const typeLabel = isDonation ? '🎁 FREE DONATION' : `💰 ₹${product.price} (Resale)`;
    return `*${product.title}*\n${typeLabel}\n📍 Location: ${product.city}\n🏷️ Condition: ${product.condition}\n\n${product.description}\n\n${product.phone ? `📞 Contact: ${product.phone}` : ''}\nShared via Aura Resale & Donation Hub`;
  };

  const handleWhatsAppShare = (product) => {
    const msg = getShareMessage(product);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = (product) => {
    const quote = getShareMessage(product);
    const currentUrl = window.location.href;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(quote)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDetails = (product) => {
    const text = getShareMessage(product);
    navigator.clipboard.writeText(text);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
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
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
            <Share2 className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Social Channels</div>
            <div className="text-xs font-bold text-slate-800 mt-1">WhatsApp & Facebook</div>
          </div>
        </div>
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

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white/95 border border-amber-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5">
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
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold">
                      {product.condition}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {product.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{product.city}</span>
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

                  {/* Social Share Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-amber-100 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-amber-600" />
                      <span>Direct Share:</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {/* WhatsApp Share */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppShare(product)}
                        title="Share on WhatsApp"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Facebook Share */}
                      <button
                        type="button"
                        onClick={() => handleFacebookShare(product)}
                        title="Share on Facebook"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Facebook</span>
                      </button>

                      {/* Copy Link / Message */}
                      <button
                        type="button"
                        onClick={() => handleCopyDetails(product)}
                        title="Copy formatted product text"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        {copiedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-700" />
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
                        className="p-1 rounded-md hover:bg-slate-100 hover:text-amber-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 rounded-md hover:bg-rose-50 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors"
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

      {/* Modal */}
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
    </div>
  );
}
