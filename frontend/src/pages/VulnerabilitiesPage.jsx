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
  ArrowRight,
  Shield,
  Layers,
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Vulnerabilities Catalog</h2>
          <p className="text-blue-300/70 text-sm mt-1">
            Aggregated findings, exploit mechanics analysis, and specific remediation advisories.
          </p>
        </div>
        <div className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#0d162e] border border-blue-900/50 text-blue-200">
          Total Findings: <strong className="text-sky-400 font-mono text-sm ml-1">{totalElements}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0d162e] border border-blue-900/40 flex flex-wrap items-center gap-3 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-300/60" />
          <input
            type="text"
            placeholder="Search by title, description or CWE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#091126] border border-blue-900/60 rounded-xl text-sm text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono shadow-inner"
          />
        </form>

        <select
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); setPage(0); }}
          className="px-3.5 py-2 bg-[#091126] border border-blue-900/60 rounded-xl text-xs font-semibold text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
          className="px-3.5 py-2 bg-[#091126] border border-blue-900/60 rounded-xl text-xs font-semibold text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">All Categories (5 Engines)</option>
          <option value="SSL_TLS">SSL / TLS</option>
          <option value="SECURITY_HEADERS">Security Headers</option>
          <option value="SQL_INJECTION">SQL Injection</option>
          <option value="XSS">Cross-Site Scripting (XSS)</option>
          <option value="ENDPOINT_EXPOSURE">Endpoint Exposure</option>
        </select>
      </div>

      {/* Findings Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
        </div>
      ) : vulns.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#0d162e] border border-blue-900/40 text-slate-400 text-sm space-y-2">
          <Shield className="w-8 h-8 text-blue-500/40 mx-auto" />
          <p className="font-semibold text-white">No vulnerabilities found</p>
          <p className="text-xs text-blue-300/60">No security issues match your current filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vulns.map((vuln) => (
            <div
              key={vuln.id}
              onClick={() => setSelectedVuln(vuln)}
              className="p-5 rounded-2xl bg-[#0d162e] border border-blue-900/40 hover:border-blue-500/50 hover:bg-[#101b38] transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <SeverityBadge severity={vuln.severity} />
                  {vuln.cwe && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800/40 text-sky-300">
                      {vuln.cwe}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {vuln.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {vuln.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-950 flex items-center justify-between text-xs text-blue-300/70">
                <span className="font-mono text-[11px] truncate max-w-[140px]">
                  {vuln.category?.replace('_', ' ')}
                </span>
                <span className="text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-[#0d162e] border border-blue-900/40 flex items-center justify-between text-xs text-blue-300/70 shadow-xl">
          <span>
            Page {page + 1} of {totalPages} ({totalElements} total findings)
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

      {/* Modal Detail Flyout */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d162e] border border-blue-900/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVuln(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-blue-950 border border-blue-900/60 text-blue-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={selectedVuln.severity} size="lg" />
                {selectedVuln.cwe && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-950 border border-blue-800/40 text-sky-300">
                    {selectedVuln.cwe}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedVuln.title}</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-[#091126] border border-blue-950 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300/60 block">
                  Description & Impact
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">{selectedVuln.description}</p>
              </div>

              {selectedVuln.evidence && (
                <div className="p-4 rounded-xl bg-[#091126] border border-blue-950 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300/60 block">
                    Telemetry / Observed Evidence
                  </span>
                  <pre className="font-mono text-xs text-sky-300 bg-blue-950/60 p-3 rounded-lg overflow-x-auto border border-blue-900/40 whitespace-pre-wrap">
                    {selectedVuln.evidence}
                  </pre>
                </div>
              )}

              {selectedVuln.remediation && (
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Remediation Guidance
                  </span>
                  <p className="text-blue-100 leading-relaxed text-xs">{selectedVuln.remediation}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-950">
              <button
                onClick={() => setSelectedVuln(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
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
