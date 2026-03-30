import { useEffect, useState } from 'react';
import './index.css';
import { apiGetBooks } from '@bookory-frontend/book-api';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '@bookory-frontend/navbar';
import Logo from '../../../../src/assets/logo.png';

/** Typ for en bok i hyllan - kombination av backenddata och Open Library-data */
type ShelfBook = {
  bookId: string;
  status: string;
  title?: string;
  covers?: number[];
};

/**
 * ShelfPage - visar anvandarens sparade bocker (My Library).
 * Hamtar bokstatus fran backend och kompletterande info (titel, omslag) fran Open Library.
 */
export const ShelfPage = () => {
  // Anvands for att skicka med backgroundLocation nar modal oppnas
  const location = useLocation();
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /** Bygger en URL till omslagsbild via Open Library Covers API */
  const getCoverUrl = (coverId?: number): string => {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  /** Oversatter status-ID till lasbar text */
  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      'want-to-read': 'Want to Read',
      'currently-reading': 'Currently Reading',
      'read': 'Read'
    };
    return map[status] || status;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);

      try {
        // Hamtar alla sparade bocker for inloggad anvandare fran backend
        const savedBooks = await apiGetBooks();

        const results: ShelfBook[] = [];

        // Loopar sekventiellt for att undvika att for manga anrop skickas parallellt
        for (const book of savedBooks) {
          try {
            // Hamtar editions fran Open Library for att fa titel och omslagsbild
            const res = await fetch(
              `https://openlibrary.org/works/${book.bookId}/editions.json`
            );

            const data = await res.json();
            const firstEdition = data.entries?.[0];

            results.push({
              bookId: book.bookId,
              status: book.status,
              title: firstEdition?.title || 'Unknown',
              covers: firstEdition?.covers || []
            });

          } catch (err) {
            console.error('Failed for book:', book.bookId);

            // Fallback: lagg till boken anda utan titel/omslag sa appen inte kraschar
            results.push({
              bookId: book.bookId,
              status: book.status,
              title: 'Unknown',
              covers: []
            });
          }
        }

        setBooks(results);

      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [location.state]); // Kors om nar anvandaren stanger en modal (status kan ha andrats)

  // Laddningstillstand - visas medan bocker hamtas
  if (isLoading) {
    return (
      <main className="shelf-page">
        <header className="header-logo">
        <Link to="/home">
          <img src={Logo} alt="Bookory" className="logo-image__bookshelf" />
        </Link>
      </header>
        <h1>My Library</h1>
        <p>Loading...</p>
        <Navbar />
      </main>
    );
  }

  // Tomt tillstand - inga bocker sparade an
  if (books.length === 0) {
    return (
      <main className="shelf-page">      
      <header className="header-logo">
        <Link to="/home">
          <img src={Logo} alt="Bookory" className="logo-image__bookshelf" />
        </Link>
      </header>
        <h1>My Library</h1>
        <p>You don't have any books saved yet 📚</p>
        <Navbar />
      </main>
    );
  }

  return (
    <main className="shelf-page">
      <header className="header-logo">
        {/* Logo navigerar tillbaka till hemsidan */}
        <Link to="/home">
          <img src={Logo} alt="Bookory" className="logo-image__bookshelf" />
        </Link>
      </header>

      <h1 className="shelf-page__title">My Library</h1>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.bookId} className="book-card">

            {/* Omslagsbild - visas om cover-ID finns, annars emoji-placeholder */}
            <div className="book-cover">
              {book.covers?.[0] ? (
                <img
                  src={getCoverUrl(book.covers[0])}
                  alt={`Omslag för ${book.title}`}
                />
              ) : (
                <div className="book-cover-placeholder">📚</div>
              )}
            </div>

            {/* Bokinformation: titel, lasstatus och lank till detaljsida */}
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>

              {/* Lasstatus formaterad till lasbar text */}
              <p className={`book-status status-${book.status}`}>
                {formatStatus(book.status)}
              </p>

              {/* Lank till DetailPage som modal - skickar med backgroundLocation */}
              <Link
                to={`/detail/${book.bookId}`}
                state={{ backgroundLocation: location }}
                className="book-link"
              >
                More info...
              </Link>
            </div>

          </div>
        ))}
      </div>

      <Navbar />
    </main>
  );
};