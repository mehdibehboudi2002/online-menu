import { NextResponse } from 'next/server';
import { getCategoriesFromSupabase } from '@/data/menuItemsData';

export async function GET() {
  try {
    const categories: string[] = await getCategoriesFromSupabase();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}