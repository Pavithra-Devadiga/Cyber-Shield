import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../../api/client';

export default function Layout() {
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        if (res.data && res.data.data) {
          setUnreadCount(res.data.data.unreadCount || 0);
        }
      } catch {
        // Ignore offline or quiet errors
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sleek Top Navigation Bar */}
      <Navbar unreadCount={unreadCount} />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Aesthetic Academic Project Footer */}
      <footer className="border-t border-stone-800/80 py-6 text-xs text-stone-400 bg-stone-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="font-bold text-stone-200">CyberShield</span>
            <span className="text-stone-600">&bull;</span>
            <span className="text-stone-400">Cybersecurity Project &bull; Summer Internship II</span>
          </div>
          <div className="text-stone-400">
            Developer: <strong className="text-amber-400 font-semibold">Pavithra</strong> (Reg No: <span className="font-mono text-stone-300">U25UV24T064028</span>)
          </div>
        </div>
      </footer>
    </div>
  );
}
