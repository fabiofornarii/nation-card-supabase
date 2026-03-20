import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-[#255ff1] selection:text-white">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#255ff1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="block hover:opacity-90 transition-opacity -ml-3">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c658f5d89dc1c9d125787/be949397a_Progettosenzatitolo14.png"
              alt="NationCard"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link to="/#locali" className="hover:text-[#255ff1] transition-colors">Locali</Link>
            <Link to="/#faq" className="hover:text-[#255ff1] transition-colors">FAQ</Link>
            <Link to="/#map" className="hover:text-[#255ff1] transition-colors">Mappa</Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl">
            <Link to="/#locali" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold hover:text-[#255ff1]">Locali</Link>
            <Link to="/#faq" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold hover:text-[#255ff1]">FAQ</Link>
            <Link to="/#map" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold hover:text-[#255ff1]">Mappa</Link>
          </div>
        )}
      </nav>

      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 mt-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c658f5d89dc1c9d125787/be949397a_Progettosenzatitolo14.png"
              alt="NationCard"
              className="h-20 w-auto"
            />
            <span className="text-xl text-gray-600 font-light">×</span>
            <a href="https://www.liceopertiniladispoli.edu.it/" target="_blank" rel="noopener noreferrer">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c658f5d89dc1c9d125787/2aac81be6_Progettosenzatitolo16.png"
                alt="Liceo Sandro Pertini"
                className="h-14 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
            La tessera definitiva per Ladispoli al massimo. Sconti, eventi e community.
          </p>
          <p className="text-gray-600 text-xs max-w-xl mx-auto italic">
            Le convenzioni e gli sconti sono riservati ai possessori della tessera studentesca e possono variare nel tempo.
            Si consiglia di verificare sempre le condizioni direttamente presso il negozio.
          </p>
          <div className="mt-8 text-xs text-gray-700">
            © 2026 Nation Card Pertini | Developed by Fabio Fornari
          </div>
        </div>
      </footer>
    </div>
  );
}
