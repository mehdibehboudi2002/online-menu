import { NextRequest, NextResponse } from 'next/server';
import { getAllMenuItems, getPopularItems } from '@/data/menuData';
import { MenuItem } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPopular = searchParams.get('isPopular');
    
    let menuItems: MenuItem[];
    
    if (isPopular === 'true') {
      menuItems = getPopularItems();
    } else {
      menuItems = getAllMenuItems();
    }
    
    return NextResponse.json(menuItems, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}