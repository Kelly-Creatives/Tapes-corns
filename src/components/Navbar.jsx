import { useState } from 'react';
import {
  Menu,
  Search,
  Film,
  X,
  House,
  TrendingUp,
  Zap,
  Drama,
  Laugh,
  Atom,
  Info,
  Mail,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const categoryLinks = [
  { label: 'Trending', to: '/trending', Icon: TrendingUp },
  { label: 'Action', to: '/action', Icon: Zap },
  { label: 'Drama', to: '/drama', Icon: Drama },
  { label: 'Comedy', to: '/comedy', Icon: Laugh },
  { label: 'Sci‑Fi', to: '/sci-fi', Icon: Atom },
];

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;

const NavIconLink = ({ to, Icon, children, onClick, end = false }) => (
  <NavLink to={to} end={end} className={navLinkClass} onClick={onClick}>
    <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
    <span>{children}</span>
  </NavLink>
);

const Navbar = ({
  searchTerm = '',
  setSearchTerm = () => {},
  handleSearch = (e) => e.preventDefault(),
  showSearch = true,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 w-[94%] max-w-7xl -translate-x-1/2 border border-white/10 bg-slate-950/85 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.8)] backdrop-blur-xl transition-[border-radius] duration-300 sm:top-5 sm:px-6 ${
        menuOpen ? 'rounded-3xl' : 'rounded-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
            <Film className="text-red-500" size={22} />
          </div>
          <NavLink to="/" className="group" onClick={closeMenu}>
            <h1 className="text-lg font-black tracking-wide sm:text-2xl">
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
                Tapes & Corns
              </span>
            </h1>
          </NavLink>
        </div>

        <div className="hidden items-center gap-1 xl:flex lg:gap-2">
          <NavIconLink to="/" Icon={House} end>Home</NavIconLink>
          {categoryLinks.map((category) => (
            <NavIconLink key={category.label} to={category.to} Icon={category.Icon}>
              {category.label}
            </NavIconLink>
          ))}
          <NavIconLink to="/about" Icon={Info}>About</NavIconLink>
          <NavIconLink to="/contact" Icon={Mail}>Contact</NavIconLink>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showSearch && (
            <form onSubmit={handleSearch} className="relative hidden w-[220px] lg:block xl:w-[260px]">
              <input
                type="search"
                placeholder="Search movies..."
                aria-label="Search movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-red-400/80 focus:bg-white/10"
              />
              <Search size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </form>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:scale-105 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 xl:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out xl:hidden ${
          menuOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col border-t border-white/10 pt-3">
            <NavIconLink to="/" Icon={House} end onClick={closeMenu}>Home</NavIconLink>
            {categoryLinks.map((category) => (
              <NavIconLink
                key={category.label}
                to={category.to}
                Icon={category.Icon}
                onClick={closeMenu}
              >
                {category.label}
              </NavIconLink>
            ))}
            <NavIconLink to="/about" Icon={Info} onClick={closeMenu}>About</NavIconLink>
            <NavIconLink to="/contact" Icon={Mail} onClick={closeMenu}>Contact Us</NavIconLink>

            {showSearch && (
              <form onSubmit={(e) => { handleSearch(e); closeMenu(); }} className="relative mt-3 pb-1">
                <input
                  type="search"
                  placeholder="Search movies..."
                  aria-label="Search movies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-red-400/80 focus:bg-white/10"
                />
                <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
