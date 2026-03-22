import { useFetchBooks } from '@bookory-frontend/book-api';
import { BookList } from '@bookory-frontend/book-list';


export const HomePage = () => {
     const { groupedBooks, loading, error } = useFetchBooks("first+time+caller");

  if (loading) return <p>Laddar böcker...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Böcker per kategori</h1>
      {Object.entries(groupedBooks).map(([category, books]) => (
        <BookList key={category} category={category} books={books} />
      ))}
    </div>
  );
}

