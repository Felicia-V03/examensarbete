import type { Book } from 'packages/core/interfaces/book';
import './index.css';
import { Link, useLocation } from 'react-router-dom';

/** Props för BookResults-komponenten */
interface BookResultsProps {
  /** Lista med böcker att visa */
  books: Book[];
  /** Visar laddningsindikator om true */
  isLoading: boolean;
  /** Totalt antal träffar från API:et */
  totalResults?: number;
}

/**
 * BookResults – visar sökresultat med bokomslag, titel, författare och länk till Open Library.
 * Hanterar laddnings- och tomma resultat-tillstånd.
 */
export function BookResults({ books, isLoading, totalResults }: BookResultsProps) {
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner"></div>
        <p>Söker efter böcker...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="no-results">
        <p>Inga böcker hittades. Försök med en annan sökning.</p>
      </div>
    );
  }

  const getCoverUrl = (coverId?: number): string => {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const getBookId = (key: string) => key.split('/').pop();

  return (
    <div className="book-results">
      {totalResults && (
        <div className="results-header">
          <p>Hittade {totalResults.toLocaleString('sv-SE')} resultat</p>
        </div>
      )}
      
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.key} className="book-card">
            <div className="book-cover">
              {book.cover_i ? (
                <img 
                  src={getCoverUrl(book.cover_i)} 
                  alt={`Omslag för ${book.title}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              <div className={`book-cover-placeholder ${book.cover_i ? 'hidden' : ''}`}>
                📚
              </div>
            </div>
            
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              
              {book.author_name && book.author_name.length > 0 && (
                <p className="book-author">
                  av {book.author_name.slice(0, 3).join(', ')}
                  {book.author_name.length > 3 && ' med flera'}
                </p>
              )}
              
              {book.first_publish_year && (
                <p className="book-year">Publicerad {book.first_publish_year}</p>
              )}
              
              {book.publisher && book.publisher.length > 0 && (
                <p className="book-publisher">
                  {book.publisher[0]}
                  {book.publisher.length > 1 && ' med flera'}
                </p>
              )}
              
              {/* Länk till detailsida – skickar med backgroundLocation för modal-pattern */}
              <Link
                to={`/detail/${getBookId(book.key)}`}
                state={{ backgroundLocation: location }}
                className={`book-link-${book.key}`}
              >
                More info...
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}