import { NextRequest, NextResponse } from 'next/server';
import { getItemByIdFromSupabase } from '@/data/menuItemsData';
import { MenuItem } from '@/types/api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item: MenuItem | null = await getItemByIdFromSupabase(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to fetch item by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}