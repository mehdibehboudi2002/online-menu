import { NextRequest, NextResponse } from 'next/server';
import { getAllMenuItemsFromSupabase, getPopularItemsFromSupabase } from '@/data/menuItemsData';
import { MenuItem } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPopular = searchParams.get('isPopular');
    
    let menuItems: MenuItem[];
    
    if (isPopular === 'true') {
      // Use the async Supabase function
      menuItems = await getPopularItemsFromSupabase();
    } else {
      // Use the async Supabase function
      menuItems = await getAllMenuItemsFromSupabase();
    }
    
    return NextResponse.json(menuItems, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}