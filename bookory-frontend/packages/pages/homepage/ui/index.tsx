import { useFetchRandomBooks } from '@bookory-frontend/book-api';
import { BookList } from '@bookory-frontend/book-list';
import './index.css';

/**
 * HomePage – startsidan för inloggade användare.
 * Hämtar ~20 slumpmässiga böcker från Open Library och visar dem i ett grid.
 */
export const HomePage = () => {
  const { books, loading, error } = useFetchRandomBooks(20);

  if (loading) return <p>Laddar böcker...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <section className="home-page">
        <h1>Explore the world</h1>
        <BookList category="" books={books} />
      </section>
    </div>
  );
}

