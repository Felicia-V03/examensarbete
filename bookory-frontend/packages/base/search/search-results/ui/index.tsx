import type { Book } from '@bookory-frontend/book';
import './index.css';

interface BookResultsProps {
  books: Book[];
  isLoading: boolean;
  totalResults?: number;
}

export function BookResults({ books, isLoading, totalResults }: BookResultsProps) {
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

  const getBookUrl = (key: string) => {
    return `https://openlibrary.org${key.replace('/works/', '/work/')}`;
  };

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
              
              <a 
                href={getBookUrl(book.key)}
                target="_blank"
                rel="noopener noreferrer"
                className="book-link"
              >
                Visa på Open Library
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}