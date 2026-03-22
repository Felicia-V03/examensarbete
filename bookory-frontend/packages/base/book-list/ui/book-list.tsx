// BookList.tsx
import { BookCard } from '@bookory-frontend/book-card';
import type { Book } from '@bookory-frontend/book';

interface Props {
  category: string;
  books: Book[];
}

export function BookList({ category, books }: Props) {
  return (
    <div>
      <h2>{category}</h2>
      <div className="book-grid">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}