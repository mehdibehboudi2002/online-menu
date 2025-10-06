import { Review, CreateReviewRequest } from "@/types/api";

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BASE_REVIEWS_API_URL = `${SUPABASE_URL}/rest/v1/Reviews`;

export const getReviewsFromSupabase = async (
  itemId?: string
): Promise<Review[]> => {
  try {
    let fetchUrl = BASE_REVIEWS_API_URL;
    if (itemId) {
      fetchUrl += `?itemId=eq.${itemId}`;
    }

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("❌ Supabase fetch failed:", res.status, res.statusText);
      
      if (res.status === 404) {
        throw new Error(`Table 'Reviews' not found. Check table name in Supabase.`);
      } else if (res.status === 401) {
        throw new Error(`Authentication failed. Check your Supabase keys.`);
      }
      
      throw new Error(`Supabase error: ${res.statusText} - ${errorBody}`);
    }

    const data: Review[] = await res.json();
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
    const res = await fetch(BASE_REVIEWS_API_URL, {
      method: "POST",
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("❌ Supabase insert failed:", res.status, res.statusText);
      
      if (res.status === 400) {
        throw new Error(`Bad request - check data format: ${errorBody}`);
      } else if (res.status === 401) {
        throw new Error(`Authentication failed. Check RLS policies.`);
      }
      
      throw new Error(`Supabase insert error: ${res.statusText} - ${errorBody}`);
    }

    const data: Review[] = await res.json();
    return data[0];
  } catch (error: any) {
    console.error("❌ Error in addReviewToSupabase:", error);
    throw error;
  }
};