import React, { useState, useRef } from 'react';
import { 
  X, 
  DollarSign, 
  Gift, 
  MapPin, 
  Phone, 
  Check, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { generateProductSlug, PRESET_PRODUCT_IMAGES, compressImageFile } from '../utils/productData';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [title, setTitle] = useState(() => editingProduct?.title || '');
  const [category, setCategory] = useState(() => editingProduct?.category || 'resale');
  const [price, setPrice] = useState(() => editingProduct?.price ? String(editingProduct.price) : '');
  const [condition, setCondition] = useState(() => editingProduct?.condition || 'Like New');
  const [city, setCity] = useState(() => editingProduct?.city || 'Thiruvananthapuram');
  const [phone, setPhone] = useState(() => editingProduct?.phone || '');
  const [description, setDescription] = useState(() => editingProduct?.description || '');

  // Image state handling: supports Upload (from device), URL (web link), and Presets
  const [imageUrl, setImageUrl] = useState(() => editingProduct?.imageUrl || PRESET_PRODUCT_IMAGES[0].url);
  const [imageSourceType, setImageSourceType] = useState(() => {
    if (!editingProduct?.imageUrl) return 'preset';
    if (editingProduct.imageUrl.startsWith('data:image/')) return 'upload';
    return 'url';
  });
  const [activeImageTab, setActiveImageTab] = useState(() => {
    if (editingProduct?.imageUrl?.startsWith('data:image/')) return 'upload';
    return 'upload'; // Default to upload for convenient file selection
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageSizeText, setImageSizeText] = useState(null);
  const [imageError, setImageError] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const prodId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const slug = editingProduct?.slug || generateProductSlug(title.trim(), prodId);

    const productData = {
      id: prodId,
      slug,
      title: title.trim(),
      category,
      price: category === 'donation' ? '0' : price.trim() || '0',
      condition,
      city: city.trim() || 'Local Area',
      phone: phone.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_PRODUCT_IMAGES[0].url,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    onSave(productData);
    onClose();
  };

  const handleProcessFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    try {
      setIsProcessingImage(true);
      setImageError(null);
      // Client-side compression prevents localStorage quota overflow while keeping sharp quality
      const { dataUrl, sizeKb, width, height } = await compressImageFile(file, 1200, 0.85);
      setImageUrl(dataUrl);
      setImageSourceType('upload');
      setImageSizeText(`${width}×${height} • ~${sizeKb} KB`);
    } catch (err) {
      console.error('Failed to compress image:', err);
      setImageError('Could not process this image. Please try another file or enter an image URL.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSelectPreset = (presetUrl) => {
    setImageUrl(presetUrl);
    setImageSourceType('preset');
    setImageSizeText(null);
    setImageError(null);
  };

  const handleClearImage = () => {
    setImageUrl('');
    setImageSizeText(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-amber-200 shadow-2xl p-6 my-8 max-h-[92vh] overflow-y-auto">
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
              placeholder="e.g. Ergonomic Office Chair, High School Math Books, Mountain Bike..."
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
                  placeholder="e.g. +91 98460 11223"
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
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State any features, dimensions, pickup time, or reason for donation/sale..."
              className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Product Image Input (Upload File, Paste URL, or Pick Preset) */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>Product Image *</span>
              </label>

              {/* Mode Selector Tabs */}
              <div className="flex items-center bg-white rounded-lg p-0.5 border border-amber-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    activeImageTab === 'upload'
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab('url')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    activeImageTab === 'url'
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Paste URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab('presets')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    activeImageTab === 'presets'
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Presets</span>
                </button>
              </div>
            </div>

            {/* TAB 1: File Upload Dropzone */}
            {activeImageTab === 'upload' && (
              <div className="space-y-2">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-amber-500 bg-amber-100/70 scale-[0.99]'
                      : 'border-amber-300 hover:border-amber-400 bg-white/80 hover:bg-white'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {isProcessingImage ? (
                    <div className="flex items-center gap-2 text-amber-700 py-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs font-bold">Compressing & optimizing photo...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-2.5 rounded-full bg-amber-100 text-amber-800 shadow-2xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse image or drag & drop here
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP (auto-compressed for fast loading)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Direct Image URL */}
            {activeImageTab === 'url' && (
              <div className="space-y-1.5">
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageSourceType('url');
                      setImageSizeText(null);
                    }}
                    placeholder="https://images.unsplash.com/photo-... or any public image URL"
                    className="w-full bg-white text-slate-900 text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 font-mono shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: Direct web links unfurl into beautiful thumbnail preview cards in WhatsApp chats.
                </p>
              </div>
            )}

            {/* TAB 3: Sample Presets */}
            {activeImageTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-600 font-medium">
                  Select a high-resolution sample image matching your item:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        imageUrl === preset.url
                          ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-400'
                          : 'bg-white hover:bg-amber-50/80 border-amber-200 text-slate-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-md object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold truncate leading-tight">{preset.label}</div>
                        <div className="text-[9px] text-slate-400 truncate">{preset.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error notice if any */}
            {imageError && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
                ⚠️ {imageError}
              </p>
            )}

            {/* Live Image Preview Card */}
            {imageUrl && (
              <div className="mt-2 bg-white rounded-xl border border-amber-200/90 p-2.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-amber-200 shrink-0">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError('Invalid image URL or unable to load image preview')}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">Preview Active</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {imageSourceType === 'upload' ? '📁 Device Upload' : imageSourceType === 'preset' ? '🎨 Preset Photo' : '🌐 Web URL'}
                      </span>
                    </div>
                    {imageSizeText ? (
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{imageSizeText}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] mt-0.5">{imageUrl}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearImage}
                  title="Remove image"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
