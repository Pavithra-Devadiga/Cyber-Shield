import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  FileDown,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ChevronsUpDown,
  Sparkles,
} from 'lucide-react';

export default function ScanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVulns, setExpandedVulns] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const fetchScanDetails = async () => {
    try {
      const res = await api.get(`/scans/${id}`);
      if (res.data && res.data.data) {
        setScan(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load scan details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanDetails();
  }, [id]);

  useEffect(() => {
    if (!scan || (scan.status !== 'RUNNING' && scan.status !== 'QUEUED')) return;
    const interval = setInterval(fetchScanDetails, 3000);
    return () => clearInterval(interval);
  }, [scan?.status]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/reports/download/${id}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `security-audit-scan-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download PDF report', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = (text, identifier) => {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (vulnId) => {
    setExpandedVulns((prev) => {
      const next = new Set(prev);
      if (next.has(vulnId)) {
        next.delete(vulnId);
      } else {
        next.add(vulnId);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    const allFilteredIds = filteredVulns.map((v) => v.id);
    const allExpanded = allFilteredIds.every((id) => expandedVulns.has(id));
    if (allExpanded) {
      setExpandedVulns(new Set());
    } else {
      setExpandedVulns(new Set(allFilteredIds));
    }
  };

  const handleRerunAudit = () => {
    if (scan?.targetUrl) {
      navigate('/scans/new', { state: { targetUrl: scan.targetUrl, scanType: scan.scanType } });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-400" />
        <span className="text-blue-300/70 text-sm">Querying audit findings...</span>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="text-center py-20 bg-[#0d162e] rounded-2xl border border-blue-900/40 max-w-2xl mx-auto">
        <ShieldAlert className="w-12 h-12 text-blue-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Scan Record Not Found</h3>
        <p className="text-blue-300/60 text-sm mt-1">Unable to locate scan with ID #{id}.</p>
        <Link
          to="/scans"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Scan History
        </Link>
      </div>
    );
  }

  const vulnerabilities = scan.vulnerabilities || [];

  const counts = {
    ALL: vulnerabilities.length,
    CRITICAL: vulnerabilities.filter((v) => v.severity === 'CRITICAL').length,
    HIGH: vulnerabilities.filter((v) => v.severity === 'HIGH').length,
    MEDIUM: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
    LOW: vulnerabilities.filter((v) => v.severity === 'LOW').length,
    INFO: vulnerabilities.filter((v) => v.severity === 'INFO').length,
  };

  const filteredVulns = vulnerabilities.filter((v) => {
    const matchesSev = severityFilter === 'ALL' || v.severity === severityFilter;
    const matchesSearch =
      searchQuery === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cwe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const allFilteredExpanded =
    filteredVulns.length > 0 && filteredVulns.every((v) => expandedVulns.has(v.id));

  const getSeverityBorder = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-500';
      case 'HIGH':
        return 'border-l-4 border-l-orange-500';
      case 'MEDIUM':
        return 'border-l-4 border-l-amber-500';
      case 'LOW':
        return 'border-l-4 border-l-sky-500';
      default:
        return 'border-l-4 border-l-slate-500';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/scans"
            className="p-2.5 rounded-xl bg-[#0d162e] border border-blue-900/40 text-blue-300 hover:text-white hover:border-blue-700 transition-all shadow-sm"
            title="Back to Scans"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 bg-blue-600/15 px-2 py-0.5 rounded border border-blue-500/30">
                AUDIT #{scan.id}
              </span>
              <StatusBadge status={scan.status} />
              <span className="text-xs text-blue-300/60 font-mono hidden md:inline">
                {scan.scanType} PROFILE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <span className="break-all">{scan.targetUrl}</span>
              <a
                href={scan.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-sky-300 transition-colors shrink-0"
                title="Open Target in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRerunAudit}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0d162e] hover:bg-[#101b38] border border-blue-900/50 text-blue-200 text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            Re-run Audit
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading || scan.status !== 'COMPLETED'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 active:scale-95"
          >
            <FileDown className="w-4 h-4" />
            {downloading ? 'Compiling PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Primary Overview Cards (Spacious, Uncongested) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Posture Box */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
                Security Posture Score
              </span>
              <span className="text-[11px] font-mono text-sky-400 bg-blue-600/15 px-2 py-0.5 rounded border border-blue-500/30">
                100 pt Scale
              </span>
            </div>
            <div className="py-2">
              <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} />
            </div>
          </div>

          <div className="text-xs text-blue-300/70 border-t border-blue-950 pt-3.5 mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Scan Profile:</span>
              <span className="font-semibold text-white">{scan.scanType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Audit Duration:</span>
              <span className="font-semibold text-white">
                {scan.startTime && scan.endTime
                  ? `${Math.max(1, Math.round((new Date(scan.endTime) - new Date(scan.startTime)) / 1000))}s`
                  : 'In progress'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Findings:</span>
              <span className="font-semibold text-sky-400 font-mono">
                {vulnerabilities.length} issues detected
              </span>
            </div>
          </div>
        </div>

        {/* Engine Diagnostics */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 space-y-4 lg:col-span-2 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
                Audit Diagnostics & Protocol Telemetry
              </span>
              <span className="text-xs text-sky-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> 5 Core Engines Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#091126] border border-blue-950">
                <span className="text-[11px] text-blue-300/70 font-medium">Headers Inspected</span>
                <span className="text-xl font-bold text-white block mt-1">{scan.headersAnalyzed || 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#091126] border border-blue-950">
                <span className="text-[11px] text-blue-300/70 font-medium">Endpoints Tested</span>
                <span className="text-xl font-bold text-white block mt-1">{scan.endpointsTested || 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#091126] border border-blue-950">
                <span className="text-[11px] text-blue-300/70 font-medium">SSL / TLS Protocol</span>
                <span className="text-sm font-bold text-sky-400 block mt-1 truncate">
                  {scan.tlsVersion || (scan.sslValid ? 'Active TLS' : 'N/A')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#091126] border border-blue-950">
                <span className="text-[11px] text-blue-300/70 font-medium">SSL Valid</span>
                <span className="text-sm font-bold text-white block mt-1">
                  {scan.sslValid === true ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                    </span>
                  ) : scan.sslValid === false ? (
                    <span className="text-rose-400 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" /> Invalid / Plain
                    </span>
                  ) : (
                    'Pending'
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-950 text-xs text-blue-300/60 leading-relaxed">
            Multi-layer coverage: Cryptographic verification, HTTP Security Headers (CSP/HSTS), SQL Injection detection, Cross-Site Scripting (XSS), and Endpoint exposures.
          </div>
        </div>
      </div>

      {/* Vulnerabilities Table & Filter */}
      <div className="rounded-2xl bg-[#0d162e] border border-blue-900/40 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-blue-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Detected Vulnerabilities & Findings</h3>
              <p className="text-xs text-blue-300/60 mt-0.5">
                Showing {filteredVulns.length} of {vulnerabilities.length} findings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#091126] border border-blue-900/40 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
              >
                <ChevronsUpDown className="w-3.5 h-3.5 text-sky-400" />
                {allFilteredExpanded ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          {/* Severity Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-blue-300 hover:text-white'
              }`}
            >
              ALL <span className="opacity-80">({counts.ALL})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'CRITICAL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-rose-400 hover:bg-rose-950/30'
              }`}
            >
              CRITICAL <span className="opacity-80">({counts.CRITICAL})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('HIGH')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'HIGH'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-orange-400 hover:bg-orange-950/30'
              }`}
            >
              HIGH <span className="opacity-80">({counts.HIGH})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('MEDIUM')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'MEDIUM'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              MEDIUM <span className="opacity-80">({counts.MEDIUM})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('LOW')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'LOW'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-sky-400 hover:bg-sky-950/30'
              }`}
            >
              LOW <span className="opacity-80">({counts.LOW})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('INFO')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'INFO'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-[#091126] border border-blue-950 text-slate-400 hover:bg-slate-800'
              }`}
            >
              INFO <span className="opacity-80">({counts.INFO})</span>
            </button>

            <div className="relative ml-auto w-full sm:w-64 mt-2 sm:mt-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-blue-400/60" />
              <input
                type="text"
                placeholder="Search findings or CWE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#091126] border border-blue-900/60 text-xs text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div className="divide-y divide-blue-950/60">
          {filteredVulns.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm space-y-2">
              <ShieldAlert className="w-8 h-8 text-blue-500/40 mx-auto" />
              <p>No findings match your current filter criteria.</p>
              <button
                onClick={() => { setSeverityFilter('ALL'); setSearchQuery(''); }}
                className="text-xs text-sky-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredVulns.map((v) => {
              const isExpanded = expandedVulns.has(v.id);
              return (
                <div
                  key={v.id}
                  className={`p-6 transition-colors ${getSeverityBorder(v.severity)} hover:bg-blue-950/20`}
                >
                  <div
                    className="flex items-start justify-between gap-4 cursor-pointer select-none"
                    onClick={() => toggleExpand(v.id)}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <SeverityBadge severity={v.severity} />
                        <span className="font-bold text-white text-sm hover:text-sky-300 transition-colors">
                          {v.title}
                        </span>
                        {v.cwe && (
                          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-900/60 text-blue-300 font-mono text-[11px]">
                            {v.cwe}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-600/15 text-sky-300 text-[11px] font-medium border border-blue-500/30">
                          {v.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    <button
                      className="p-1 rounded-lg text-blue-400 hover:text-white transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-blue-950 space-y-4 text-xs">
                      {v.evidence && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-blue-200">Observed Evidence & Payload Response:</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(v.evidence, `ev-${v.id}`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#091126] border border-blue-900/60 text-[11px] text-blue-300 hover:text-white transition-colors"
                            >
                              {copiedId === `ev-${v.id}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 rounded-xl bg-[#091126] border border-blue-950 text-blue-200 font-mono overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                            {v.evidence}
                          </pre>
                        </div>
                      )}

                      {v.affectedUrl && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-blue-200">Affected Endpoint:</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(v.affectedUrl, `url-${v.id}`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#091126] border border-blue-900/60 text-[11px] text-blue-300 hover:text-white transition-colors"
                            >
                              {copiedId === `url-${v.id}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <span className="font-mono text-sky-400 bg-[#091126] px-3.5 py-2 rounded-xl border border-blue-950 block break-all text-xs">
                            {v.affectedUrl}
                          </span>
                        </div>
                      )}

                      {v.remediation && (
                        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200">
                          <span className="font-bold flex items-center gap-1.5 mb-1.5 text-sky-400 text-xs">
                            <CheckCircle2 className="w-4 h-4 shrink-0" /> Recommended Remediation Action:
                          </span>
                          <p className="leading-relaxed text-slate-300 text-xs">{v.remediation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
