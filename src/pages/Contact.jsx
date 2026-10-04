import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar showSearch={false} />

      <main className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:rounded-[30px] sm:p-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
            Get in touch
          </p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Want to share a recommendation, ask a question, or collaborate on a feature? We would love to hear from you.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-200 sm:mt-8 sm:space-y-4 sm:text-base">
            <div className="break-words rounded-2xl border border-white/10 bg-white/5 p-4">
              <strong className="text-white">Email:</strong> hello@tapesandcorns.com
            </div>
            <div className="break-words rounded-2xl border border-white/10 bg-white/5 p-4">
              <strong className="text-white">Instagram:</strong> @tapesandcorns
            </div>
            <div className="break-words rounded-2xl border border-white/10 bg-white/5 p-4">
              <strong className="text-white">Location:</strong> Norskenn, Kigali, Rwanda
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
