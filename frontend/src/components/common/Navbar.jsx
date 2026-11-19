import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Plus, Activity } from 'lucide-react';

export default function Navbar({ title = 'Dashboard' }) {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Database Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>DB:</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        {/* Engine Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Java 21 Engine:</span>
          <span className="text-cyan-400 font-semibold">Active</span>
        </div>

        {/* Launch Scan Action */}
        <Link
          to="/scans/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Scan</span>
        </Link>

        {/* Single Unified Role Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200">Security Auditor</span>
            <span className="text-[10px] text-slate-400 font-medium">Full Access</span>
          </div>
        </div>
      </div>
    </header>
  );
}
