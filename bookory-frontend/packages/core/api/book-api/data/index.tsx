// useFetchBooks.ts
import { useState, useEffect } from "react";
import type { Book, OpenLibraryResponse, PostBookForm, UpdateForm } from '@bookory-frontend/book';
import axios from 'axios';

/** Plockar `count` slumpmässiga böcker från en array */
function getRandomBooks(books: Book[], count: number): Book[] {
  const shuffled = [...books].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Grupperar en lista böcker per första ämnekategori */
function groupByCategory(books: Book[]): Record<string, Book[]> {
  const grouped: Record<string, Book[]> = {};

  books.forEach((book) => {
    const category = book.subject?.[0] ?? "Okänd kategori"; // första kategorin

    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(book);
  });

  return grouped;
}

/**
 * useFetchBooks – custom hook som hämtar böcker från Open Library.
 * Returnerar böcker grupperade per kategori, med 5 slumpmässiga böcker per kategori.
 * @param query - Söksträng att använda mot Open Library API
 */
export function useFetchBooks(query: string) {
  const [groupedBooks, setGroupedBooks] = useState<Record<string, Book[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=50`
        );
        const data: OpenLibraryResponse = await res.json();

        const grouped = groupByCategory(data.docs);

        // Plocka 5 random böcker PER kategori
        const randomPerCategory: Record<string, Book[]> = {};
        Object.entries(grouped).forEach(([category, books]) => {
          randomPerCategory[category] = getRandomBooks(books, 5);
        });

        setGroupedBooks(randomPerCategory);
      } catch (err) {
        setError("Något gick fel!");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [query]);

  return { groupedBooks, loading, error };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiGetBooks = async () => {
  try {
    const response = await axios.get(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/books`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error('Kunde inte hämta böcker');
  }
};

export const apiPostBook = async (data: PostBookForm) => {
  try {
    const response = await axios.post(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/book`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error('Kunde inte lägga till bok');
  }
};

export const apiGetBookById = async (id: string) => {
  try {
    const response = await axios.get(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/book/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error('Kunde inte hämta bok');
  }
};

export const apiGetBookByStatus = async (status: string) => {
  try {
    const response = await axios.get(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/book/status=${status}`,
      { headers: getAuthHeaders() }
    );

    return response.data;

  } catch (error) {
    throw new Error('Kunde inte hämta böcker med status');
  }
};

export const apiPutBook = async (data: UpdateForm, id: string) => {
  try {
    const response = await axios.put(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/book/${id}`,
      data,
      { headers: getAuthHeaders() }
    );

    return response.data;

  } catch (error) {
    throw new Error('Kunde inte uppdatera bok');
  }
};

export const apiDeleteBook = async (id: string) => {
  try {
    const response = await axios.delete(
      `https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/book/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error('Kunde inte hämta bok');
  }
}