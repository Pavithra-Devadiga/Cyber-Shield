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
  Database,
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
        <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Security Audit Reports</h2>
        <p className="text-stone-400 text-sm mt-1">
          Generate and download executive PDF compliance summaries and detailed remediation reports generated via OpenPDF.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
        </div>
      ) : scans.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-sm space-y-2">
          <Database className="w-8 h-8 text-stone-600 mx-auto" />
          <p>No completed scans available for PDF report generation yet.</p>
          <p className="text-xs text-stone-400">Run a scan from the dashboard to produce a report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-stone-400">REPORT #{scan.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                    {scan.scanType}
                  </span>
                </div>

                <h3 className="font-bold text-stone-100 text-base truncate">
                  {scan.targetUrl}
                </h3>

                <div className="py-2">
                  <ScoreGauge score={scan.securityScore} grade={scan.letterGrade} size="sm" />
                </div>

                <div className="text-xs text-stone-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>{scan.createdAt ? new Date(scan.createdAt).toLocaleString() : 'Recent'}</span>
                  </div>
                  <div>
                    Findings Detected: <strong className="text-stone-200">{scan.vulnerabilityCount || 0} issues</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => handleDownload(scan.id)}
                  disabled={downloadingId === scan.id}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <FileDown className="w-4 h-4" />
                  {downloadingId === scan.id ? 'Compiling PDF...' : 'Download PDF'}
                </button>

                <a
                  href={`/scans/${scan.id}`}
                  className="text-xs font-semibold text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  Inspect Audit
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
