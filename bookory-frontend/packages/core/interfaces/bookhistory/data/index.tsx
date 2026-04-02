// BookHistory – en sparad bok i historiken
export interface BookHistory {
  bookId: string;
  title: string;
  author: string;
  cover_i?: number;
  addedAt: string;       // datum när boken lades till
  status: 'reading' | 'completed' | 'want-to-read';
}