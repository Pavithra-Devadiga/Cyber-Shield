import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  ShieldAlert,
  History,
  Bug,
  FileText,
  Bell,
  Plus,
  Database,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

export default function Navbar({ unreadCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scans/new', label: 'New Audit', icon: ShieldAlert },
    { to: '/scans', label: 'History', icon: History },
    { to: '/vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/10 group-hover:bg-amber-500/20 transition-all">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-stone-100 tracking-tight">
                    Cyber<span className="text-amber-400">Shield</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
                    <GraduationCap className="w-3 h-3" />
                    Internship II
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium tracking-wide uppercase -mt-0.5">
                  Vulnerability Auditor
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-stone-800">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-950/40'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Live Database Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-medium">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-400">DB:</span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Connected
              </span>
            </div>

            {/* Launch New Audit CTA */}
            <Link
              to="/scans/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Audit</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/scans/new"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs"
            >
              Scan
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950/98 px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
