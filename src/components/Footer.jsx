import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
            <Film className="text-red-500" size={22} />
          </div>
          <h2 className="text-xl font-bold text-white">Tapes & Corns</h2>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          Your ultimate destination for movies and entertainment. Enjoy trailers, movie information, and more with our vast collection of films from around the world.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-200">
          <Link to="/about" className="transition hover:text-red-300">About</Link>
          <Link to="/contact" className="transition hover:text-red-300">Contact Us</Link>
          <a href="#" className="transition hover:text-red-300">Privacy Policy</a>
          <a href="#" className="transition hover:text-red-300">Terms of Service</a>
        </div>

        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Tapes & Corns. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
