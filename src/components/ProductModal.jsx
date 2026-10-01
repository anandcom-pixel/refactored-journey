import React, { useState } from 'react';
import { X, DollarSign, Gift, MapPin, Phone, Check } from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Desk & Furniture', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Laptop & Tech', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' },
  { label: 'Books & Notes', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Clothing & Apparel', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bicycle & Sports', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Home & Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
];

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [title, setTitle] = useState(() => editingProduct?.title || '');
  const [category, setCategory] = useState(() => editingProduct?.category || 'resale');
  const [price, setPrice] = useState(() => editingProduct?.price ? String(editingProduct.price) : '');
  const [condition, setCondition] = useState(() => editingProduct?.condition || 'Like New');
  const [city, setCity] = useState(() => editingProduct?.city || 'Thiruvananthapuram');
  const [phone, setPhone] = useState(() => editingProduct?.phone || '');
  const [description, setDescription] = useState(() => editingProduct?.description || '');
  const [imageUrl, setImageUrl] = useState(() => editingProduct?.imageUrl || PRESET_IMAGES[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const productData = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: title.trim(),
      category,
      price: category === 'donation' ? '0' : price.trim() || '0',
      condition,
      city: city.trim() || 'Local Area',
      phone: phone.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    onSave(productData);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-amber-200 shadow-2xl p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              {category === 'donation' ? <Gift className="w-5 h-5 text-amber-700" /> : <DollarSign className="w-5 h-5 text-amber-700" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Listing' : 'List an Item for Resale or Donation'}
              </h2>
              <p className="text-xs text-slate-500">
                Share products with your local network or donate for a cause
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-amber-50 transition-colors"
          >
            <X className="w-5 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Toggle: Resale vs Donation */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Listing Type *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-amber-50 border border-amber-200">
              <button
                type="button"
                onClick={() => setCategory('resale')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  category === 'resale'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Resale Item (For Sale)</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('donation')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  category === 'donation'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Donation (Free Giving)</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ergonomic Office Chair, High School Math Books, Baby Cot..."
              className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                {category === 'donation' ? 'Price (Donation)' : 'Price (₹ / $) *'}
              </label>
              {category === 'donation' ? (
                <div className="w-full bg-emerald-50 text-emerald-800 font-bold text-sm px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>FREE / Complimentary</span>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-50 text-slate-900 text-sm pl-8 pr-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-sm px-3 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Brand New">Brand New (Unused)</option>
                <option value="Like New">Like New (Barely Used)</option>
                <option value="Good">Good (Working fine)</option>
                <option value="Fair">Fair (Has signs of wear)</option>
              </select>
            </div>
          </div>

          {/* City / Location & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Location / City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Thiruvananthapuram, Kerala"
                  className="w-full bg-slate-50 text-slate-900 text-sm pl-9 pr-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Contact Phone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98400 12345"
                  className="w-full bg-slate-50 text-slate-900 text-sm pl-9 pr-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Description & Pickup Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State any features, dimensions, pickup time, or reason for donation/sale..."
              className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Product Image (URL or Presets)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-amber-200 focus:outline-none focus:border-amber-500"
              />
              <label className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer transition-colors border border-amber-300">
                Upload File
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500">Quick presets:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                      : 'bg-white text-slate-600 hover:bg-amber-50 border-amber-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {imageUrl && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-amber-200 bg-slate-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-amber-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/25 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Update Listing' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
