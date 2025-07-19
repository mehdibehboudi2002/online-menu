import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Review } from '@/types/api';

interface Params {
  itemId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  return NextResponse.json({ message: 'Not yet implemented' }, { status: 501 });
}