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

export interface Work extends Book {
  description?: string | { value: string };
  authors?: { author: { key: string } }[];
  subjects?: string[];
}

export interface Edition extends Work {
  publish_date?: string;
  number_of_pages?: number;
  publishers?: string[];
}

export interface EditionsResponse extends Edition {
  entries: Edition[];
}

export interface Author {
  name: string;
}

export interface PostBookForm {
	open_library_id: string;
	status: string;
}

export interface UpdateForm {
	open_library_id?: string;
	status?: string;
  pages?: string;
  overall_rating?: string;
  spice_rating?: string;
  fluff_rating?: string;
  tear_rating?: string;
  humor_rating?: string;
  notes?: []
}