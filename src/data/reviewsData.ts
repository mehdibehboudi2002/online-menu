import { Review, CreateReviewRequest } from "@/types/api";

// Supabase credentials
const SUPABASE_URL = "https://cyzwgmruoqhdztzcgcmr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5endnbXJ1b3FoZHp0emNnY21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODcxNjYsImV4cCI6MjA3MDI2MzE2Nn0.h6srWcb98xe9exJZ1CEJg4dLo7nk2-JHaAdm73UiJ3k";

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