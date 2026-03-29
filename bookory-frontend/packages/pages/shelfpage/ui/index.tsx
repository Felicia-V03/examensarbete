import { useEffect, useState } from 'react';
import './index.css';
import { apiGetBooks } from '@bookory-frontend/book-api';
import { Link } from 'react-router-dom';
import { Navbar } from '@bookory-frontend/navbar';
import Logo from '../../../../src/assets/logo.png';

// ✅ Typ för din shelf (kombinerad data)
type ShelfBook = {
  bookId: string;
  status: string;
  title?: string;
  covers?: number[];
};

export const ShelfPage = () => {
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ helper för covers
  const getCoverUrl = (coverId?: number): string => {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // 🔹 1. Hämta sparade böcker från din backend
        const savedBooks = await apiGetBooks();
        console.log(savedBooks);

        // 🔹 2. Hämta info från OpenLibrary
        const booksWithDetails = await Promise.all(
          savedBooks.map(async (book: any) => {
            const res = await fetch(
              `https://openlibrary.org/works/${book.bookId}.json`
            );

            const work = await res.json();

            return {
              bookId: book.bookId,
              status: book.status,
              title: work.title,
              covers: work.covers
            };
          })
        );

        setBooks(booksWithDetails);

      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // ✅ loading state
  if (isLoading) {
    return (
      <main className="shelf-page">
        <p>Laddar böcker...</p>
      </main>
    );
  }

  // ✅ empty state
  if (books.length === 0) {
    return (
      <main className="shelf-page">
        <h1>My Library</h1>
        <p>Inga böcker sparade ännu 📚</p>
      </main>
    );
  }

  
  return (
    <main className="shelf-page">
      <header className="header-logo">
        <Link to="/home">
          <img src={Logo} alt="Bookory Image" className="logo-image__bookshelf" />
        </Link>
      </header>
      <h1 className='shelf-page__title'>My Library</h1>

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
                {book.status}
              </p>

              {/* 🔗 Navigation */}
              <Link
                to={`/detail/${book.bookId}`}
                className="book-link"
              >
                Visa mer detaljer
              </Link>
            </div>
              
          </div>
        ))}
        
      </div>
        <Navbar />
    </main>
  );
};