const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY || '');
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

export const getTrendingMovies = async () => {
  const url = buildUrl('/trending/movie/week');
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }

  const data = await response.json();
  return data.results || [];
};

export const getPopularMovies = async () => {
  const url = buildUrl('/movie/popular');
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }

  const data = await response.json();
  return data.results || [];
};

export const searchMoviesPage = async (query, page = 1) => {
  const url = buildUrl('/search/movie', { query, page });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  const data = await response.json();
  return {
    results: data.results || [],
    totalPages: data.total_pages || 1,
  };
};

export const searchMovies = async (query) => {
  const data = await searchMoviesPage(query);
  return data.results;
};

export const getMovieVideos = async (movieId) => {
  const url = buildUrl(`/movie/${movieId}/videos`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch movie videos');
  }

  const data = await response.json();
  return data.results || [];
};

export const getMoviesByGenre = async (genreId) => {
  const url = buildUrl('/discover/movie', { with_genres: genreId });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch movies by genre');
  }

  const data = await response.json();
  return data.results || [];
};