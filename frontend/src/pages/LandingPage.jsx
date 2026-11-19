import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sleek Minimalist Top Header */}
      <header className="sticky top-0 z-50 bg-[#091126]/90 backdrop-blur-md border-b border-blue-900/30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 shadow-lg shadow-blue-600/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
              Cyber<span className="text-sky-400">Shield</span>
            </span>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-blue-200 hover:text-white hover:bg-blue-900/30 border border-blue-800/40 transition-colors"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Hero Viewport - Clean & Focused */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 lg:py-16 flex items-center">
        <section className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-blue-950/80 border border-blue-400/30">
          {/* Subtle glowing ambient lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-300/15 rounded-full blur-2xl pointer-events-none" />

          {/* Decorative Corner Watermark */}
          <div className="absolute top-8 right-8 hidden md:block opacity-20 pointer-events-none">
            <Shield className="w-48 h-48 stroke-1 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Big Project Name, Subtitle & Prominent Launch Button */}
            <div className="lg:col-span-7 space-y-6">
              {/* Project Name in Big Letters, Followed by "The security auditor is in." in Small Letters */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase text-white drop-shadow-sm">
                  CYBERSHIELD
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-sky-100 tracking-wide">
                  The security auditor is in.
                </p>
                <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-xl pt-2">
                  The ultimate non-destructive web application vulnerability assessment platform. Auditing live targets across 5 core security dimensions without destructive payloads.
                </p>
              </div>

              {/* Single Prominent CTA Button with Arrow -> */}
              <div className="pt-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-base shadow-2xl shadow-blue-950/40 hover:shadow-white/20 transition-all active:scale-95 group tracking-wide"
                >
                  <span>LAUNCH SECURITY SCANNER</span>
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Column: Aesthetic Glassmorphism Telemetry Card */}
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
      </main>

      {/* Aesthetic Academic Footer */}
      <footer className="border-t border-blue-950/60 py-6 px-6 sm:px-12 bg-[#060b19] text-xs text-blue-300/60 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-white">CyberShield</span> &bull; Web Application Vulnerability Auditor
          </div>
          <div>
            Candidate: <strong className="text-white">Pavithra</strong> &bull; USN: <span className="font-mono text-sky-400">U25UV24T064028</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
