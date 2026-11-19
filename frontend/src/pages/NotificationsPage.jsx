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
  Shield,
  ArrowRight,
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
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Security Alerts & Notifications</h2>
          <p className="text-blue-300/70 text-sm mt-1">
            Real-time audit updates, scan status alerts, and vulnerability escalation warnings.
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d162e] border border-blue-900/60 hover:bg-blue-900/30 text-blue-200 text-xs font-semibold transition-colors shadow-sm"
        >
          <CheckCheck className="w-4 h-4 text-sky-400" />
          Mark All Read
        </button>
      </div>

      <div className="rounded-2xl bg-[#0d162e] border border-blue-900/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm space-y-2">
            <Bell className="w-8 h-8 text-blue-500/40 mx-auto" />
            <p className="font-semibold text-white">No notifications recorded</p>
            <p className="text-xs text-blue-300/60">Audit progress and security triggers will be logged here.</p>
          </div>
        ) : (
          <div className="divide-y divide-blue-950/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  n.isRead ? 'bg-transparent' : 'bg-blue-950/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {getTypeIcon(n.type)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-blue-300/60">
                      <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                      {n.scanId && (
                        <Link
                          to={`/scans/${n.scanId}`}
                          className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          View Scan #{n.scanId} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-blue-300/60 hover:text-white hover:bg-blue-900/30 transition-colors shrink-0"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-blue-950 flex items-center justify-between text-xs text-blue-300/70">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-blue-900/60 bg-[#091126] hover:bg-blue-900/30 text-blue-300 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-blue-900/60 bg-[#091126] hover:bg-blue-900/30 text-blue-300 disabled:opacity-40 transition-colors"
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
