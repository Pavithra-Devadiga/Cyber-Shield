import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import {
  ShieldAlert,
  Play,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  ShieldCheck,
  Globe,
  Sliders,
  Lock,
  Database,
  Code2,
  FileSearch,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableModules = [
    {
      id: 'SSL',
      name: 'SSL/TLS Security',
      desc: 'Checks whether the website uses secure HTTPS, valid certificates and safe TLS versions.',
      icon: Lock,
    },
    {
      id: 'HEADERS',
      name: 'Security Headers',
      desc: 'Checks whether important browser security headers are configured, such as CSP and HSTS.',
      icon: Globe,
    },
    {
      id: 'SQLI',
      name: 'SQL Injection Assessment',
      desc: 'Checks whether user inputs could allow attackers to interfere with database queries.',
      icon: Database,
    },
    {
      id: 'XSS',
      name: 'Cross-Site Scripting (XSS)',
      desc: 'Checks whether malicious scripts could be injected through website inputs.',
      icon: Code2,
    },
    {
      id: 'EXPOSURE',
      name: 'Endpoint Exposure',
      desc: 'Checks whether sensitive paths such as .env or exposed Git files are publicly accessible.',
      icon: FileSearch,
    },
  ];

  const handleScanTypeChange = (type) => {
    setScanType(type);
    if (type === 'QUICK') {
      setSelectedModules(['SSL', 'HEADERS']);
    } else if (type === 'FULL') {
      setSelectedModules(['SSL', 'HEADERS', 'SQLI', 'XSS', 'EXPOSURE']);
    } else if (type === 'HEADERS_ONLY') {
      setSelectedModules(['HEADERS']);
    } else if (type === 'SSL_ONLY') {
      setSelectedModules(['SSL']);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setError('Please provide a valid target URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        targetUrl: targetUrl.trim(),
        scanType: scanType,
        modules: selectedModules,
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
      <div>
        <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Launch Vulnerability Audit</h2>
        <p className="text-stone-400 text-sm mt-1">
          Perform non-destructive web security testing across 5 targeted audit modules.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target URL */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 shadow-xl">
          <label className="block text-sm font-bold text-stone-100">
            Target Domain or Application URL
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="https://example.com or http://testphp.vulnweb.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono shadow-inner"
            />
          </div>
          <p className="text-xs text-stone-400">
            Internal network addresses (RFC 1918) and cloud metadata services are blocked by SSRF protection.
          </p>
        </div>

        {/* Scan Profile Selection */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 shadow-xl">
          <label className="block text-sm font-bold text-stone-100">
            Audit Profile Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'FULL', title: 'Full Audit', desc: 'All 5 core active modules' },
              { id: 'QUICK', title: 'Quick Scan', desc: 'SSL/TLS + HTTP Headers' },
              { id: 'HEADERS_ONLY', title: 'Headers Only', desc: 'HSTS, CSP, X-Frame' },
              { id: 'SSL_ONLY', title: 'SSL / TLS Only', desc: 'Certificates & ciphers' },
            ].map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => handleScanTypeChange(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  scanType === preset.id
                    ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-sm'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="font-bold text-xs text-stone-100">{preset.title}</div>
                <div className="text-[11px] text-stone-400 mt-1">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modules Configuration */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-stone-100">
                Active Security Modules ({selectedModules.length} of {availableModules.length})
              </label>
              <p className="text-xs text-stone-400 mt-0.5">
                Toggle individual audit engines for customized testing.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {availableModules.map((m) => {
              const active = selectedModules.includes(m.id);
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    active
                      ? 'bg-stone-950/80 border-amber-500/50 text-stone-100'
                      : 'bg-stone-950/40 border-stone-800/80 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-lg border ${active ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-stone-900 border-stone-800 text-stone-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-stone-100">
                        {m.name}
                      </span>
                      <span className="text-xs text-stone-400">
                        {m.desc}
                      </span>
                    </div>
                  </div>

                  <div className="text-amber-400 shrink-0">
                    {active ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-stone-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || selectedModules.length === 0}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              <span>Initializing Live Security Audit...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Security Audit</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
