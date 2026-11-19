import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar({ title = 'Dashboard' }) {
  return (
    <header className="h-20 bg-[#0c142b]/80 backdrop-blur-md border-b border-blue-950/60 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-xs text-blue-300/60 mt-0.5">Automated Web Vulnerability & DAST Assessment</p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-950/40 border border-blue-900/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Home Banner</span>
        </Link>

        <Link
          to="/scans/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
