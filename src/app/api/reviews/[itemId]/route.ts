import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Review } from '@/types/api';

interface Params {
  itemId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const itemId = parseInt(params.itemId, 10);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 });
    }

    const reviewsCollection = collection(db, 'reviews');
    const q = query(
      reviewsCollection,
      where('itemId', '==', itemId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const itemReviews: Review[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      itemReviews.push({
        id: doc.id,
        itemId: data.itemId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      });
    });

    console.log(`🔎 Found ${itemReviews.length} reviews for item ${itemId} from Firestore.`);

    return NextResponse.json(itemReviews, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}