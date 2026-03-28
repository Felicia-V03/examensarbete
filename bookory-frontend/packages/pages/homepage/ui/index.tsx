import { useFetchBooks } from '@bookory-frontend/book-api';
import { BookList } from '@bookory-frontend/book-list';
import './index.css';

/**
 * HomePage – startsidan för inloggade användare.
 * Hämtar böcker från Open Library och visar dem grupperade per kategori.
 */
export const HomePage = () => {
     const { groupedBooks, loading, error } = useFetchBooks("first+time+caller");

  if (loading) return <p>Laddar böcker...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <section className="home-page">
      <h1>Explore the world</h1>
      {Object.entries(groupedBooks).map(([category, books]) => (
        <BookList key={category} category={category} books={books} />
      ))}
      </section>
    </div>
  );
}

