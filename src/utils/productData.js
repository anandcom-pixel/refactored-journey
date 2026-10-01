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
