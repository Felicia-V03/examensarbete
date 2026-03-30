import { useEffect, useState } from 'react';
import './index.css';
import { apiGetBooks } from '@bookory-frontend/book-api';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '@bookory-frontend/navbar';
import Logo from '../../../../src/assets/logo.png';

type ShelfBook = {
  bookId: string;
  status: string;
  title?: string;
  covers?: number[];
};

export const ShelfPage = () => {
  const location = useLocation();
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCoverUrl = (coverId?: number): string => {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  // ✅ status formatter
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
      try {
        const savedBooks = await apiGetBooks();

        const results: ShelfBook[] = [];

        // 🔥 loop istället för Promise.all
        for (const book of savedBooks) {
          try {
            // ✅ hämta editions (för covers)
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

            // fallback så appen inte kraschar
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
  }, []);

  if (isLoading) {
    return (
      <main className="shelf-page">
        <p>Loading...</p>
      </main>
    );
  }

  if (books.length === 0) {
    return (
      <main className="shelf-page">
        <h1>My Library</h1>
        <p>You don't have any books saved yet 📚</p>
        <Navbar />
      </main>
    );
  }

  return (
    <main className="shelf-page">
      <header className="header-logo">
        <Link to="/home">
          <img src={Logo} alt="Bookory" className="logo-image__bookshelf" />
        </Link>
      </header>

      <h1 className="shelf-page__title">My Library</h1>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.bookId} className="book-card">

            {/* 📕 Cover */}
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

            {/* 📖 Info */}
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>

              {/* 🔥 Status */}
              <p className={`book-status status-${book.status}`}>
                {formatStatus(book.status)}
              </p>

              {/* 🔗 Navigation */}
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