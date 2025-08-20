import { NextResponse } from 'next/server';
import { searchMenuItemsFromSupabase } from '@/data/menuItemsData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: "No search query provided." }, { status: 400 });
    }

    const results = await searchMenuItemsFromSupabase(query);

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}