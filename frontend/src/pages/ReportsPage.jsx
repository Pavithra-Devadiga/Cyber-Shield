import React, { useState, useEffect } from 'react';
import api from '../api/client';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  FileText,
  FileDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function ReportsPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/scans?page=0&size=20');
        if (res.data && res.data.data) {
          const completed = (res.data.data.content || []).filter((s) => s.status === 'COMPLETED');
          setScans(completed);
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (scanId) => {
    setDownloadingId(scanId);
    try {
      const response = await api.get(`/reports/download/${scanId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `security-audit-report-scan-${scanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download report', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Security Audit Reports</h2>
        <p className="text-blue-300/70 text-sm mt-1">
          Generate and download executive PDF compliance summaries and detailed remediation reports.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
        </div>
      ) : scans.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#0d162e] border border-blue-900/40 text-slate-400 text-sm space-y-2 shadow-xl">
          <Shield className="w-8 h-8 text-blue-500/40 mx-auto" />
          <p className="font-semibold text-white">No completed scans available for PDF report generation yet</p>
          <p className="text-xs text-blue-300/60">Run an audit from the dashboard or New Audit page to produce a report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="p-6 rounded-2xl bg-[#0d162e] border border-blue-900/40 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-5 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-sky-400 bg-blue-600/15 px-2.5 py-0.5 rounded border border-blue-500/30">
                      AUDIT #{scan.id}
                    </span>
                    <h3 className="font-bold text-base text-white mt-2 truncate max-w-xs">
                      {scan.targetUrl}
                    </h3>
                  </div>
                  <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#091126] border border-blue-950">
                    <span className="text-blue-300/60 block text-[10px] uppercase font-bold">Profile</span>
                    <span className="font-mono text-white font-semibold mt-0.5 block">{scan.scanType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#091126] border border-blue-950">
                    <span className="text-blue-300/60 block text-[10px] uppercase font-bold">Findings</span>
                    <span className="font-mono text-sky-300 font-semibold mt-0.5 block">
                      {scan.vulnerabilities?.length || 0} issues
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(scan.id)}
                disabled={downloadingId === scan.id}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
              >
                {downloadingId === scan.id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rendering PDF Report...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Download Audit PDF</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
