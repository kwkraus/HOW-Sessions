export interface IBook {
  id: number;
  title: string;
  author: string;
  isCheckedOut: boolean;
  rating: number;
  coverUrl?: string;
}
