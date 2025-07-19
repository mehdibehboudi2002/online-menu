import { NextResponse } from 'next/server';
import { getCategories } from '@/data/menuData';

export async function GET() {
  try {
    const categories: string[] = getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}