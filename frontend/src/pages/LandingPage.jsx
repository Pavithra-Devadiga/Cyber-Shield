import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Lock,
  Globe,
  Database,
  Code2,
  FileSearch,
  Sparkles,
  Zap,
  CheckCircle2,
  Terminal,
  Layers,
  Search,
  Activity,
  Check,
} from 'lucide-react';
import api from '../api/client';

export default function LandingPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuickAudit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      navigate('/dashboard');
      return;
    }

    let target = targetUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    try {
      setScanning(true);
      setError('');
      const res = await api.post('/scans', {
        targetUrl: target,
        scanType: 'FULL',
        modules: ['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE'],
      });

      if (res.data && res.data.data) {
        navigate(`/scans/${res.data.data.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate audit. Redirecting to workspace...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } finally {
      setScanning(false);
    }
  };

  const coreModules = [
    {
      num: '01',
      title: 'SSL / TLS Security',
      desc: 'Checks whether the website uses secure HTTPS, valid certificates, safe TLS 1.2/1.3 versions, and robust cipher suites.',
      icon: Lock,
      badge: 'Cryptographic Integrity',
    },
    {
      num: '02',
      title: 'Security Headers',
      desc: 'Checks whether important browser security headers are configured, such as CSP, HSTS, X-Frame-Options, and MIME-sniffing defense.',
      icon: Globe,
      badge: 'Browser Hardening',
    },
    {
      num: '03',
      title: 'SQL Injection Assessment',
      desc: 'Checks whether user inputs and parameters could allow attackers to interfere with underlying database queries via syntax anomaly probes.',
      icon: Database,
      badge: 'Database Protection',
    },
    {
      num: '04',
      title: 'Cross-Site Scripting (XSS)',
      desc: 'Checks whether malicious scripts could be injected through website inputs or reflected unencoded in HTML source or DOM sinks.',
      icon: Code2,
      badge: 'Client-Side Safety',
    },
    {
      num: '05',
      title: 'Endpoint Exposure',
      desc: 'Checks whether sensitive paths such as /.env or exposed Git repositories (/.git/HEAD) are publicly accessible.',
      icon: FileSearch,
      badge: 'Reconnaissance Defense',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sleek Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#091126]/90 backdrop-blur-md border-b border-blue-900/30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 shadow-lg shadow-blue-600/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
              Cyber<span className="text-sky-400">Shield</span>
            </span>
            <span className="block text-[10px] text-blue-300/60 font-semibold uppercase tracking-wider -mt-0.5">
              Summer Internship II
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs text-blue-300">
            <span className="font-semibold text-white">Pavithra</span>
            <span className="text-blue-400">&bull;</span>
            <span className="font-mono text-sky-400">U25UV24T064028</span>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 group"
          >
            <span>Enter Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Main Landing Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-10 lg:py-14 space-y-16">
        {/* =========================================================================
            HERO CARD (DIRECTLY INSPIRED BY PHOTO 2 WITH BLUE TONES)
           ========================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-blue-950/80 border border-blue-400/30">
          {/* Subtle geometric glowing cyber circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-300/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline, Attribution & CTA Button with Arrow */}
            <div className="lg:col-span-7 space-y-6">
              {/* Academic Capstone Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold tracking-wider uppercase text-blue-50">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                Cybersecurity Project &bull; Summer Internship II
              </div>

              {/* Bold Hero Headline (Inspired by Photo 2: "THE TAILOR IS IN") */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
                  The Security <br />
                  Auditor is In.
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed font-medium max-w-xl">
                  The ultimate non-destructive web application vulnerability assessment platform. Auditing live targets across 5 core security dimensions without destructive payloads.
                </p>
              </div>

              {/* Student Attribution Pill */}
              <div className="inline-flex flex-wrap items-center gap-3 p-3 px-4 rounded-2xl bg-blue-950/40 backdrop-blur-md border border-white/20 text-xs text-blue-100">
                <span>Developer: <strong className="text-white font-bold">Pavithra</strong></span>
                <span className="text-blue-300">&bull;</span>
                <span>Register No: <strong className="font-mono text-sky-200">U25UV24T064028</strong></span>
              </div>

              {/* =========================================================================
                  THE PROMINENT ARROW BUTTON -> TO CONTINUE TO THE ACTUAL WEBSITE
                 ========================================================================= */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-base shadow-2xl shadow-blue-950/40 hover:shadow-white/20 transition-all active:scale-95 group tracking-wide"
                  >
                    <span>LAUNCH SECURITY SCANNER</span>
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>

                  <Link
                    to="/scans"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-800/40 hover:bg-blue-800/60 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all"
                  >
                    <span>View Scan History</span>
                    <ArrowRight className="w-4 h-4 opacity-75" />
                  </Link>
                </div>

                {/* Quick URL Input on Landing */}
                <form onSubmit={handleQuickAudit} className="max-w-xl flex flex-col sm:flex-row gap-2.5 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-blue-200 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="Enter website URL (e.g. https://github.com)..."
                      className="w-full pl-11 pr-4 py-3 bg-blue-950/70 border border-white/20 rounded-xl text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/40 font-mono shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={scanning}
                    className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
                  >
                    {scanning ? (
                      <span>Auditing...</span>
                    ) : (
                      <>
                        <span>Scan Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
                {error && <p className="text-xs text-rose-200 font-medium">{error}</p>}
              </div>
            </div>

            {/* Right Column: Aesthetic Glassmorphism Telemetry Card (Zero Personal Photos) */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="p-7 rounded-3xl bg-blue-950/60 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-400/20 border border-sky-400/30 text-sky-300">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white tracking-wide">Live Audit Telemetry</div>
                      <div className="text-[10px] text-blue-200/70 font-mono">5 Non-Destructive Engines</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    OPERATIONAL
                  </span>
                </div>

                {/* 5 Engine Diagnostic Indicators */}
                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { name: 'SSL / TLS Verification', status: 'PASS', score: 'TLS 1.3 / 256-bit' },
                    { name: 'Security Headers Check', status: 'EVAL', score: 'HSTS / CSP / X-Frame' },
                    { name: 'SQL Injection Probes', status: 'SAFE', score: 'Input Boundary Logic' },
                    { name: 'XSS Reflection Analysis', status: 'SAFE', score: 'DOM Sink Sanitization' },
                    { name: 'Endpoint Exposure Audit', status: 'EVAL', score: '/.env & /.git Protection' },
                  ].map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-blue-900/40 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                        <span className="text-white text-[11px] font-sans font-semibold">{chk.name}</span>
                      </div>
                      <span className="text-[10px] text-sky-200 bg-blue-950/80 px-2 py-0.5 rounded border border-white/10">
                        {chk.score}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-blue-200/80">
                  <span>SSRF Safe Gateway</span>
                  <span className="font-bold text-white">Non-Destructive Testing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            THE 5 CORE FUNCTIONS (AESTHETIC ARCH CARDS)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Core Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                5 Active Vulnerability Assessment Modules
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Explore all modules in workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {coreModules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.num}
                  className="p-6 rounded-3xl bg-[#0d162e] border border-blue-900/40 hover:border-blue-500/50 hover:bg-[#101b38] transition-all flex flex-col justify-between space-y-4 group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-sky-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400/60">
                        {m.num}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                        {m.badge}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/scans/new"
                    className="pt-3 border-t border-blue-950/80 flex items-center justify-between text-xs font-semibold text-blue-300 group-hover:text-sky-400 transition-colors"
                  >
                    <span>Run test</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CALL TO ACTION BANNER (CONTINUE TO WEBSITE WITH ARROW)
           ========================================================================= */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#0c142b] border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              Ready to begin security evaluations?
            </h3>
            <p className="text-xs text-blue-300/70 max-w-xl leading-relaxed">
              Open the full vulnerability auditor with real-time audit history, severity breakdown charts, and executive PDF compliance report generation.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 group shrink-0"
          >
            <span>Continue to Actual Website</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-blue-950/60 py-8 px-6 bg-[#060b19] text-xs text-blue-300/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-white">CyberShield</span> &bull; Web Application Vulnerability Auditor &bull; Summer Internship II
          </div>
          <div>
            Candidate: <strong className="text-white">Pavithra</strong> &bull; USN: <span className="font-mono text-sky-400">U25UV24T064028</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
