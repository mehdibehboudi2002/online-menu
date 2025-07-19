import { NextRequest, NextResponse } from 'next/server';
import { getItemById } from '@/data/menuData';
import { MenuItem } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: 'Failed to fetch item' },
    { status: 500 }
  );
}