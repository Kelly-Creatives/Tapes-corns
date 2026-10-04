import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar showSearch={false} />

      <main className="mx-auto max-w-5xl px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:rounded-[30px] sm:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
            Our story
          </p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
            About Tapes & Corns
          </h1>
          <p className="text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Tapes & Corns is a movie-loving community built for fans who want more than a list of titles.
            We spotlight standout stories, unforgettable performances, and the kinds of films worth revisiting
            again and again. From big blockbusters to cult favorites, we celebrate cinema that sparks conversation.
          </p>
          <p className="mt-5 text-sm leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            Whether you are hunting for your next watch, looking back at a classic, or just browsing for inspiration,
            we make it easy to discover something unforgettable.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
