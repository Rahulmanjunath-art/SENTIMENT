
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  avatar?: string;
  images?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
  likes: number;
  merchantReply?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: string;
  averageRating: number;
  totalReviews: number;
}

export interface AISummaryData {
  summary: string;
  pros: string[];
  cons: string[];
  topKeywords: string[];
  overallSentiment: string;
}

export type SortOption = 'newest' | 'highest' | 'lowest' | 'most_helpful';
