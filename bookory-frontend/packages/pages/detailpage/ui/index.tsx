import './index.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Work, EditionsResponse, Author } from '@bookory-frontend/book';
import axios from 'axios';
import { apiGetBookById, apiPostBook, apiPutBook } from '@bookory-frontend/book-api';

export const DetailPage = () => {
  const { bookId } = useParams();

  const [work, setWork] = useState<Work | null>(null);
  const [editions, setEditions] = useState<EditionsResponse | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingStatus, setReadingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 1️⃣ Hämta work + editions
        const [workRes, editionsRes] = await Promise.all([
          axios.get<Work>(`https://openlibrary.org/works/${bookId}.json`),
          axios.get<EditionsResponse>(
            `https://openlibrary.org/works/${bookId}/editions.json`
          )
        ]);

        setWork(workRes.data);
        setEditions(editionsRes.data);

        // 2️⃣ Hämta författare
        if (workRes.data.authors) {
          const authorResponses = await Promise.all(
            workRes.data.authors.map(a =>
              axios.get<Author>(
                `https://openlibrary.org${a.author.key}.json`
              )
            )
          );

          setAuthors(authorResponses.map(res => res.data.name));
        }

      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) fetchData();

  }, [bookId]);

  // const getCoverUrl = (coverbookId?: number) => {
  //   if (!coverbookId) return '';
  //   return `https://covers.openlibrary.org/b/bookId/${coverbookId}-L.jpg`;
  // };
  const handleStatusChange = async (status: string) => {
    setReadingStatus(status);

    if (!bookId || !work) return;

    try {
      // 1️⃣ Kolla om bok finns
      let book;

      try {
        book = await apiGetBookById(bookId);
      } catch (err) {
        // 2️⃣ Om inte finns → skapa
        book = await apiPostBook({
          open_library_id: bookId,
          status
        });
      }

      // 3️⃣ Uppdatera status
      await apiPutBook(
        {open_library_id: bookId,
        status},
        bookId
      );

      console.log('Status updated:', status);

    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="detail-page">
        <div className="loading-spinner"></div>
        <p>Laddar bokinformation...</p>
      </main>
    );
  }

  if (!work) {
    return (
      <main className="detail-page">
        <p>Ingen bok hittades.</p>
      </main>
    );
  }

  const firstEdition = editions?.entries?.[0];

  return (
    <main className={`detail-page detail-page-${bookId}`}>
      <div className="book-detail">

        {/* 📕 Omslag */}
        {/* {work.covers && work.covers.length > 0 && (
          <img
            src={getCoverUrl(work.covers[0])}
            alt={`Omslag för ${work.title}`}
            className="book-cover-large"
          />
        )} */}

        {/* 📖 Titel */}
        <h1>{work.title}</h1>

        <div className="reading-status">
          <label htmlFor="status"><strong>Status:</strong></label>

          <select
            id="status"
            value={readingStatus || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-dropdown"
          >
            <option value="">Select status</option>
            <option value="want-to-read">Want to Read</option>
            <option value="currently-reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* ✍️ Författare */}
        {authors.length > 0 && (
          <p><strong>By </strong> {authors.join(', ')}</p>
        )}

        {/* 🏷️ Genre */}
        {work.subjects && (
          <p>
            <strong>Genre:</strong> {work?.subjects?.slice(0, 5).join(', ')}
          </p>
        )}

        {/* 📄 SbookIdor */}
        {firstEdition?.number_of_pages && (
          <p><strong>Pages:</strong> {firstEdition.number_of_pages}</p>
        )}

        {/* 📝 Beskrivning */}
        <h3>Book Description</h3>
        <p>
          {typeof work.description === 'string'
            ? work.description
            : work.description?.value ?? 'No description available.'}
        </p>

      </div>
    </main>
  );
};