import { NextRequest, NextResponse } from 'next/server';
import { Review, CreateReviewRequest } from '@/types/api';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { itemId, rating, comment, userName }: CreateReviewRequest = await req.json();

    if (!itemId || !rating || !comment || !userName) {
      return NextResponse.json({ message: 'Missing required fields: itemId, rating, comment, and userName are required.' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const reviewsCollection = collection(db, 'reviews');

    const newReviewData = {
      itemId,
      userId: `user-${Date.now()}`,
      userName,
      rating,
      comment,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(reviewsCollection, newReviewData);
    console.log('📝 New review added to Firestore with ID:', docRef.id);

    const createdReview: Review = {
      id: docRef.id,
      itemId,
      userId: newReviewData.userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(createdReview, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const q = query(reviewsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const allReviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allReviews.push({
        id: doc.id,
        itemId: data.itemId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });

    console.log('🔎 All reviews fetched from Firestore.');
    return NextResponse.json(allReviews, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching all reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}