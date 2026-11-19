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
  TrendingUp,
  Activity,
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
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      id: 'HEADERS',
      title: 'Security Headers',
      desc: 'Checks whether important browser security headers are configured, such as CSP, HSTS, and X-Frame-Options.',
      icon: Globe,
      accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'SQLI',
      title: 'SQL Injection Assessment',
      desc: 'Checks whether user inputs could allow attackers to interfere with underlying database queries.',
      icon: Database,
      accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'XSS',
      title: 'Cross-Site Scripting (XSS)',
      desc: 'Checks whether malicious scripts could be injected through website inputs or reflected unencoded.',
      icon: Code2,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'EXPOSURE',
      title: 'Endpoint Exposure',
      desc: 'Checks whether sensitive paths such as /.env or exposed Git files (/.git/HEAD) are publicly accessible.',
      icon: FileSearch,
      accent: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    },
  ];

  // Recharts severity data (shades of blue with standard severity signals)
  const severityData = [
    { name: 'Critical', count: metrics?.severityCounts?.CRITICAL || 0, color: '#ef4444' },
    { name: 'High', count: metrics?.severityCounts?.HIGH || 0, color: '#f97316' },
    { name: 'Medium', count: metrics?.severityCounts?.MEDIUM || 0, color: '#f59e0b' },
    { name: 'Low', count: metrics?.severityCounts?.LOW || 0, color: '#3b82f6' },
    { name: 'Info', count: metrics?.severityCounts?.INFO || 0, color: '#64748b' },
  ];

  const categoryData = metrics?.categoryCounts
    ? Object.entries(metrics.categoryCounts).map(([cat, count]) => ({
        name: cat.replace('_', ' '),
        value: count,
      }))
    : [];

  const PIE_COLORS = ['#2563eb', '#0ea5e9', '#38bdf8', '#6366f1', '#818cf8'];
  const hasScans = (metrics?.totalScans || 0) > 0;

  return (
    <div className="space-y-8">
      {/* =========================================================================
          SPACIOUS QUICK AUDIT HERO BAR (TONES OF BLUE)
         ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-8 sm:p-10 text-white shadow-2xl shadow-blue-950/50 border border-blue-400/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Live Security Audit Workspace
              </span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-900/40 border border-white/20 text-blue-100">
              5 Core Assessment Engines Active
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Launch Non-Destructive Vulnerability Audit
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Scan web applications for SSL/TLS misconfigurations, missing browser defense headers, SQL injection leaks, XSS DOM sinks, and sensitive endpoint exposures.
            </p>
          </div>

          <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-blue-200 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                placeholder="Enter target URL (e.g. https://github.com or https://example.com)..."
                className="w-full pl-11 pr-4 py-3 bg-blue-950/70 border border-white/25 rounded-xl text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-mono shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={quickScanType}
                onChange={(e) => setQuickScanType(e.target.value)}
                className="px-3.5 py-3 bg-blue-950/70 border border-white/25 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="FULL">Full Audit (5 Engines)</option>
                <option value="HEADERS_ONLY">Quick (Headers & SSL)</option>
              </select>

              <button
                type="submit"
                disabled={scanning || !quickUrl.trim()}
                className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 disabled:opacity-50 text-blue-900 font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <span>Run Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {quickError && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-100 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white mb-0.5">Target Verification Failed</strong>
                <span>{quickError}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SPACIOUS KPI METRIC CARDS (NO CONGESTION, NO DATABASE BOX)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Scans */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
              Audits Conducted
            </span>
            <div className="p-2.5 rounded-xl bg-blue-600/15 text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{metrics?.totalScans || 0}</span>
            <span className="text-xs text-blue-300/60">target scans</span>
          </div>
          <div className="text-xs text-sky-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            {metrics?.completedScans || 0} successfully analyzed
          </div>
        </div>

        {/* Security Posture Score */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
              Average Posture Score
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.averageSecurityScore != null ? metrics.averageSecurityScore : '—'}
            </span>
            <span className="text-xs text-blue-300/60">{metrics?.averageSecurityScore != null ? '/ 100' : 'no scans yet'}</span>
          </div>
          <div className="text-xs text-slate-400">
            {metrics?.averageSecurityScore != null ? 'Average score across scanned hosts' : 'Audit a target to calculate grade'}
          </div>
        </div>

        {/* Total Vulnerabilities Detected */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
              Vulnerabilities Identified
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{metrics?.totalVulnerabilities || 0}</span>
            <span className="text-xs text-blue-300/60">findings detected</span>
          </div>
          <div className="text-xs text-rose-400 font-medium">
            {metrics?.severityCounts?.CRITICAL || 0} critical &bull; {metrics?.severityCounts?.HIGH || 0} high
          </div>
        </div>

        {/* Active Analysis Engines */}
        <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
              Analysis Engines
            </span>
            <div className="p-2.5 rounded-xl bg-blue-600/15 text-sky-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-400">5 Modules</span>
          </div>
          <div className="text-xs text-slate-400">
            SSL &bull; Headers &bull; SQLi &bull; XSS &bull; Exposure
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE 5 ACTIVE SECURITY MODULES (SPACIOUS ARCH CARDS)
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Active Security Assessment Modules</h3>
            <p className="text-xs text-blue-300/60 mt-0.5">Comprehensive multi-layer evaluation framework</p>
          </div>
          <Link
            to="/scans/new"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
          >
            Configure Audit
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreEngines.map((engine) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                className="p-5 rounded-2xl bg-[#0d162e] border border-blue-900/40 hover:border-blue-500/50 hover:bg-[#101b38] transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${engine.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300 font-bold">
                      {engine.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {engine.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                    {engine.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          VISUAL CHARTS OR EMPTY STATE (SPACIOUS & CLEAN)
         ========================================================================= */}
      {!hasScans ? (
        <div className="p-10 rounded-3xl bg-[#0d162e]/60 border border-blue-900/40 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-sky-400 mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Ready for Target Security Audits</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            All metrics, grades, and vulnerability charts are generated organically from live scan telemetry. Enter a target website URL in the search bar above to begin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Severity Bar Chart */}
          <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Vulnerability Findings by Severity</h3>
                <p className="text-xs text-blue-300/60 mt-0.5">Real-time counts categorized by severity</p>
              </div>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#162347" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#091126', borderColor: '#1e3a8a', borderRadius: '0.75rem', color: '#f8fafc' }}
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

          {/* Category Pie Chart */}
          <div className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Findings by Vulnerability Category</h3>
                <p className="text-xs text-blue-300/60 mt-0.5">Classification according to CWE guidelines</p>
              </div>
              <Layers className="w-4 h-4 text-sky-400" />
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
                      contentStyle={{ backgroundColor: '#091126', borderColor: '#1e3a8a', borderRadius: '0.75rem', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
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

      {/* =========================================================================
          RECENT AUDIT LOG TABLE (SPACIOUS & COMFORTABLE)
         ========================================================================= */}
      <div className="rounded-2xl bg-[#0d162e] border border-blue-900/40 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-blue-950 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Recent Target URL Audits</h3>
            <p className="text-xs text-blue-300/60 mt-0.5">Evaluations and security posture grades</p>
          </div>
          <Link
            to="/scans"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            View All Scans
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#091126] text-blue-300/70 text-xs uppercase tracking-wider font-semibold border-b border-blue-950">
              <tr>
                <th className="py-4 px-6">Target URL</th>
                <th className="py-4 px-6">Scan Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Score & Grade</th>
                <th className="py-4 px-6">Findings</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-slate-200">
              {metrics?.recentScans && metrics.recentScans.length > 0 ? (
                metrics.recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-blue-950/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{scan.targetUrl}</span>
                        <a
                          href={scan.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-sky-400"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-blue-300/70 font-mono">
                      {scan.scanType}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="py-4 px-6">
                      <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-900/50 text-blue-200 text-xs font-semibold">
                        {scan.vulnerabilityCount} findings
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/scans/${scan.id}`}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-1"
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
                    <Shield className="w-6 h-6 text-blue-500/40 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No audits recorded yet</p>
                    <p className="text-xs text-slate-500">Run an audit above to populate the recent scan table.</p>
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
