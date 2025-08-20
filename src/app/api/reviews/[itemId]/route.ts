import { NextRequest, NextResponse } from 'next/server';
import { getReviewsFromSupabase } from '@/data/reviewsData'; 

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } } 
) {
  try {
    const itemId = params.itemId; // Get the itemId as a string

    if (!itemId) {
      return NextResponse.json({ message: "Item ID is required." }, { status: 400 });
    }

    // Call the Supabase function, passing the string itemId
    const reviews = await getReviewsFromSupabase(itemId);
    
    return NextResponse.json(reviews, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}