import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Globe,
  Database,
  Code2,
  FileSearch,
  Search,
  Zap,
  Layers,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  GraduationCap,
  Sparkles,
  User,
  Hash,
  CheckCircle2,
  TrendingUp,
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
          : ['HEADERS', 'SSL', 'SQLI', 'XSS', 'EXPOSURE'],
      });

      if (res.data && res.data.data) {
        navigate(`/scans/${res.data.data.id}`);
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || 'Failed to start scan. Ensure URL is valid and accessible.');
    } finally {
      setScanning(false);
    }
  };

  const coreEngines = [
    {
      id: 'SSL',
      title: 'SSL / TLS Security',
      desc: 'Checks whether the website uses secure HTTPS, valid certificates, safe TLS versions & robust ciphers.',
      icon: Lock,
      color: 'amber',
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'HEADERS',
      title: 'Security Headers',
      desc: 'Checks whether important browser security headers are configured, such as CSP, HSTS, and X-Frame-Options.',
      icon: Globe,
      color: 'yellow',
      accent: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    },
    {
      id: 'SQLI',
      title: 'SQL Injection Assessment',
      desc: 'Checks whether user inputs could allow attackers to interfere with underlying database queries.',
      icon: Database,
      color: 'orange',
      accent: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
    {
      id: 'XSS',
      title: 'Cross-Site Scripting (XSS)',
      desc: 'Checks whether malicious scripts could be injected through website inputs or reflected unencoded.',
      icon: Code2,
      color: 'rose',
      accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      id: 'EXPOSURE',
      title: 'Endpoint Exposure',
      desc: 'Checks whether sensitive paths such as /.env or exposed Git files (/.git/HEAD) are publicly accessible.',
      icon: FileSearch,
      color: 'amber',
      accent: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    },
  ];

  // Recharts severity data (warm stone palette)
  const severityData = [
    { name: 'Critical', count: metrics?.severityCounts?.CRITICAL || 0, color: '#ef4444' },
    { name: 'High', count: metrics?.severityCounts?.HIGH || 0, color: '#f97316' },
    { name: 'Medium', count: metrics?.severityCounts?.MEDIUM || 0, color: '#f59e0b' },
    { name: 'Low', count: metrics?.severityCounts?.LOW || 0, color: '#eab308' },
    { name: 'Info', count: metrics?.severityCounts?.INFO || 0, color: '#78716c' },
  ];

  // Category data for Pie chart
  const categoryData = metrics?.categoryCounts
    ? Object.entries(metrics.categoryCounts).map(([cat, count]) => ({
        name: cat.replace('_', ' '),
        value: count,
      }))
    : [];

  const PIE_COLORS = ['#f59e0b', '#d97706', '#b45309', '#ea580c', '#e11d48'];
  const hasScans = (metrics?.totalScans || 0) > 0;

  return (
    <div className="space-y-10">
      {/* =========================================================================
          CREATIVE & AESTHETIC ACADEMIC HERO & PROJECT LANDING BANNER
         ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/30 border border-stone-800 p-8 sm:p-10 shadow-2xl shadow-stone-950/80">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Academic Tag */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              Cybersecurity Project &bull; Summer Internship II
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700/80 text-stone-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              5 Core Security Engines Active
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
              Automated Vulnerability & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">
                Threat Assessment Engine
              </span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Non-destructive web vulnerability audit platform performing real-time cryptographic verification, HTTP security header evaluations, benign SQLi/XSS anomaly probes, and sensitive endpoint exposure analysis.
            </p>
          </div>

          {/* Student & Project Metadata Badge */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/90 flex flex-wrap items-center justify-between gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Project Developer
                </span>
                <span className="text-sm font-bold text-stone-100">
                  Pavithra
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-stone-800 pl-4">
              <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-amber-300 font-bold text-sm">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Register / USN No.
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  U25UV24T064028
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-300 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>JPA Database Connected</span>
            </div>
          </div>

          {/* =========================================================================
              QUICK AUDIT SEARCH BAR
             ========================================================================= */}
          <div className="pt-2">
            <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="Enter target website URL (e.g. https://github.com or https://example.com)..."
                  className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quickScanType}
                  onChange={(e) => setQuickScanType(e.target.value)}
                  className="px-3.5 py-3 bg-stone-950 border border-stone-700 rounded-xl text-xs font-semibold text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="FULL">Full Audit (5 Engines)</option>
                  <option value="HEADERS_ONLY">Quick (Headers & SSL)</option>
                </select>

                <button
                  type="submit"
                  disabled={scanning || !quickUrl.trim()}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  {scanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
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
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {quickError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 5 CORE SECURITY FUNCTIONS SHOWCASE
         ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">
              5 Core Security Modules
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Targeted non-destructive security evaluation engines
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            Active Security Scope
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreEngines.map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all space-y-3 group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${engine.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-stone-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                    {engine.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mt-1.5">
                    {engine.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Engine ID:</span>
                  <span className="font-mono text-amber-400 font-semibold">{engine.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC DATABASE KPI CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Scans Run</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-100">{metrics?.totalScans || 0}</span>
            <span className="text-xs text-stone-400">in database</span>
          </div>
          <div className="mt-2 text-xs text-amber-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {metrics?.completedScans || 0} completed successfully
          </div>
        </div>

        {/* Security Score */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Average Posture Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-100">
              {metrics?.averageSecurityScore != null ? metrics.averageSecurityScore : '—'}
            </span>
            <span className="text-xs text-stone-400">{metrics?.averageSecurityScore != null ? '/ 100' : 'no audits yet'}</span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            {metrics?.averageSecurityScore != null ? 'Average score across audited URLs' : 'Audit a URL to compute score'}
          </div>
        </div>

        {/* Vulnerabilities Detected */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Findings</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-100">{metrics?.totalVulnerabilities || 0}</span>
            <span className="text-xs text-stone-400">detected</span>
          </div>
          <div className="mt-2 text-xs text-rose-400 font-medium">
            {metrics?.severityCounts?.CRITICAL || 0} critical &bull; {metrics?.severityCounts?.HIGH || 0} high
          </div>
        </div>

        {/* Live Database Engine */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Database Engine</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">Connected</span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            PostgreSQL / H2 JPA Persistence Active
          </div>
        </div>
      </div>

      {/* =========================================================================
          ZERO SCANS ONBOARDING OR VISUAL RECHARTS
         ========================================================================= */}
      {!hasScans ? (
        <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-100">Ready for Live Target Audits</h3>
          <p className="text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
            All mock data has been removed. Every metric, grade, and finding chart will be dynamically populated directly from your live scan results. Enter any target URL in the audit bar above to begin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Bar Chart */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-stone-100 text-base">Vulnerability Findings by Severity</h3>
                <p className="text-xs text-stone-400 mt-0.5">Real-time counts stored in database</p>
              </div>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                  <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={12} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '0.75rem', color: '#f5f5f4' }}
                    itemStyle={{ color: '#f5f5f4', fontWeight: 600 }}
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

          {/* Category Pie Chart */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-stone-100 text-base">Findings by Vulnerability Category</h3>
                <p className="text-xs text-stone-400 mt-0.5">Classification according to CWE guidelines</p>
              </div>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="h-64 flex items-center justify-center">
              {categoryData.length === 0 ? (
                <div className="text-sm text-stone-400">No category findings recorded yet</div>
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
                      contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '0.75rem' }}
                      itemStyle={{ color: '#f5f5f4', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RECENT AUDIT LOG TABLE
         ========================================================================= */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-100 text-base">Recent Target URL Audits</h3>
            <p className="text-xs text-stone-400 mt-0.5">Persisted in database with timestamps and grades</p>
          </div>
          <Link
            to="/scans"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            View All Scans
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-950/70 text-stone-400 text-xs uppercase tracking-wider font-semibold border-b border-stone-800">
              <tr>
                <th className="py-3.5 px-6">Target URL</th>
                <th className="py-3.5 px-6">Scan Type</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Score & Grade</th>
                <th className="py-3.5 px-6">Findings</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-200">
              {metrics?.recentScans && metrics.recentScans.length > 0 ? (
                metrics.recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-stone-800/30 transition-colors">
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
                      <span className="px-2.5 py-1 rounded-lg bg-stone-950 text-stone-300 text-xs font-semibold border border-stone-800">
                        {scan.vulnerabilityCount} findings
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/scans/${scan.id}`}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1"
                      >
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400 text-sm space-y-2">
                    <Database className="w-6 h-6 text-stone-500 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-stone-300">No scans recorded in database yet</p>
                    <p className="text-xs text-stone-400">Run your first live audit above to populate the scan log.</p>
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
