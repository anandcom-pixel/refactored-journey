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
 * Converts an image source (data URL or web URL) to a File object
 * so it can be packaged into navigator.share({ files: [...] }).
 */
export async function getFileFromImageUrl(imageUrl, title = 'product') {
  if (!imageUrl) return null;
  const cleanName = (title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);

  // 1. Base64 Data URL (e.g. from local device upload)
  if (imageUrl.startsWith('data:image/')) {
    try {
      const arr = imageUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ext = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
      return new File([u8arr], `${cleanName}.${ext}`, { type: mime });
    } catch (e) {
      console.warn('Failed to parse data URL into File:', e);
      return null;
    }
  }

  // 2. Remote HTTP/HTTPS URL
  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) return null;
      const blob = await response.blob();
      const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
      return new File([blob], `${cleanName}.${ext}`, { type: blob.type || 'image/jpeg' });
    } catch (e) {
      console.warn('Failed to fetch remote image for sharing:', e);
      return null;
    }
  }

  return null;
}

