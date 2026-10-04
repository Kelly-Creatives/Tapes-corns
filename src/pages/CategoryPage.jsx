import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { getTrendingMovies, getMoviesByGenre, searchMoviesPage } from '../Services/Tmdb';

const fallbackMovies = [
  { id: 1, title: 'Dune: Part Two', overview: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.', vote_average: 8.8, release_date: '2024-03-01', image_poster: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&q=80' },
  { id: 2, title: 'Oppenheimer', overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', vote_average: 8.1, release_date: '2023-07-19', image_poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80' },
  { id: 3, title: 'Blade Runner 2049', overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.', vote_average: 8.0, release_date: '2017-10-04', image_poster: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80' },
  { id: 4, title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', vote_average: 8.6, release_date: '2014-11-05', image_poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ce7a?w=500&q=80' },
  { id: 5, title: 'The Batman', overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.', vote_average: 7.9, release_date: '2022-03-01', image_poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80' },
  { id: 6, title: 'Cyberpunk Edgerunners', overview: 'A Street Kid trying to survive in a technology and body modification-obsessed city of the future.', vote_average: 8.6, release_date: '2022-09-13', image_poster: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80' },
];

const categoryMeta = {
  trending: { title: 'Trending Now', subtitle: 'Most buzzed-about picks right now', getter: getTrendingMovies },
  action: { title: 'Action Movies', subtitle: 'Explosive stories, fearless heroes, and high-stakes thrills', genreId: 28 },
  drama: { title: 'Drama Movies', subtitle: 'Character-driven stories and emotional performances', genreId: 18 },
  comedy: { title: 'Comedy Movies', subtitle: 'Laugh-out-loud moments and feel-good favorites', genreId: 35 },
  'sci-fi': { title: 'Sci‑Fi Movies', subtitle: 'Mind-bending futures, cosmic mysteries, and immersive worlds', genreId: 878 },
};

const FEATURED_CAROUSEL_COUNT = 4;

const CategoryPage = ({ type = 'trending' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieSearch, setMovieSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const currentSearchRef = useRef(movieSearch);
  const searchTimeoutRef = useRef(null);
  const searchRequestRef = useRef(0);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      try {
        if (!import.meta.env.VITE_TMDB_API_KEY) {
          setMovies(fallbackMovies);
          return;
        }

        const meta = categoryMeta[type] || categoryMeta.trending;
        const result = meta.genreId
          ? await getMoviesByGenre(meta.genreId)
          : await meta.getter();

        setMovies(result || fallbackMovies);
      } catch (error) {
        console.error(error);
        setMovies(fallbackMovies);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [type]);

  useEffect(() => () => clearTimeout(searchTimeoutRef.current), []);

  const meta = categoryMeta[type] || categoryMeta.trending;
  const genreId = meta.genreId;
  const filteredMovies = movieSearch.trim()
    ? searchResults || []
    : movies;
  const featuredMovies = filteredMovies.slice(0, FEATURED_CAROUSEL_COUNT);
  const remainingMovies = filteredMovies.slice(FEATURED_CAROUSEL_COUNT);
  const filterSearchResults = (results) =>
    genreId ? results.filter((movie) => movie.genre_ids?.includes(genreId)) : results;

  const handleMovieSearchChange = (event) => {
    const value = event.target.value;
    const query = value.trim();
    currentSearchRef.current = value;
    setMovieSearch(value);
    searchRequestRef.current += 1;
    const requestId = searchRequestRef.current;
    clearTimeout(searchTimeoutRef.current);
    setSearchError('');
    setSearchLoadingMore(false);

    if (!query) {
      setSearchResults(null);
      setSearchPage(1);
      setSearchTotalPages(1);
      setSearchLoading(false);
      return;
    }

    setSearchResults([]);
    setSearchPage(1);
    setSearchTotalPages(1);
    if (!import.meta.env.VITE_TMDB_API_KEY) {
      setSearchLoading(false);
      setSearchError('Movie search requires a TMDB API key. Add VITE_TMDB_API_KEY to your environment.');
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchMoviesPage(query, 1);
        if (searchRequestRef.current !== requestId) return;
        setSearchResults(filterSearchResults(data.results));
        setSearchTotalPages(data.totalPages);
      } catch (error) {
        if (searchRequestRef.current !== requestId) return;
        console.error(error);
        setSearchError(`Could not search ${meta.title}. Please try again.`);
      } finally {
        if (searchRequestRef.current === requestId) setSearchLoading(false);
      }
    }, 350);
  };

  const loadMoreSearchResults = async () => {
    const query = movieSearch.trim();
    const nextPage = searchPage + 1;
    if (!query || searchLoadingMore || nextPage > searchTotalPages) return;

    const requestId = searchRequestRef.current;
    setSearchLoadingMore(true);
    setSearchError('');
    try {
      const data = await searchMoviesPage(query, nextPage);
      if (searchRequestRef.current !== requestId || currentSearchRef.current.trim() !== query) return;
      setSearchResults((previousResults) => [
        ...(previousResults || []),
        ...filterSearchResults(data.results),
      ]);
      setSearchPage(nextPage);
      setSearchTotalPages(data.totalPages);
    } catch (error) {
      if (searchRequestRef.current !== requestId || currentSearchRef.current.trim() !== query) return;
      console.error(error);
      setSearchError(`Could not load more ${meta.title}. Please try again.`);
    } finally {
      setSearchLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
            Browse category
          </p>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {meta.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-7">
            {meta.subtitle}
          </p>
          <label className="relative mt-6 block w-full max-w-xl">
              <span className="sr-only">Search {meta.title.toLowerCase()}</span>
              <input
                type="search"
                value={movieSearch}
                onChange={handleMovieSearchChange}
                placeholder={`Search ${meta.title.toLowerCase()}...`}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-red-400/70 focus:bg-white/10 sm:py-3.5"
              />
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
          </label>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-300">Loading movies...</div>
        ) : searchLoading ? (
          <div className="py-20 text-center text-slate-300">Searching Action movies...</div>
        ) : searchError ? (
          <p role="alert" className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-8 text-center text-sm text-red-200">
            {searchError}
          </p>
        ) : (
          <>
            {featuredMovies.length > 0 && (
              <section className="mb-8 sm:mb-10" aria-label={`${meta.title} featured movies`}>
                <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                  <h2 className="text-lg font-bold text-white sm:text-xl">Featured picks</h2>
                  <span className="shrink-0 text-xs text-slate-400">Swipe or scroll for more</span>
                </div>
                <div className="-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:gap-6 sm:px-0">
                  {featuredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} layout="horizontal" />
                  ))}
                </div>
              </section>
            )}

            {remainingMovies.length > 0 && (
              <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-5">
                {remainingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
            {filteredMovies.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300">
                {movieSearch.trim()
                  ? `No ${meta.title.toLowerCase()} match "${movieSearch}".`
                  : 'No movies are available in this category.'}
              </p>
            )}
            {movieSearch.trim() && searchPage < searchTotalPages && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={loadMoreSearchResults}
                  disabled={searchLoadingMore}
                  className="min-h-11 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-wait disabled:opacity-60"
                >
                  {searchLoadingMore ? 'Loading more...' : 'Load more results'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
