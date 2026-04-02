import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BookResults } from '@bookory-frontend/search-results';
import type { Book, OpenLibraryResponse } from '@bookory-frontend/book';
import './index.css';

/**
 * SearchPage – sida för att söka böcker via Open Library API.
 * Visar ett sökfält och resultatlista. Sökningen körs när användaren skickar in formuläret
 * eller när URL-parametern ?q= finns.
 */
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState<number>();
  const [hasSearched, setHasSearched] = useState(false);

  const searchBooks = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await axios.get<OpenLibraryResponse>(
        `https://openlibrary.org/search.json`,
        {
          params: {
            q: query,
            limit: 20,
            fields: 'key,title,author_name,first_publish_year,cover_i,publisher,isbn,language,edition_count,has_fulltext,public_scan_b'
          }
        }
      );
      
      setBooks(response.data.docs);
      setTotalResults(response.data.numFound);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Kör sökning automatiskt om ?q= finns i URL:en, eller när den ändras
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      searchBooks(q);
    }
  }, [searchParams]);

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">
          What are you looking for?
        </h1>
        {hasSearched && (
          <BookResults 
            books={books} 
            isLoading={isLoading} 
            totalResults={totalResults}
          />
        )}
      </div>
    </div>
  );
}