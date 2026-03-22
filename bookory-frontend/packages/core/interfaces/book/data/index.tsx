/** Representerar en bok från Open Library API */
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  isbn?: string[];
  language?: string[];
  edition_count?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  subject?: string[];
}

/** Svarsformat från Open Library sök-API */
export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Book[];
  q: string;
}