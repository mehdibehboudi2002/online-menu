import { NextRequest, NextResponse } from 'next/server';
import { Review, CreateReviewRequest } from '@/types/api';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Not yet implemented' }, { status: 501 });
}

export async function GET() {
  return NextResponse.json({ message: 'Not yet implemented' }, { status: 501 });
}