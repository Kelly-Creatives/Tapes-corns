import { useState, useEffect } from 'react';
import { TrendingUp, Film, Target, Laugh } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { getTrendingMovies, searchMovies, getMoviesByGenre } from '../Services/Tmdb';

const dummyData = [
  { id: 1, title: 'Dune: Part Two', overview: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.', vote_average: 8.8, release_date: '2024-03-01', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1280&q=80', image_poster: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&q=80' },
  { id: 2, title: 'Oppenheimer', overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', vote_average: 8.1, release_date: '2023-07-19', image_poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80' },
  { id: 3, title: 'Blade Runner 2049', overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.', vote_average: 8.0, release_date: '2017-10-04', image_poster: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80' },
  { id: 4, title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', vote_average: 8.6, release_date: '2014-11-05', image_poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ce7a?w=500&q=80' },
  { id: 5, title: 'The Batman', overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.', vote_average: 7.9, release_date: '2022-03-01', image_poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80' },
  { id: 6, title: 'Cyberpunk Edgerunners', overview: 'A Street Kid trying to survive in a technology and body modification-obsessed city of the future.', vote_average: 8.6, release_date: '2022-09-13', image_poster: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80' },
  { id: 7, title: 'Inception', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', vote_average: 8.8, release_date: '2010-07-15', image_poster: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&q=80' },
  { id: 8, title: 'Matrix Resurrections', overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it.', vote_average: 6.5, release_date: '2021-12-22', image_poster: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80' },
];

const categoriesConfig = [
  { id: 'trending', title: 'Trending Now', icon: <TrendingUp className="text-red-400" size={18} /> },
  { id: 28, title: 'Action Movies', icon: <Target className="text-red-400" size={18} /> },
  { id: 18, title: 'Drama Movies', icon: <Film className="text-red-400" size={18} /> },
  { id: 35, title: 'Comedy Movies', icon: <Laugh className="text-red-400" size={18} /> },
  { id: 878, title: 'Sci-Fi Movies', icon: <TrendingUp className="text-red-400" size={18} /> },
];

const Home = () => {
  const [movieCategories, setMovieCategories] = useState({});
  const [featured, setFeatured] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleExpand = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const fetchAllCategories = async (isInitial = false) => {
    if (!isInitial) setLoading(true);
    try {
      if (!import.meta.env.VITE_TMDB_API_KEY) {
        setMovieCategories({ trending: dummyData });
        setFeatured(dummyData[0]);
        setLoading(false);
        return;
      }

      const results = {};

      const trending = await getTrendingMovies();
      results.trending = trending;
      if (trending && trending.length > 0) {
        setFeatured(trending[0]);
      }

      for (const cat of categoriesConfig) {
        if (cat.id !== 'trending') {
          const movies = await getMoviesByGenre(cat.id);
          results[cat.id] = movies;
        }
      }

      setMovieCategories(results);
    } catch (err) {
      console.error(err);
      setMovieCategories({ trending: dummyData });
      setFeatured(dummyData[0]);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const results = await searchMovies(searchTerm);
        setMovieCategories({ search: results });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    } else {
      fetchAllCategories();
    }
  };

  useEffect(() => {
    fetchAllCategories(true);
  }, []);

  const renderGrid = (movies, catId) => {
    const isExpanded = expandedCategories[catId];
    const displayedMovies = isExpanded ? movies : movies?.slice(0, 10);
    const hasMore = movies?.length > 10;

    return (
      <>
        <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-5">
          {displayedMovies && displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => toggleExpand(catId)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
            >
              {isExpanded ? 'View less' : 'View more'}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      <Hero featured={featured} />

      <main className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        {loading ? (
          <div className="py-24 text-center text-lg text-slate-300">Loading tapes...</div>
        ) : searchTerm ? (
          <div className="mb-12">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white sm:mb-8 sm:text-2xl">
              <TrendingUp className="text-red-400" /> Search Results
            </h3>
            {renderGrid(movieCategories.search, 'search')}
          </div>
        ) : (
          categoriesConfig.map((cat) => (
            movieCategories[cat.id] && movieCategories[cat.id].length > 0 && (
              <section
                key={cat.id}
                id={cat.id === 'trending' ? 'trending' : cat.id === 28 ? 'action' : cat.id === 18 ? 'drama' : cat.id === 35 ? 'comedy' : 'sci-fi'}
                className="mb-12 scroll-mt-24 sm:mb-16 sm:scroll-mt-28"
              >
                <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white sm:mb-8 sm:text-2xl">
                  {cat.icon} {cat.title}
                </h3>
                {renderGrid(movieCategories[cat.id], cat.id)}
              </section>
            )
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
