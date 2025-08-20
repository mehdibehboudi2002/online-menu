import { Review, CreateReviewRequest } from "@/types/api";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are not set.");
}

// Try both versions - you might need to change this to lowercase 'reviews'
const BASE_REVIEWS_API_URL = `${SUPABASE_URL}/rest/v1/Reviews`;

export const getReviewsFromSupabase = async (
  itemId?: string
): Promise<Review[]> => {
  try {
    let fetchUrl = BASE_REVIEWS_API_URL;
    if (itemId) {
      fetchUrl += `?itemId=eq.${itemId}`;
    }

    console.log('🔍 Fetching from URL:', fetchUrl);
    console.log('🔑 Using API Key:', SUPABASE_ANON_KEY ? 'Present' : 'Missing');

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("❌ Supabase fetch failed:", res.status, res.statusText);
      console.error("❌ Error body:", errorBody);
      
      // More specific error handling
      if (res.status === 404) {
        throw new Error(`Table 'Reviews' not found. Check table name in Supabase.`);
      } else if (res.status === 401) {
        throw new Error(`Authentication failed. Check your Supabase keys.`);
      } else if (res.status === 400) {
        throw new Error(`Bad request. Possible column name mismatch: ${errorBody}`);
      }
      
      throw new Error(`Supabase error: ${res.statusText} - ${errorBody}`);
    }

    const data: Review[] = await res.json();
    console.log('✅ Fetched reviews:', data);
    return data || [];
  } catch (error: any) {
    console.error("❌ Error in getReviewsFromSupabase:", error);
    throw error;
  }
};

export const addReviewToSupabase = async (
  reviewData: CreateReviewRequest
): Promise<Review> => {
  try {
    console.log('📝 Adding review data:', reviewData);
    console.log('📝 Posting to URL:', BASE_REVIEWS_API_URL);

    const res = await fetch(BASE_REVIEWS_API_URL, {
      method: "POST",
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(reviewData),
      cache: 'no-store',
    });

    console.log('📡 POST Response status:', res.status);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("❌ Supabase insert failed:", res.status, res.statusText);
      console.error("❌ Error body:", errorBody);
      
      if (res.status === 400) {
        throw new Error(`Bad request - possibly column name mismatch or data type issue: ${errorBody}`);
      } else if (res.status === 401) {
        throw new Error(`Authentication failed. Check RLS policies or Supabase keys.`);
      } else if (res.status === 409) {
        throw new Error(`Conflict - possibly duplicate key or constraint violation: ${errorBody}`);
      }
      
      throw new Error(`Supabase insert error: ${res.statusText} - ${errorBody}`);
    }

    const data: Review[] = await res.json();
    console.log('✅ Created review:', data[0]);
    return data[0];
  } catch (error: any) {
    console.error("❌ Error in addReviewToSupabase:", error);
    throw error;
  }
};