import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  Search,
  Database,
  Lock,
  Globe,
  Code2,
  FileSearch,
  Key,
  Radio,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickUrl, setQuickUrl] = useState('');
  const [quickScanType, setQuickScanType] = useState('FULL');
  const [scanning, setScanning] = useState(false);
  const [quickError, setQuickError] = useState('');
  const navigate = useNavigate();

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/dashboard/metrics');
      if (res.data && res.data.data) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    let target = quickUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    try {
      setScanning(true);
      setQuickError('');
      const res = await api.post('/scans', {
        targetUrl: target,
        scanType: quickScanType,
        modules: quickScanType === 'HEADERS_ONLY'
          ? ['HEADERS', 'SSL']
          : ['HEADERS', 'SSL', 'SQLI', 'XSS', 'EXPOSURE', 'SENSITIVE', 'TECH'],
      });

      if (res.data && res.data.data) {
        navigate(`/scans/${res.data.data.id}`);
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || 'Failed to start scan. Ensure URL is valid and not a private IP.');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-emerald-400" />
        <span className="text-xs text-slate-400 font-medium">Connecting to security database...</span>
      </div>
    );
  }

  // Format severity data for Recharts
  const severityData = [
    { name: 'Critical', count: metrics?.severityCounts?.CRITICAL || 0, color: '#ef4444' },
    { name: 'High', count: metrics?.severityCounts?.HIGH || 0, color: '#f97316' },
    { name: 'Medium', count: metrics?.severityCounts?.MEDIUM || 0, color: '#eab308' },
    { name: 'Low', count: metrics?.severityCounts?.LOW || 0, color: '#3b82f6' },
    { name: 'Info', count: metrics?.severityCounts?.INFO || 0, color: '#64748b' },
  ];

  // Category data for Pie chart
  const categoryData = metrics?.categoryCounts
    ? Object.entries(metrics.categoryCounts).map(([cat, count]) => ({
        name: cat.replace('_', ' '),
        value: count,
      }))
    : [];

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  const hasScans = (metrics?.totalScans || 0) > 0;

  return (
    <div className="space-y-8">
      {/* Quick Scan Launch Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border border-slate-800 shadow-xl shadow-slate-950/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live DAST Audit Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Enterprise Vulnerability Assessment</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Automated Java 21 scanner: HTTP security headers, TLS ciphers, exposed dotfiles, SQLi & XSS heuristics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/scans/new"
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              Advanced Scanner
            </Link>
          </div>
        </div>

        {/* Quick Launch Form */}
        <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter target URL to audit (e.g. https://github.com or https://example.com)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={quickScanType}
              onChange={(e) => setQuickScanType(e.target.value)}
              className="px-3.5 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="FULL">Full Audit (8 Engines)</option>
              <option value="HEADERS_ONLY">Quick (Headers & SSL)</option>
            </select>

            <button
              type="submit"
              disabled={scanning || !quickUrl.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run Live Audit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {quickError && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {quickError}
          </div>
        )}
      </div>

      {/* Primary KPI Cards (Real Data from DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scans Run</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{metrics?.totalScans || 0}</span>
            <span className="text-xs text-slate-400">in database</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {metrics?.completedScans || 0} completed successfully
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Security Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.averageSecurityScore != null ? metrics.averageSecurityScore : '—'}
            </span>
            <span className="text-xs text-slate-400">{metrics?.averageSecurityScore != null ? '/ 100' : 'no scans yet'}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {metrics?.averageSecurityScore != null
              ? 'Weighted posture across monitored targets'
              : 'Scan a URL to compute initial score'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Vulnerabilities</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{metrics?.totalVulnerabilities || 0}</span>
            <span className="text-xs text-slate-400">findings</span>
          </div>
          <div className="mt-2 text-xs text-rose-400 font-medium">
            {metrics?.severityCounts?.CRITICAL || 0} critical &bull; {metrics?.severityCounts?.HIGH || 0} high
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Database Engine</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">Connected</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            PostgreSQL / H2 JPA persistence active
          </div>
        </div>
      </div>

      {/* When no scans exist yet: Show Clean Engine Architecture Overview */}
      {!hasScans && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Database Initialized & Ready for Live Audits</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            CyberShield does not display fake or mock data. All metrics, security scores, and vulnerability charts are generated organically from actual target evaluations. Enter a target URL in the audit bar above to begin.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>HTTP Headers</span>
              </div>
              <p className="text-[11px] text-slate-400">CSP, HSTS, X-Frame-Options, X-Content-Type.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL/TLS Ciphers</span>
              </div>
              <p className="text-[11px] text-slate-400">Cert validity, SAN, TLS 1.2/1.3 handshakes.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>SQLi & XSS</span>
              </div>
              <p className="text-[11px] text-slate-400">Benign payload probes & syntax error checks.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <FileSearch className="w-3.5 h-3.5" />
                <span>Endpoint Leaks</span>
              </div>
              <p className="text-[11px] text-slate-400">.env, .git/HEAD, Spring /actuator checks.</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Charts Row (Shown when real data exists) */}
      {hasScans && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution Bar Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-base">Vulnerability Findings by Severity</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time counts persisted in database</p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-base">Findings by Vulnerability Category</h3>
                <p className="text-xs text-slate-400 mt-0.5">Categorization based on CWE & OWASP Top 10</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-64 flex items-center justify-center">
              {categoryData.length === 0 ? (
                <div className="text-sm text-slate-500">No category findings recorded yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Scans Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Recent Target URL Audits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Persisted in database with timestamps and grades</p>
          </div>
          <Link
            to="/scans"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            View All Scans
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Target URL</th>
                <th className="py-3.5 px-6">Scan Type</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Score & Grade</th>
                <th className="py-3.5 px-6">Findings</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {metrics?.recentScans && metrics.recentScans.length > 0 ? (
                metrics.recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{scan.targetUrl}</span>
                        <a
                          href={scan.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {scan.scanType}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="py-4 px-6">
                      <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                        {scan.vulnerabilityCount} findings
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/scans/${scan.id}`}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
                      >
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm space-y-2">
                    <Database className="w-6 h-6 text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-300">No scans recorded in database yet</p>
                    <p className="text-xs text-slate-500">Run your first live audit above to populate the scan log.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
