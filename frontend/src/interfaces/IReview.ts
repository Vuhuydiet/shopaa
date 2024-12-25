export interface IReview {
  reviewId: number;
  customerName: string;
  customerAvatar: string | null;
  rating: number;
  reviewContent: string;
  createdAt: string;
  color: string | null;
  size: string | null;
}
