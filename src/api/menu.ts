import { MenuItem, Review, CreateReviewRequest } from "@/types/api";

// Fetch all menu items
export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch('/api/menu', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Fetch popular menu items
export async function fetchPopularMenuItems(): Promise<MenuItem[]> {
  const res = await fetch('/api/menu?isPopular=true', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch popular menu items: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Fetch items by category
export async function fetchMenuByCategory(category: string): Promise<MenuItem[]> {
  const res = await fetch(`/api/menu/categories/${category}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch ${category} items: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Fetch popular items by category
export async function fetchPopularMenuByCategory(category: string): Promise<MenuItem[]> {
  const res = await fetch(`/api/menu/categories/${category}?isPopular=true`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (res.status === 404) {
    return [];
  }
  if (!res.ok) throw new Error(`Failed to fetch popular ${category} items: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Fetch all categories
export async function fetchCategories(): Promise<string[]> {
  const res = await fetch('/api/menu/categories', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Fetch single item by ID
export async function fetchMenuItem(id: number): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch menu item: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data;
}

// ========== REVIEW FUNCTIONS ==========

// Fetch reviews for a specific item
export async function fetchReviews(itemId: number): Promise<Review[]> {
  const res = await fetch(`/api/reviews/${itemId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Create a new review
export async function createReview(reviewData: CreateReviewRequest): Promise<Review> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to create review: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data;
}

// Fetch all reviews (optional - for admin purposes)
export async function fetchAllReviews(): Promise<Review[]> {
  const res = await fetch('/api/reviews', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch all reviews: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}

// Delete a review (optional - for admin purposes)
export async function deleteReview(reviewId: number): Promise<boolean> {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to delete review: ${res.status} ${res.statusText}`);
  return true;
}

// Search for menu items
export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to perform search: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data || [];
}