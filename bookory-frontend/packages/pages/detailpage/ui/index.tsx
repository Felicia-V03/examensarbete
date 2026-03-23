import './index.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Work, EditionsResponse, Author } from '@bookory-frontend/book';
import axios from 'axios';

export const DetailPage = () => {
  const { id } = useParams();

  const [work, setWork] = useState<Work | null>(null);
  const [editions, setEditions] = useState<EditionsResponse | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 1️⃣ Hämta work + editions
        const [workRes, editionsRes] = await Promise.all([
          axios.get<Work>(`https://openlibrary.org/works/${id}.json`),
          axios.get<EditionsResponse>(
            `https://openlibrary.org/works/${id}/editions.json`
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

    if (id) fetchData();
  }, [id]);

  // const getCoverUrl = (coverId?: number) => {
  //   if (!coverId) return '';
  //   return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  // };

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
    <main className={`detail-page detail-page-${id}`}>
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

        {/* 📄 Sidor */}
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