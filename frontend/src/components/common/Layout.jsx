import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
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
        // Ignore offline errors
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const getPageTitle = (path) => {
    if (path.startsWith('/scans/new')) return 'Launch Security Audit';
    if (path.startsWith('/scans/')) return 'Audit Findings & Telemetry';
    if (path === '/scans') return 'Audit History & Evaluations';
    if (path === '/vulnerabilities') return 'Identified Vulnerabilities Catalog';
    if (path === '/reports') return 'Compliance & PDF Reports';
    if (path === '/notifications') return 'Audit Alerts & Notifications';
    return 'Security Posture Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-[#0b1329] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Spacious Side Navigation Bar */}
      <Sidebar unreadCount={unreadCount} />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={getPageTitle(location.pathname)} />
        <main className="flex-1 p-8 lg:p-10 overflow-y-auto max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
