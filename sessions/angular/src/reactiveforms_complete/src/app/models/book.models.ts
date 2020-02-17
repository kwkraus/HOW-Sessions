export interface IBook {
  id: number;
  title: string;
  author: string;
  isCheckedOut: boolean;
  rating: number;
  bookReviews?: Array<IBookReview>;
}

export interface IBookReview {
  id: number;
  rating: number;
  title: string;
  description: string;
}
