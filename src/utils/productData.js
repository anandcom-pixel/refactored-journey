export function generateProductSlug(title, id) {
  const cleanTitle = (title || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${cleanTitle}-${id}`;
}

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'solid-teak-wood-study-office-desk-prod-1',
    title: 'Solid Teak Wood Study & Office Desk',
    category: 'resale',
    price: '4200',
    condition: 'Like New',
    city: 'Pattom, Thiruvananthapuram',
    phone: '+91 98460 11223',
    description: 'Spacious study desk with 3 smooth sliding drawers. Perfect for remote work or study setup. Self pickup from Pattom junction.',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    slug: 'college-textbooks-cse-prod-2',
    title: 'Engineering & Mathematics College Textbooks',
    category: 'donation',
    price: '0',
    condition: 'Good',
    city: 'Technopark, Thiruvananthapuram',
    phone: '+91 98950 33445',
    description: 'Full semester 1-4 textbook collection for Computer Science & Engineering. Giving away for free to any aspiring student in need.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-30T14:30:00.000Z'
  },
  {
    id: 'prod-3',
    slug: 'mountain-bicycle-hero-sprint-prod-3',
    title: 'Gently Used 21-Speed Mountain Bicycle',
    category: 'resale',
    price: '6500',
    condition: 'Like New',
    city: 'Kowdiar, Thiruvananthapuram',
    phone: '+91 97450 55667',
    description: 'Hero Sprint 26T cycle with disc brakes and Shimano gears. Barely ridden for 4 months. Includes lock and bell.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-29T18:00:00.000Z'
  },
  {
    id: 'prod-4',
    slug: 'baby-high-chair-walker-prod-4',
    title: 'Baby High Chair & Play Walker',
    category: 'donation',
    price: '0',
    condition: 'Good',
    city: 'Sasthamangalam, Thiruvananthapuram',
    phone: '+91 98470 77889',
    description: 'Clean and sanitized baby high chair. Outgrown by our toddler, happy to donate to a family with an infant.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-28T09:15:00.000Z'
  }
];

export const PRESET_PRODUCT_IMAGES = [
  { label: 'Desk & Office', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', category: 'Furniture' },
  { label: 'Laptop & Tech', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', category: 'Electronics' },
  { label: 'Books & Study', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', category: 'Education' },
  { label: 'Clothing & Apparel', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', category: 'Fashion' },
  { label: 'Bicycle & Sports', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', category: 'Fitness' },
  { label: 'Home & Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', category: 'Appliances' },
];

/**
 * Compresses an image file from the device using an HTML5 Canvas,
 * reducing multi-megabyte photos to an optimized JPEG (~100-250KB)
 * to prevent browser localStorage quota overflow.
 */
export function compressImageFile(file, maxDim = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          sizeKb: Math.round((dataUrl.length * 3) / 4 / 1024)
        });
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 Data URL to a native binary Blob.
 * Essential for mobile browsers (iOS Safari / Android Chrome) where
 * data: URLs cannot be directly downloaded or shared.
 */
export function dataUrlToBlob(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.warn('Failed to convert data URL to Blob:', err);
    return null;
  }
}

/**
 * Robust clipboard copy function supporting both modern navigator.clipboard
 * and legacy/mobile webview fallback (document.execCommand).
 */
export async function copyTextToClipboard(text) {
  if (typeof window === 'undefined' || !text) return false;

  // 1. Modern Async Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, using execCommand fallback:', err);
    }
  }

  // 2. Legacy & Mobile Webview fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Mobile Safari selection
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.warn('execCommand copy fallback failed:', err);
    return false;
  }
}

/**
 * Converts an image source (data URL or web URL) to a File object
 * so it can be packaged into navigator.share({ files: [...] }).
 */
export async function getFileFromImageUrl(imageUrl, title = 'product') {
  if (!imageUrl) return null;
  const cleanName = (title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);

  // 1. Base64 Data URL (e.g. from local device upload)
  if (imageUrl.startsWith('data:image/')) {
    const blob = dataUrlToBlob(imageUrl);
    if (!blob) return null;
    const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    return new File([blob], `${cleanName}.${ext}`, { type: blob.type || 'image/jpeg' });
  }

  // 2. Remote HTTP/HTTPS URL
  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        return new File([blob], `${cleanName}.${ext}`, { type: blob.type || 'image/jpeg' });
      }
    } catch (e) {
      console.warn('Direct fetch failed in getFileFromImageUrl, attempting canvas fallback:', e);
    }

    // Canvas fallback for remote images when direct fetch is blocked
    try {
      const blob = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = imageUrl;
      });
      if (blob) {
        return new File([blob], `${cleanName}.jpg`, { type: 'image/jpeg' });
      }
    } catch (err) {
      console.warn('Canvas fallback failed in getFileFromImageUrl:', err);
    }
  }

  return null;
}

/**
 * Triggers an immediate, robust download of the product image file
 * directly to the user's device gallery / downloads folder.
 * Uses binary Blob URLs for full iOS Safari & Android Chrome compatibility.
 */
export async function downloadImageFile(imageUrl, title = 'product') {
  if (!imageUrl || typeof window === 'undefined') return false;
  const cleanName = (title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);

  try {
    // 1. Base64 Data URL: convert to binary Blob and object URL for mobile download support
    if (imageUrl.startsWith('data:image/')) {
      const blob = dataUrlToBlob(imageUrl);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        a.download = `${cleanName}.${ext}`;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
        return true;
      }
    }

    // 2. Web URL: fetch blob or use canvas fallback, then download
    if (/^https?:\/\//i.test(imageUrl)) {
      let blob = null;
      try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        if (response.ok) {
          blob = await response.blob();
        }
      } catch (e) {
        console.warn('Direct fetch failed in downloadImageFile, trying canvas fallback:', e);
      }

      if (!blob) {
        // Canvas fallback
        blob = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = imageUrl;
        });
      }

      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        a.download = `${cleanName}.${ext}`;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
        return true;
      }

      // 3. Direct anchor fallback
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${cleanName}.jpg`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
  } catch (err) {
    console.warn('downloadImageFile failed, attempting window fallback:', err);
    try {
      const win = window.open(imageUrl, '_blank');
      if (win) return true;
    } catch {
      // ignore
    }
  }
  return false;
}



