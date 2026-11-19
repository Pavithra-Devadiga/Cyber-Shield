import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  History,
  ExternalLink,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  Ban,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';

export default function ScansPage() {
  const [scans, setScans] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      const res = await api.get(`/scans?page=${page}&size=10`);
      if (res.data && res.data.data) {
        setScans(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load scans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [page]);

  useEffect(() => {
    const hasActive = scans.some((s) => s.status === 'RUNNING' || s.status === 'QUEUED');
    if (!hasActive) return;

    const interval = setInterval(fetchScans, 4000);
    return () => clearInterval(interval);
  }, [scans]);

  const handleCancel = async (id, e) => {
    e.preventDefault();
    try {
      await api.post(`/scans/${id}/cancel`);
      fetchScans();
    } catch (err) {
      console.error('Failed to cancel scan', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Vulnerability Scan History</h2>
          <p className="text-stone-400 text-sm mt-1">
            Real-time tracking of security audits, automated findings, and posture grades.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchScans}
            className="p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-100 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/scans/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            New Audit
          </Link>
        </div>
      </div>

      {/* Scans Table */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-950/70 text-stone-400 text-xs uppercase tracking-wider font-semibold border-b border-stone-800">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Target Domain</th>
                <th className="py-4 px-6">Profile</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Score & Posture</th>
                <th className="py-4 px-6">Severity Breakdown</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
                  </td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400 text-sm space-y-2">
                    <Database className="w-6 h-6 text-stone-500 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-stone-300">No scans found in database</p>
                    <p className="text-xs text-stone-400">Launch your first live audit using the button above.</p>
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-stone-400 font-semibold">
                      #{scan.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-stone-100 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{scan.targetUrl}</span>
                        <a
                          href={scan.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-400 hover:text-amber-400 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-stone-400 font-mono">
                      {scan.scanType}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="py-4 px-6">
                      <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      {scan.vulnerabilities && scan.vulnerabilities.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map((sev) => {
                            const count = scan.vulnerabilities.filter((v) => v.severity === sev).length;
                            if (count === 0) return null;
                            const colors = {
                              CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                              HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                              MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                              LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                              INFO: 'bg-stone-800 text-stone-300 border-stone-700',
                            };
                            return (
                              <span
                                key={sev}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${colors[sev]}`}
                              >
                                {count} {sev.slice(0, 4)}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">0 findings</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(scan.status === 'RUNNING' || scan.status === 'QUEUED') && (
                          <button
                            onClick={(e) => handleCancel(scan.id, e)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Cancel Scan"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          to={`/scans/${scan.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                        >
                          Inspect
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
