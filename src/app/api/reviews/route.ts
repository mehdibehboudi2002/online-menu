import { NextRequest, NextResponse } from 'next/server';
import { CreateReviewRequest } from '@/types/api';
import { addReviewToSupabase, getReviewsFromSupabase } from '@/data/reviewsData';

export async function POST(req: NextRequest) {
  try {
    const { itemId, rating, comment, userName }: CreateReviewRequest = await req.json();
    
    if (!itemId || !rating || !comment || !userName) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    
    const createdReview = await addReviewToSupabase({ itemId, rating, comment, userName });
    console.log('📝 New review added to Supabase with ID:', createdReview.id);

    return NextResponse.json(createdReview, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allReviews = await getReviewsFromSupabase();
    console.log('🔎 All reviews fetched from Supabase.');
    return NextResponse.json(allReviews, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching all reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}