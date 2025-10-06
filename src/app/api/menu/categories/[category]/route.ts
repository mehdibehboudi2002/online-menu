import { NextRequest, NextResponse } from 'next/server';
import { getItemsByCategoryFromSupabase } from '@/data/menuItemsData';
import { MenuItem } from '@/types/api';

export async function GET(
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    
    const items: MenuItem[] = await getItemsByCategoryFromSupabase(category);
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        [],
        { status: 200 }
      );
    }
    
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to fetch category items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category items' },
      { status: 500 }
    );
  }
}