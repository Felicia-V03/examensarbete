import { useState } from 'react';
import axios from 'axios';
import { SearchInput } from '@bookory-frontend/search-input';
import { BookResults } from '@bookory-frontend/search-results';
import type { Book, OpenLibraryResponse } from '@bookory-frontend/book';
import './searchPage.css';

export function SearchPage() {
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

  return (
    <div className="search-page">
      <div className="search-container">
        <header className="search-header">
          <h1>Boksökning</h1>
          <p>Sök efter böcker från Open Library</p>
        </header>
        
        <SearchInput onSearch={searchBooks} isLoading={isLoading} />
        
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