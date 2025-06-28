// Finalized and improved App.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDebounce } from 'react-use';
import { Book } from 'lucide-react';
import Search from './components/Search';
import BookCard from './components/BookCard';
import './index.css';

const API_LINK_ALL = import.meta.env.VITE_BOOK_API_LINK_All;
const API_LINK = import.meta.env.VITE_BOOK_API_LINK;
const API_KEY = import.meta.env.VITE_BOOK_API_KEY;

const API_OPTIONS_GET = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

const categories = [
  { name: 'All', style: 'btn-all text-sm' },
  { name: 'Fiction', style: 'btn-primary text-sm' },
  { name: 'Non-fiction', style: 'btn-secondary text-sm' },
  { name: 'Romance', style: 'btn-danger text-sm' },
  { name: 'Mystery', style: 'btn-accent text-sm' },
  { name: 'Sci-fi', style: 'btn-warning text-sm' },
  { name: 'Fantasy', style: 'btn-ghost text-sm' },
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [displayedCategoryName, setDisplayedCategoryName] = useState('All Books');
  const skipSearchEffect = useRef(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchingBooks = useCallback(async (query = '', bookType) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = !query
        ? `${API_LINK_ALL}`
        : `${API_LINK}${encodeURIComponent(query)}&maxResults=24&orderBy=relevance`;

      if (bookType && categories.some(c => c.name === bookType)) {
        setDisplayedCategoryName(`${bookType} Books`);
      } else if (!query) {
        setDisplayedCategoryName('All Books');
      } else {
        setDisplayedCategoryName('Search Results');
      }

      const response = await fetch(endpoint, API_OPTIONS_GET);

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      if (data.totalItems === 0 || !data.items) {
        setErrorMsg('No books found for your search.');
        setBookList([]);
        return;
      }

      setBookList(data.items);
    } catch (e) {
      console.error(`Error fetching books: ${e}`);
      setErrorMsg('Error fetching books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    if (debouncedSearchTerm !== '') {
      fetchingBooks(debouncedSearchTerm);
    } else {
      fetchingBooks('', 'All');
    }
  }, [debouncedSearchTerm, fetchingBooks]);

  return (
    <main className="min-h-screen px-8 py-10">
      <header className="text-center mb-4 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-glow">
            <Book size={32} className="text-white" />
          </div>
          <h1 className="hero-title text-gradient-primary shadow-glow">BookVerse</h1>
        </div>
        <p className="hero-subtitle text-gradient-accent text-gradient-secondary shadow-glow">
          Find Your Next Favorite Read, Instantly.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up">
        {categories.map((category) => (
          <button
            key={category.name}
            className={category.style}
            onClick={() => {
              const query = category.name === 'All' ? '' : `subject:${category.name}`;
              fetchingBooks(query, category.name);
              if (searchTerm !== '') {
                skipSearchEffect.current = true;
                setSearchTerm('');
              }
            }}>
            {category.name}
          </button>
        ))}
      </div>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <section>
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-2 w-fit mx-auto">
          {displayedCategoryName}
        </h2>

        {isLoading ? (
          <p className='text-white'>Loading...</p>
        ) : errorMsg ? (
          <p className='text-red-700'>{errorMsg}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 mt-10">
            {bookList.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default App;
