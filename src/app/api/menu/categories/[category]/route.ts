import { NextRequest, NextResponse } from 'next/server';
import { getItemsByCategory, getPopularItemsByCategory } from '@/data/menuData';
import { MenuItem } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const isPopular = searchParams.get('isPopular');
    const category = params.category;
    
    let items: MenuItem[] | undefined;
    
    if (isPopular === 'true') {
      items = getPopularItemsByCategory(category as any);
    } else {
      items = getItemsByCategory(category as any);
    }
    
    // Return empty array instead of 404 when no items found
    // Only return 404 if the category itself doesn't exist
    if (!items) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Return empty array if no items in category (this is valid)
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch category items' },
      { status: 500 }
    );
  }
}