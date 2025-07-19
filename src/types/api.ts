export interface MenuItem {
  id: number;
  name: string | { en: string; fa: string; }; 
  description: string | { en: string; fa: string; }; 
  price: number;
  image: string; 
  isPopular: boolean;
  category: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Review {
  id: string;
  itemId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  itemId: number;
  rating: number;
  comment: string;
  userName: string;
}