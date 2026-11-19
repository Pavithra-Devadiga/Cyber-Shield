import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  History,
  Bug,
  FileText,
  Bell,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function Sidebar({ unreadCount = 0 }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scans/new', label: 'New Audit', icon: ShieldAlert },
    { to: '/scans', label: 'Scan History', icon: History },
    { to: '/vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <aside className="w-72 bg-[#0c142b] border-r border-blue-950/60 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-blue-950/60 gap-3.5">
        <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 shadow-lg shadow-blue-600/10">
          <Shield className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
            Cyber<span className="text-sky-400">Shield</span>
          </span>
          <span className="block text-[11px] text-blue-300/70 font-medium tracking-wider uppercase -mt-0.5">
            Security Auditor
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-5 space-y-2 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300/50 px-3.5 mb-3">
          Audit Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-400 text-slate-950">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Link to Project Landing Page */}
        <div className="pt-4 mt-4 border-t border-blue-950/60">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-300/80 hover:text-white hover:bg-blue-950/30 transition-all border border-transparent hover:border-blue-900/40"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Project Landing
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </nav>

      {/* Academic Attribution Footer (Clean & Aesthetic, No Database / No Profile) */}
      <div className="p-5 border-t border-blue-950/60 bg-[#090f21]">
        <div className="space-y-1">
          <span className="block text-[11px] text-blue-300/60 uppercase tracking-wider font-semibold">
            Academic Project
          </span>
          <div className="text-xs font-bold text-slate-200">
            Pavithra <span className="text-sky-400 font-mono text-[11px] font-normal">(U25UV24T064028)</span>
          </div>
          <div className="text-[11px] text-blue-300/50">
            Summer Internship II
          </div>
        </div>
      </div>
    </aside>
  );
}
