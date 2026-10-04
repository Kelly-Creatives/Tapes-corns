import { Play, Star, X } from 'lucide-react';
import { useState } from 'react';
import { getMovieVideos } from '../Services/Tmdb';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const Hero = ({ featured }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!featured) return null;

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const videos = await getMovieVideos(featured.id);
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

  const closeVideo = () => {
    setShowVideo(false);
    setVideoKey(null);
  };

  return (
    <>
      <section
        className="relative min-h-[min(760px,82svh)] w-full overflow-hidden sm:min-h-[85vh]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.45) 32%, rgba(2,6,23,0.4) 100%), url(${featured.backdrop_path ? IMG_PATH + featured.backdrop_path : featured.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[min(760px,82svh)] max-w-7xl items-end px-4 pb-8 pt-28 sm:min-h-[85vh] sm:px-6 sm:pb-14 lg:px-8">
          <div className="motion-fade-up w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/65 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-[30px] sm:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-200 sm:mb-4">
              Featured film
            </div>

            <h2 className="mb-3 break-words text-3xl font-black tracking-tight text-white sm:mb-4 sm:text-5xl lg:text-6xl">
              {featured.title || featured.name}
            </h2>

            <div className="mb-4 flex items-center gap-3 text-sm text-orange-300 sm:mb-5 sm:text-base">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Star size={16} fill="currentColor" /> {featured.vote_average?.toFixed(1) || '9.5'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-200">{featured.release_date?.split('-')[0] || '2024'}</span>
            </div>

            <p className="mb-6 max-w-xl text-sm leading-6 text-slate-300 sm:mb-8 sm:text-lg sm:leading-7">
              {featured.overview?.length > 150 ? `${featured.overview.substring(0, 150)}...` : featured.overview}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={handlePlay}
                disabled={isLoading}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition duration-200 hover:scale-[1.03] hover:shadow-red-500/40 disabled:cursor-wait disabled:opacity-75 sm:flex-none sm:px-6 sm:text-base"
              >
                <Play size={18} fill="currentColor" />
                {isLoading ? 'Loading...' : 'Watch Now'}
              </button>

              <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition duration-200 hover:scale-[1.03] hover:bg-white/10 sm:flex-none sm:px-6 sm:text-base">
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {showVideo && videoKey && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 sm:p-5">
          <button
            onClick={closeVideo}
            className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 sm:right-6 sm:top-6"
          >
            <X size={30} />
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
    </>
  );
};

export default Hero;
