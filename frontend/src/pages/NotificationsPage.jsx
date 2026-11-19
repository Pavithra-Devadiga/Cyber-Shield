import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications?page=${page}&size=10`);
      if (res.data && res.data.data) {
        setNotifications(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'ERROR':
        return <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-stone-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Security Alerts & Notifications</h2>
          <p className="text-stone-400 text-sm mt-1">
            Real-time audit updates, scan status alerts, and vulnerability escalation warnings.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors shadow-sm"
        >
          <CheckCheck className="w-4 h-4 text-amber-400" />
          Mark All as Read
        </button>
      </div>

      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-stone-800/80">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  n.isRead ? 'opacity-70 bg-stone-950/20' : 'bg-stone-900/50 hover:bg-stone-900'
                }`}
              >
                {getTypeIcon(n.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-stone-100">{n.title}</span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{n.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                  {n.scanId && (
                    <Link
                      to={`/scans/${n.scanId}`}
                      className="p-1.5 text-stone-400 hover:text-amber-400"
                      title="View Scan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-stone-800 hover:bg-stone-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-stone-800 hover:bg-stone-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
