import { useState } from 'react';
import './index.css';

/** Props för SearchInput-komponenten */
interface SearchInputProps {
  /** Callback som anropas när användaren skickar in sökformuläret */
  onSearch: (query: string) => void;
  /** Inaktiverar fältet och knappen under pågående sökning */
  isLoading?: boolean;
}

/**
 * SearchInput – sökformulär med textfält och sökknapp.
 * Anropar onSearch med trimmad sträng när formuläret skickas.
 */
export function SearchInput({ onSearch, isLoading = false }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type the book's name..."
          className="search-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Search...' : 'Search'}
        </button>
      </div>
    </form>
  );
}