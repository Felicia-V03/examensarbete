import './index.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Work, EditionsResponse, Author } from '@bookory-frontend/book';
import axios from 'axios';
import {
  apiGetBookById,
  apiPostBook,
  apiPutBook,
  apiDeleteBook
} from '@bookory-frontend/book-api';

export const DetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState<Work | null>(null);
  const [editions, setEditions] = useState<EditionsResponse | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingStatus, setReadingStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [workRes, editionsRes] = await Promise.all([
          axios.get<Work>(`https://openlibrary.org/works/${bookId}.json`),
          axios.get<EditionsResponse>(
            `https://openlibrary.org/works/${bookId}/editions.json`
          )
        ]);

        setWork(workRes.data);
        setEditions(editionsRes.data);

        // Hämta författare
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

    const fetchStatus = async () => {
      if (!bookId) return;

      try {
        const book = await apiGetBookById(bookId);

        if (book?.status) {
          setReadingStatus(book.status);
        } else {
          setReadingStatus('');
        }

      } catch (error: any) {
        if (error?.response?.status === 404) {
          setReadingStatus('');
        } else {
          console.error('Error fetching status:', error);
        }
      }
    };

    if (bookId) {
      fetchData();
      fetchStatus();
    }

  }, [bookId]);

  const getCoverUrl = (covers?: number): string => {
    if (!covers) return '';
    return `https://covers.openlibrary.org/b/id/${covers}-M.jpg`;
  };

  const handleStatusChange = async (status: string) => {
    if (!bookId) return;

    setReadingStatus(status);
    setIsUpdating(true);

    try {
      if (!status) {
        try {
          await apiDeleteBook(bookId);
          console.log('Book deleted');
        } catch {
          // ignore om den inte finns
        }
        return;
      }

      try {
        // försök uppdatera
        await apiPutBook(
          {
            open_library_id: bookId,
            status
          },
          bookId
        );
      } catch {
        // annars skapa
        await apiPostBook({
          open_library_id: bookId,
          status
        });
      }

      console.log('Status updated:', status);

    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
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

  const firstEdition =
    editions?.entries?.length ? editions.entries[0] : null;

  return (
    <main className={`detail-page detail-page-${bookId}`}>
      <div className="book-detail ">
        <div className="book-nav">
          <i 
          className="fa-solid fa-arrow-left"
          onClick={() => navigate(-1)}
          ></i>
          <h1 className='book-detail-head'>Bok detalj</h1>
        </div>

        {/* 📕 Omslag */}
        <div className="book-image-cover">
          {firstEdition?.covers?.length ? (
            <>
              <img
                src={getCoverUrl(firstEdition.covers[0])}
                alt=""
                className="book-cover-bg"
              />

              <img
                src={getCoverUrl(firstEdition.covers[0])}
                alt={`Omslag för ${work.title}`}
                className="book-cover-front"
              />
            </>
          ) : (
            <div className="book-cover-placeholder">📚</div>
          )}
        </div>
        
        <div className="book-detail-info">
          {/* 📖 Titel */}
          <h2 className='book-detail-title'>{work.title}</h2>

          {/* ✍️ Författare */}
          {authors.length > 0 && (
            <p>By  {authors.join(', ')}</p>
          )}

          {/* 📚 Status */}
          <div className="reading-status">
            <select
              id="status"
              value={readingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-dropdown"
              disabled={isUpdating}
            >
              <option value="">Select status</option>
              <option value="want-to-read">Want to Read</option>
              <option value="currently-reading">Currently Reading</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* 🏷️ Genre */}
          {work.subjects && (
            <p>
              Genre: {work.subjects.slice(0, 5).join(', ')}
            </p>
          )}

          {/* 📄 Sidor */}
          {firstEdition?.number_of_pages && (
            <p>Pages: {firstEdition.number_of_pages}</p>
          )}

          {/* 📝 Beskrivning */}
          <h3>Book Description</h3>
          <p>
            {typeof work.description === 'string'
              ? work.description
              : work.description?.value ?? 'No description available.'}
          </p>
        </div>
        

      </div>
    </main>
  );
};