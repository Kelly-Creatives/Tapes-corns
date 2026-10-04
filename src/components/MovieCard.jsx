import { Star, X, Play, Video } from 'lucide-react';
import { useState } from 'react';
import { getMovieVideos } from '../Services/Tmdb';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, layout = 'vertical' }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const videos = await getMovieVideos(movie.id);
      const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');
      if (trailer) {
        setVideoKey(trailer.key);
        setShowVideo(true);
      } else {
        alert("No trailer available for this movie.");
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching trailer.");
    }
    setIsLoading(false);
  };

  const closeVideo = (e) => {
    e.stopPropagation();
    setShowVideo(false);
    setVideoKey(null);
  };

  const isHorizontal = layout === 'horizontal';

  return (
    <>
      <article className={`motion-fade-up group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-[0_25px_60px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-[0_30px_80px_rgba(239,68,68,0.18)] ${isHorizontal ? 'flex h-full w-[min(88vw,440px)] shrink-0 snap-start flex-row' : ''}`}>
        <img
          src={movie.poster_path ? IMG_PATH + movie.poster_path : (movie.image_poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80')}
          alt={movie.title || movie.name}
          loading="lazy"
          className={`${isHorizontal ? 'h-auto w-[38%] shrink-0 self-stretch object-cover' : 'aspect-[2/3] w-full object-cover'} transition duration-500 group-hover:scale-105`}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-white">Loading...</span>
          </div>
        )}

        <div className={`min-w-0 space-y-3 p-3 sm:space-y-4 sm:p-5 ${isHorizontal ? 'flex flex-1 flex-col justify-center' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <h4 className="min-w-0 truncate text-base font-semibold text-white sm:text-lg">{movie.title || movie.name}</h4>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300">
              <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1) || '8.0'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{movie.release_date || movie.first_air_date || 'Release date unavailable'}</span>
            {movie.original_language && (
              <span className="uppercase">{movie.original_language}</span>
            )}
          </div>

          <p className="text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
            {movie.overview || 'No synopsis is available for this movie.'}
          </p>

          {movie.popularity !== undefined && (
            <p className="text-xs text-slate-400">
              Popularity: {Math.round(movie.popularity)}
            </p>
          )}

          <div className="mt-auto grid grid-cols-2 gap-2 pt-1 sm:gap-3 sm:pt-2">
            <button
              onClick={(e) => { e.stopPropagation(); handlePlay(); }}
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-red-500 to-red-400 px-2 py-2.5 text-xs font-bold text-white transition duration-200 hover:scale-[1.03] hover:opacity-90 sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Video size={16} /> Trailers
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowComingSoon(true); }}
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs font-bold text-white transition duration-200 hover:scale-[1.03] hover:bg-white/10 sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Play size={16} /> Watch
            </button>
          </div>
        </div>
      </article>

      {showVideo && videoKey && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 sm:p-5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={closeVideo}
            className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 sm:right-6 sm:top-6"
          >
            <X size={28} />
          </button>
          <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {showComingSoon && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowComingSoon(false); }}>
          <div
            className="w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:rounded-[28px] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-2xl font-bold text-white">Coming Soon</h3>
            <p className="mb-6 text-base leading-7 text-slate-300">
              Full movies will be streamed on the platform soon! Stay tuned for updates.
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setShowComingSoon(false); }}
              className="rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
