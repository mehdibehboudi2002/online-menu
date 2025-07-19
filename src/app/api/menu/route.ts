import { NextRequest, NextResponse } from 'next/server';
import { getAllMenuItems, getPopularItems } from '@/data/menuData';
import { MenuItem } from '@/types/api';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Failed to fetch menu' },
    { status: 500 }
  );
}