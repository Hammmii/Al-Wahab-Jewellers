import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/placeholder-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    
    let filteredProducts = [...products];
    
    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by featured flag if provided
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }
    
    // Filter by slug if provided
    if (slug) {
      const product = filteredProducts.find(
        product => product.id.toLowerCase() === slug.toLowerCase()
      );
      
      if (!product) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, product });
    }
    
    // Return filtered products
    return NextResponse.json({ 
      success: true, 
      products: filteredProducts,
      count: filteredProducts.length
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}