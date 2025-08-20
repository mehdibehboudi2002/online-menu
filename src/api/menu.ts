import { MenuItem, Review, CreateReviewRequest } from "@/types/api";

////// Menu Items

// Fetch all menu items
export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`);
  const data: MenuItem[] = await res.json();
  return data || [];
}

// Fetch popular menu items
export async function fetchPopularMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(
      `Failed to fetch popular menu items: ${res.status} ${res.statusText}`
    );
  const allItems: MenuItem[] = await res.json();
  return allItems.filter((item: MenuItem) => item.is_popular) || [];
}

// Fetch items by category
export async function fetchMenuByCategory(
  category: string
): Promise<MenuItem[]> {
  const res = await fetch(`/api/menu/categories/${category}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(
      `Failed to fetch ${category} items: ${res.status} ${res.statusText}`
    );
  const data: MenuItem[] = await res.json();
  return data || [];
}

// Fetch popular items by category
export async function fetchPopularMenuByCategory(
  category: string
): Promise<MenuItem[]> {
  const res = await fetch(`/api/menu/categories/${category}?isPopular=true`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) {
    return [];
  }
  if (!res.ok)
    throw new Error(
      `Failed to fetch popular ${category} items: ${res.status} ${res.statusText}`
    );
  const data: MenuItem[] = await res.json();
  return data.filter((item: MenuItem) => item.is_popular) || [];
}

// Fetch all categories
export async function fetchCategories(): Promise<string[]> {
  const res = await fetch("/api/menu/categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    );
  const data: string[] = await res.json();
  return data || [];
}

// Fetch single item by ID
export async function fetchMenuItem(id: string): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(
      `Failed to fetch menu item: ${res.status} ${res.statusText}`
    );
  const data: MenuItem = await res.json();
  return data;
}

// Search for menu items
export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  // Update the fetch URL to the new, correct path
  const res = await fetch(`/api/menu/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(
      `Failed to perform search: ${res.status} ${res.statusText}`
    );
  const data: MenuItem[] = await res.json();
  return data || [];
}

////// Reviews 

// Fetch reviews for a specific item
export async function fetchReviews(itemId: string): Promise<Review[]> { 
  if (typeof itemId !== "string" || !itemId) {
    throw new Error("Invalid itemId provided to fetchReviews");
  }

  try {
    const res = await fetch(`/api/reviews/${itemId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch reviews: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data: Review[] = await res.json();
    return data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Network error. Failed to connect to the server.");
    }
    throw error;
  }
}

// Create a new review
export async function createReview(
  reviewData: CreateReviewRequest
): Promise<Review> {
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to create review: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data: Review = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Network error. Failed to connect to the server.");
    }
    throw error;
  }
}