import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  FileDown,
  ArrowLeft,
  Globe,
  ExternalLink,
  ShieldAlert,
  Server,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ChevronsUpDown,
  Layers,
  Clock,
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

  // Poll if scan is running
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
        <span className="text-slate-400 text-sm">Querying database audit records...</span>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Scan Record Not Found</h3>
        <p className="text-slate-400 text-sm mt-1">Unable to locate scan with ID #{id} in the database.</p>
        <Link
          to="/scans"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Scan History
        </Link>
      </div>
    );
  }

  const vulnerabilities = scan.vulnerabilities || [];

  // Severity counts
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
        return 'border-l-4 border-l-red-500 hover:border-slate-700';
      case 'HIGH':
        return 'border-l-4 border-l-orange-500 hover:border-slate-700';
      case 'MEDIUM':
        return 'border-l-4 border-l-amber-500 hover:border-slate-700';
      case 'LOW':
        return 'border-l-4 border-l-blue-500 hover:border-slate-700';
      default:
        return 'border-l-4 border-l-slate-500 hover:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/scans"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            title="Back to Scans"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                AUDIT #{scan.id}
              </span>
              <StatusBadge status={scan.status} />
              <span className="text-xs text-slate-500 font-mono hidden md:inline">
                {scan.scanType} PROFILE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <span className="break-all">{scan.targetUrl}</span>
              <a
                href={scan.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            Re-run Audit
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading || scan.status !== 'COMPLETED'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileDown className="w-4 h-4" />
            {downloading ? 'Compiling PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Primary Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Posture Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Posture Score
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100 pt Scale
              </span>
            </div>
            <div className="py-2">
              <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} />
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3.5 mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Scan Profile:</span>
              <span className="font-semibold text-slate-200">{scan.scanType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Audit Duration:</span>
              <span className="font-semibold text-slate-200">
                {scan.startTime && scan.endTime
                  ? `${Math.max(1, Math.round((new Date(scan.endTime) - new Date(scan.startTime)) / 1000))}s`
                  : 'In progress'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Findings:</span>
              <span className="font-semibold text-emerald-400 font-mono">
                {vulnerabilities.length} issues detected
              </span>
            </div>
          </div>
        </div>

        {/* Engine Diagnostics & Exposure Checks */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 lg:col-span-2 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Automated Audit Diagnostics
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Live Target Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Headers Inspected</span>
                <span className="text-xl font-bold text-white block mt-1">{scan.headersAnalyzed || 0}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Endpoints Tested</span>
                <span className="text-xl font-bold text-white block mt-1">{scan.endpointsTested || 0}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">SSL / TLS Protocol</span>
                <span className="text-sm font-bold text-emerald-400 block mt-1 truncate">
                  {scan.tlsVersion || (scan.sslValid ? 'Active TLS' : 'N/A')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">SSL Valid</span>
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

          {/* Identified Technologies */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-2">
              Fingerprinted Technologies & Web Servers:
            </span>
            {scan.technologiesFound ? (
              <div className="flex flex-wrap gap-2">
                {scan.technologiesFound.split(', ').map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800 flex items-center gap-1.5"
                  >
                    <Server className="w-3 h-3 text-emerald-400" />
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No technology signatures or banner headers detected.</span>
            )}
          </div>
        </div>
      </div>

      {/* Vulnerabilities Table & Filter */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        {/* Header & Search */}
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Detected Vulnerabilities & Audit Findings</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredVulns.length} of {vulnerabilities.length} findings
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <ChevronsUpDown className="w-3.5 h-3.5 text-emerald-400" />
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
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ALL <span className="opacity-80">({counts.ALL})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'CRITICAL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-rose-400 hover:bg-rose-950/30'
              }`}
            >
              CRITICAL <span className="opacity-80">({counts.CRITICAL})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('HIGH')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'HIGH'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-orange-400 hover:bg-orange-950/30'
              }`}
            >
              HIGH <span className="opacity-80">({counts.HIGH})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('MEDIUM')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'MEDIUM'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              MEDIUM <span className="opacity-80">({counts.MEDIUM})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('LOW')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'LOW'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-blue-400 hover:bg-blue-950/30'
              }`}
            >
              LOW <span className="opacity-80">({counts.LOW})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('INFO')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                severityFilter === 'INFO'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              INFO <span className="opacity-80">({counts.INFO})</span>
            </button>

            {/* Search Input */}
            <div className="relative ml-auto w-full sm:w-64 mt-2 sm:mt-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search findings, CWE, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div className="divide-y divide-slate-800/80">
          {filteredVulns.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No findings match your current search or severity filter.</p>
              <button
                onClick={() => { setSeverityFilter('ALL'); setSearchQuery(''); }}
                className="text-xs text-emerald-400 hover:underline"
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
                  className={`p-5 transition-colors ${getSeverityBorder(v.severity)}`}
                >
                  <div
                    className="flex items-start justify-between gap-4 cursor-pointer select-none"
                    onClick={() => toggleExpand(v.id)}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <SeverityBadge severity={v.severity} />
                        <span className="font-bold text-white text-sm hover:text-emerald-300 transition-colors">
                          {v.title}
                        </span>
                        {v.cwe && (
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono text-[11px] border border-slate-700/60">
                            {v.cwe}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                          {v.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    <button
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 text-xs">
                      {/* Observed Evidence */}
                      {v.evidence && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-slate-300 flex items-center gap-1.5">
                              Observed Evidence & Payload Response:
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(v.evidence, `ev-${v.id}`);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 hover:text-white transition-colors"
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
                          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                            {v.evidence}
                          </pre>
                        </div>
                      )}

                      {/* Affected URL */}
                      {v.affectedUrl && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-slate-300">Affected Target Endpoint:</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(v.affectedUrl, `url-${v.id}`);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 hover:text-white transition-colors"
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
                          <span className="font-mono text-emerald-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 block break-all text-xs">
                            {v.affectedUrl}
                          </span>
                        </div>
                      )}

                      {/* Remediation Action */}
                      {v.remediation && (
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                          <span className="font-bold flex items-center gap-1.5 mb-1.5 text-emerald-400 text-xs">
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
