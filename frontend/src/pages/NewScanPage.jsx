import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import {
  Play,
  CheckSquare,
  Square,
  AlertTriangle,
  Globe,
  Lock,
  Database,
  Code2,
  FileSearch,
  Sliders,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

export default function NewScanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [targetUrl, setTargetUrl] = useState(location.state?.targetUrl || '');
  const [scanType, setScanType] = useState(location.state?.scanType || 'FULL');
  const [selectedModules, setSelectedModules] = useState([
    'SSL',
    'HEADERS',
    'SQLI',
    'XSS',
    'EXPOSURE',
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableModules = [
    {
      id: 'SSL',
      name: 'SSL / TLS Security',
      friendlyName: 'HTTPS Encryption & SSL',
      desc: 'Checks whether the website uses secure HTTPS, valid certificates, safe TLS versions & robust ciphers.',
      icon: Lock,
    },
    {
      id: 'HEADERS',
      name: 'Security Headers',
      friendlyName: 'Browser Defense Headers',
      desc: 'Checks whether important browser security headers are configured, such as CSP, HSTS, and X-Frame-Options.',
      icon: Globe,
    },
    {
      id: 'SQLI',
      name: 'SQL Injection Assessment',
      friendlyName: 'Database Query Protection',
      desc: 'Checks whether user inputs could allow attackers to interfere with underlying database queries.',
      icon: Database,
    },
    {
      id: 'XSS',
      name: 'Cross-Site Scripting (XSS)',
      friendlyName: 'Script Injection Defense',
      desc: 'Checks whether malicious scripts could be injected through website inputs or reflected unencoded.',
      icon: Code2,
    },
    {
      id: 'EXPOSURE',
      name: 'Endpoint Exposure',
      friendlyName: 'Confidential File Protection',
      desc: 'Checks whether sensitive paths such as /.env or exposed Git files (/.git/HEAD) are publicly accessible.',
      icon: FileSearch,
    },
  ];

  const presets = [
    {
      id: 'FULL',
      title: 'Full Audit',
      badge: 'Recommended',
      desc: 'All 5 core active modules for comprehensive vulnerability assessment',
      modules: ['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE'],
    },
    {
      id: 'QUICK',
      title: 'Quick Scan',
      badge: 'Fast',
      desc: 'SSL/TLS encryption and essential HTTP security headers',
      modules: ['SSL', 'HEADERS'],
    },
    {
      id: 'HEADERS_ONLY',
      title: 'Headers Only',
      badge: 'Focused',
      desc: 'HSTS, CSP, X-Frame-Options, and browser protection policies',
      modules: ['HEADERS'],
    },
    {
      id: 'SSL_ONLY',
      title: 'SSL / TLS Only',
      badge: 'Crypto',
      desc: 'Certificates, cipher suites, and cryptographic protocols',
      modules: ['SSL'],
    },
  ];

  const handleScanTypeChange = (type) => {
    setScanType(type);
    const preset = presets.find((p) => p.id === type);
    if (preset) {
      setSelectedModules(preset.modules);
    }
  };

  const toggleModule = (id) => {
    setScanType('CUSTOM');
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter((m) => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleSelectAllModules = () => {
    setScanType('FULL');
    setSelectedModules(['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE']);
  };

  const handleResetDefault = () => {
    setScanType('FULL');
    setSelectedModules(['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE']);
  };

  const handleQuickUrlSelect = (url) => {
    setTargetUrl(url);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setError('Please provide a target domain or website URL.');
      return;
    }

    let normalized = targetUrl.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        targetUrl: normalized,
        scanType: scanType,
        modules: selectedModules.length > 0 ? selectedModules : ['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE'],
      };

      const res = await api.post('/scans', payload);
      if (res.data && res.data.data) {
        navigate(`/scans/${res.data.data.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to initiate vulnerability scan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          New Security Audit
        </h2>
        <p className="text-blue-300/70 text-sm mt-1">
          Evaluate any live web application or domain across 5 non-destructive security vectors.
        </p>
      </div>

      {/* Target Resolution / Error Banner */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-100 text-sm flex items-start gap-3.5 shadow-xl">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-white text-base">Target Verification Notice</strong>
            <p className="text-rose-200/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================================================================
            PRIMARY CARD: TARGET INPUT & FRIENDLY SUMMARY
           ========================================================================= */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0d162e] border border-blue-900/40 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="block text-base font-bold text-white">
              Target Website or Domain
            </label>
            <p className="text-xs text-blue-300/60 leading-relaxed">
              Enter any publicly accessible website. Our scanner resolves canonical redirects and conducts non-invasive checks safely.
            </p>
          </div>

          <div className="relative">
            <Globe className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. google.com or https://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#091126] border border-blue-900/60 rounded-2xl text-base text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono shadow-inner transition-all"
            />
          </div>

          {/* Quick Target Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-blue-300/60 font-semibold">Quick suggestions:</span>
            {[
              'google.com',
              'github.com',
              'testphp.vulnweb.com',
            ].map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => handleQuickUrlSelect(chip)}
                className="px-3 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 text-sky-300 hover:text-white transition-all font-mono"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            COLLAPSIBLE ACCORDION: ADVANCED AUDIT OPTIONS (CUSTOMIZE ENGINES & PRESETS)
            (Hidden by default so normal users are not overwhelmed or confused)
           ========================================================================= */}
        <div className="rounded-3xl bg-[#0d162e] border border-blue-900/40 overflow-hidden shadow-xl transition-all">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-blue-950/30 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">
                  Customize Audit Engines & Profiles
                </span>
                <span className="text-xs text-blue-300/60">
                  Optional advanced settings for examiners and customized testing
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-950 border border-blue-800/40 text-sky-300 font-semibold hidden sm:inline-block">
                {selectedModules.length} of {availableModules.length} Active
              </span>
              <div className="p-1.5 rounded-lg bg-blue-950 border border-blue-800/40 text-blue-300">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAdvanced ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {showAdvanced && (
            <div className="p-6 sm:p-7 pt-2 border-t border-blue-900/40 space-y-6 bg-[#0a1226]">
              {/* Presets Subsection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-300">
                    Audit Profile Presets
                  </label>
                  <span className="text-[11px] text-blue-300/60">Click a preset to auto-select engines</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {presets.map((preset) => {
                    const isSelected = scanType === preset.id;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => handleScanTypeChange(preset.id)}
                        className={`p-4 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-600/10'
                            : 'bg-[#091126] border-blue-950 text-blue-300/70 hover:text-white hover:border-blue-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{preset.title}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-300'
                          }`}>
                            {preset.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-300/60 leading-relaxed">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Modules Configuration Subsection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-300">
                      Active Assessment Engines ({selectedModules.length} of {availableModules.length})
                    </label>
                    <span className="text-[11px] text-blue-300/60">Toggle individual checks for targeted audits</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllModules}
                      className="text-xs px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800/40 text-sky-300 font-semibold transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDefault}
                      className="text-xs px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800/40 text-blue-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {availableModules.map((m) => {
                    const active = selectedModules.includes(m.id);
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleModule(m.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          active
                            ? 'bg-blue-950/40 border-blue-500/40 text-white'
                            : 'bg-[#091126]/60 border-blue-950 text-blue-300/60 hover:border-blue-900'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            active
                              ? 'bg-blue-600/20 border-blue-500/30 text-sky-400'
                              : 'bg-blue-950/40 border-blue-900/40 text-blue-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-white">
                                {m.name}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300">
                                {m.id}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                              {m.desc}
                            </span>
                          </div>
                        </div>

                        <div className="text-sky-400 shrink-0">
                          {active ? (
                            <CheckSquare className="w-5 h-5 text-sky-400" />
                          ) : (
                            <Square className="w-5 h-5 text-blue-300/40" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            PRIMARY SUBMIT BUTTON
           ========================================================================= */}
        <button
          type="submit"
          disabled={loading || selectedModules.length === 0}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 active:scale-98"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Initializing Live Security Audit...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Comprehensive Security Audit</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
