export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Rings' | 'Necklaces' | 'Bracelets' | 'Earrings';
  price: number;
  description: string;
  images: string[];
  metalType: '22k Gold' | '24k Gold' | 'White Gold' | 'Rose Gold';
  featured?: boolean;
}
