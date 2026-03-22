// BookList.tsx
import { BookCard } from '@bookory-frontend/book-card';
import type { Book } from '@bookory-frontend/book';

/** Props för BookList-komponenten */
interface Props {
  /** Kategorins namn som visas som rubrik */
  category: string;
  /** Lista med böcker att visa */
  books: Book[];
}

/**
 * BookList – visar en lista med böcker under en kategoriregistrering.
 * Renderar varje bok som ett BookCard.
 */
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