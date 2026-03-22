// useFetchBooks.ts
import { useState, useEffect } from "react";
import type { Book, OpenLibraryResponse } from '@bookory-frontend/book';

// Hjälpfunktion: plocka 5 random böcker från en array
function getRandomBooks(books: Book[], count: number): Book[] {
  const shuffled = [...books].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Hjälpfunktion: gruppera böcker per kategori
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