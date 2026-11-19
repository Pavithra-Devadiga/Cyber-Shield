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
        <h2 className="text-2xl font-bold text-white tracking-tight">Launch Vulnerability Audit</h2>
        <p className="text-blue-300/70 text-sm mt-1">
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
        <div className="p-7 rounded-2xl bg-[#0d162e] border border-blue-900/40 space-y-3 shadow-xl">
          <label className="block text-sm font-bold text-white">
            Target Domain or Application URL
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="https://example.com or http://testphp.vulnweb.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#091126] border border-blue-900/60 rounded-xl text-sm text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono shadow-inner"
            />
          </div>
          <p className="text-xs text-blue-300/60">
            Internal network addresses (RFC 1918) and cloud metadata services are safely blocked by SSRF protection.
          </p>
        </div>

        {/* Scan Profile Selection */}
        <div className="p-7 rounded-2xl bg-[#0d162e] border border-blue-900/40 space-y-4 shadow-xl">
          <label className="block text-sm font-bold text-white">
            Audit Profile Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                className={`p-4 rounded-xl border text-left transition-all ${
                  scanType === preset.id
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-600/10'
                    : 'bg-[#091126] border-blue-950 text-blue-300/70 hover:text-white hover:border-blue-900'
                }`}
              >
                <div className="font-bold text-xs text-white">{preset.title}</div>
                <div className="text-[11px] text-blue-300/60 mt-1">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modules Configuration */}
        <div className="p-7 rounded-2xl bg-[#0d162e] border border-blue-900/40 space-y-4 shadow-xl">
          <label className="block text-sm font-bold text-white">
            Active Security Modules ({selectedModules.length} of {availableModules.length})
          </label>
          <p className="text-xs text-blue-300/60 -mt-2">
            Toggle individual audit engines for customized testing.
          </p>

          <div className="space-y-3 pt-1">
            {availableModules.map((m) => {
              const active = selectedModules.includes(m.id);
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    active
                      ? 'bg-blue-950/40 border-blue-500/40 text-white'
                      : 'bg-[#091126]/60 border-blue-950 text-blue-300/60 hover:border-blue-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${active ? 'bg-blue-600/20 border-blue-500/30 text-sky-400' : 'bg-blue-950/40 border-blue-900/40 text-blue-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block text-white">
                        {m.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {m.desc}
                      </span>
                    </div>
                  </div>

                  <div className="text-sky-400 shrink-0">
                    {active ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-blue-300/40" />}
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
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
