
import type { Book } from 'packages/core/interfaces/book';

/** Props för BookCard-komponenten */
interface Props {
  /** Boken som ska visas */
  book: Book;
}

/**
 * BookCard – visar ett bokomslag, titel, författare och utgivningsår för en bok.
 * Om bokomslag saknas visas en platshållarbild.
 */
export function BookCard({ book }: Props) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/150";

  return (
    <div className="book-card">
      <img src={coverUrl} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author_name?.[0] ?? "Okänd författare"}</p>
      <p>{book.first_publish_year}</p>
    </div>
  );
}