import './index.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Work, EditionsResponse, Author } from '@bookory-frontend/book';
import axios from 'axios';
import { apiGetBookById, apiPostBook, apiPutBook, apiDeleteBook } from '@bookory-frontend/book-api';

/**
 * DetailPage – visar detaljerad information om en bok hämtad från Open Library.
 * bookId hämtas från URL-parametern och används för att hämta work, editions och författare.
 * Användaren kan sätta sin lässtatus (want-to-read, currently-reading, read) som sparas i backend.
 */
export const DetailPage = () => {
  // bookId = Open Library work-ID, t.ex. "OL58230W"
  const { bookId } = useParams();
  const navigate = useNavigate();

  // Bokens metadata från Open Library
  const [work, setWork] = useState<Work | null>(null);
  const [editions, setEditions] = useState<EditionsResponse | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);

  // UI-tillstånd
  const [isLoading, setIsLoading] = useState(true);
  const [readingStatus, setReadingStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Hämtar bokdata från Open Library (work + editions parallellt)
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

        // Hämta författarnamn via varje authors key-länk
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

    // Hämtar användarens sparade lässtatus för boken från backend
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
        const status = error?.response?.status ?? error?.status;
        if (status === 404) {
          // Boken är inte sparad av användaren – ingen status att visa
          setReadingStatus('');
        } else {
          // Annat fel – sätt tom status utan att logga i konsolen
          setReadingStatus('');
        }
      }
    };

    if (bookId) {
      fetchData();
      fetchStatus();
    }

  }, [bookId]);

  // Bygger en URL till omslagsbild via Open Library Covers API
  const getCoverUrl = (covers?: number): string => {
    if (!covers) return '';
    return `https://covers.openlibrary.org/b/id/${covers}-M.jpg`;
  };

  /**
   * Hanterar byte av lässtatus.
   * – Om status är tom: tar bort boken från backend (DELETE)
   * – Om boken redan finns: uppdaterar den (PUT)
   * – Annars: skapar en ny post (POST)
   */
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
          // ignore om den inte finns i backend
        }
        return;
      }

      try {
        // Försök uppdatera befintlig post
        await apiPutBook(
          {
            open_library_id: bookId,
            status
          },
          bookId
        );
      } catch {
        // Om boken inte finns ännu – skapa en ny
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
      <div className="detail-page" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}>
        <div className="book-detail" onClick={(e) => e.stopPropagation()}>
          <div className="loading-spinner"></div>
          <p>Laddar bokinformation...</p>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="detail-page" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}>
        <div className="book-detail" onClick={(e) => e.stopPropagation()}>
          <p>Ingen bok hittades.</p>
        </div>
      </div>
    );
  }

  // Väljer den edition som har omslagsbild, annars första edition
  const firstEdition =
    editions?.entries?.find(e => e.covers && e.covers.length > 0)
    ?? (editions?.entries?.length ? editions.entries[0] : null);

  // Prioriterar edition-covers → work-covers → null (visar placeholder)
  const coverIds =
    firstEdition?.covers?.length
      ? firstEdition.covers
      : work.covers?.length
        ? work.covers
        : null;

  return (
    // Klick på overlay (bakgrunden) stänger modalen
    <div className={`detail-page detail-page-${bookId}`} onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}>
      {/* stopPropagation förhindrar att klick inuti modal stänger den */}
      <div className="book-detail" onClick={(e) => e.stopPropagation()}>
        <div className="book-nav">
          <i 
          className="fa-solid fa-arrow-left"
          onClick={() => window.history.length > 1 ? navigate('/shelf', { state: { refresh: true } }) : navigate('/search')}
          ></i>
          <h1 className='book-detail-head'>Book detail</h1>
        </div>

        {/* Omslag */}
        <div className="book-image-cover">
          {coverIds ? (
            <>
              <img
                src={getCoverUrl(coverIds[0])}
                alt=""
                className="book-cover-bg"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />

              <img
                src={getCoverUrl(coverIds[0])}
                alt={`Omslag för ${work.title}`}
                className="book-cover-front"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.parentElement?.querySelector('.book-cover-placeholder') as HTMLElement;
                  if (placeholder) placeholder.classList.remove('hidden');
                }}
              />
              <div className="book-cover-placeholder hidden">📚</div>
            </>
          ) : (
            <div className="book-cover-placeholder">📚</div>
          )}
        </div>
        
        <div className="book-detail-info">
          <div className="book-detail-section">
            {/* Titel */}
            <h2 className='book-detail-title'>{work.title}</h2>

            {/* Författare */}
            {authors.length > 0 && (
              <p className='book-detail-author'><strong>By</strong> {authors.join(', ')}</p>
            )}

            {/* Status */}
            <div className="reading-status">
              <select
                id="status"
                value={readingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`status-dropdown ${readingStatus}`}
                disabled={isUpdating}
              >
                <option value="">Select status</option>
                <option value="want-to-read">Want to Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>

          {/* Genre */}
          {work.subjects && (
            <p>
              <strong>Genre</strong> {work.subjects.slice(0, 5).join(', ')}
            </p>
          )}

          {/* Sidor */}
          {firstEdition?.number_of_pages && (
            <p>
              <strong>Pages</strong> {firstEdition.number_of_pages}
            </p>
          )}

          {/* Beskrivning */}
          <h3>Book Description</h3>
          <p>
            {typeof work.description === 'string'
              ? work.description
              : work.description?.value ?? 'No description available.'}
          </p>
        </div>

      </div>
    </div>
  );
};