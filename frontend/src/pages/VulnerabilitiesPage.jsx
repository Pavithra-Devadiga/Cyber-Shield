import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SeverityBadge from '../components/common/SeverityBadge';
import {
  Bug,
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Database,
} from 'lucide-react';

export default function VulnerabilitiesPage() {
  const [vulns, setVulns] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [severity, setSeverity] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState(null);

  const fetchVulnerabilities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', 12);
      if (severity) params.append('severity', severity);
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const res = await api.get(`/vulnerabilities?${params.toString()}`);
      if (res.data && res.data.data) {
        setVulns(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load vulnerabilities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulnerabilities();
  }, [page, severity, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchVulnerabilities();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Global Vulnerability Database</h2>
          <p className="text-stone-400 text-sm mt-1">
            Aggregated findings, exploit mechanics analysis, and specific remediation advisories.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">
          Total Findings: <strong className="text-amber-400">{totalElements}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-wrap items-center gap-3 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title, description or CWE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
          />
        </form>

        <select
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-xs font-medium text-stone-300 focus:outline-none focus:border-amber-500"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="INFO">Informational</option>
        </select>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-stone-950 border border-stone-700/80 rounded-xl text-xs font-medium text-stone-300 focus:outline-none focus:border-amber-500"
        >
          <option value="">All Categories</option>
          <option value="SSL_TLS">SSL / TLS</option>
          <option value="SECURITY_HEADERS">Security Headers</option>
          <option value="SQL_INJECTION">SQL Injection</option>
          <option value="XSS">XSS</option>
          <option value="ENDPOINT_EXPOSURE">Endpoint Exposure</option>
        </select>
      </div>

      {/* Findings Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
        </div>
      ) : vulns.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-sm space-y-2">
          <Database className="w-8 h-8 text-stone-600 mx-auto" />
          <p>No vulnerability findings found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vulns.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVuln(v)}
              className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 cursor-pointer transition-all flex flex-col justify-between space-y-3 shadow-lg group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <SeverityBadge severity={v.severity} />
                  {v.cwe && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400">
                      {v.cwe}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {v.title}
                </h3>

                <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                  {v.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-amber-400/90 font-medium font-mono">
                  {v.category}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Audit #{v.scanId}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
          <span>
            Page {page + 1} of {totalPages} ({totalElements} total)
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

      {/* Vulnerability Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedVuln.severity} />
                  {selectedVuln.cwe && (
                    <span className="text-xs font-mono text-stone-400 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      {selectedVuln.cwe}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-stone-100">{selectedVuln.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVuln(null)}
                className="p-1 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-bold text-stone-300 block mb-1">Description:</span>
                <p className="text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                  {selectedVuln.description}
                </p>
              </div>

              {selectedVuln.affectedUrl && (
                <div>
                  <span className="font-bold text-stone-300 block mb-1">Affected Endpoint:</span>
                  <div className="font-mono text-amber-400 bg-stone-950 p-2.5 rounded-xl border border-stone-800 break-all">
                    {selectedVuln.affectedUrl}
                  </div>
                </div>
              )}

              {selectedVuln.evidence && (
                <div>
                  <span className="font-bold text-stone-300 block mb-1">Observed Evidence:</span>
                  <pre className="font-mono text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800 whitespace-pre-wrap">
                    {selectedVuln.evidence}
                  </pre>
                </div>
              )}

              {selectedVuln.remediation && (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                  <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
                    <CheckCircle2 className="w-4 h-4" /> Recommended Remediation:
                  </span>
                  <p>{selectedVuln.remediation}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-800 text-xs">
              <Link
                to={`/scans/${selectedVuln.scanId}`}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                View Full Audit #{selectedVuln.scanId}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedVuln(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
