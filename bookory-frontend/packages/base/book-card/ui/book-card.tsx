
import type { Book } from '@bookory-frontend/book';

interface Props {
  book: Book;
}

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