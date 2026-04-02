
import type { Book } from 'packages/core/interfaces/book';
import { Link, useLocation } from 'react-router-dom';
import './book-card.css';

/** Props för BookCard-komponenten */
interface Props {
  /** Boken som ska visas */
  book: Book;
}

/**
 * BookCard – visar ett bokomslag, titel, författare och utgivningsår för en bok.
 * Klick öppnar DetailPage som modal ovanpå nuvarande sida.
 */
export function BookCard({ book }: Props) {
  const location = useLocation();
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  // Hämtar Open Library work-ID från book.key, t.ex. "/works/OL12345W" → "OL12345W"
  const bookId = book.key?.split('/').pop();

  return (
    <Link
      to={`/detail/${bookId}`}
      state={{ backgroundLocation: location }}
      className="book-card"
    >
      <div className="book-card__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} />
        ) : (
          <div className="book-card__placeholder">📚</div>
        )}
      </div>
      <div className="book-card__info">
        <h3>{book.title}</h3>
        <p>{book.author_name?.[0] ?? 'Okänd författare'}</p>
        <p>{book.first_publish_year}</p>
      </div>
    </Link>
  );
}