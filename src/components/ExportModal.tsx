import React, { useState } from 'react';
import { X, FileText, Download, Check } from 'lucide-react';
import { Campaign } from '../types';

interface ExportModalProps {
  campaigns: Campaign[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  campaigns,
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Campaign', 'Status', 'Spent', 'DailyBudget', 'TotalBudget', 'StartDate', 'EndDate', 'Category', 'AdAccount', 'Marketer', 'SubmittedBy'];
    const rows = campaigns.map(c => [
      c.id,
      `"${c.clientName.replace(/"/g, '""')}"`,
      `"${c.campaignName.replace(/"/g, '""')}"`,
      c.status,
      c.spent,
      c.dailyBudget,
      c.totalBudget,
      c.startDate,
      c.endDate,
      c.category,
      c.adAccount,
      c.marketer,
      c.submittedBy
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brainfy_campaigns_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1500);
  };

  const handlePrintPDF = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-[#101713] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Export Campaigns
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export all <strong className="text-slate-800 dark:text-slate-200">{campaigns.length} campaigns</strong> currently in view with real-time budgets and metrics.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={handlePrintPDF}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-left"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Print / Save as PDF</div>
                <div className="text-[11px] text-slate-400">Generates clean executive PDF report</div>
              </div>
              <Download size={16} className="text-emerald-600" />
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-left"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Export Raw CSV</div>
                <div className="text-[11px] text-slate-400">Compatible with Excel, Sheets, and BI tools</div>
              </div>
              {downloaded ? <Check size={16} className="text-emerald-600" /> : <Download size={16} className="text-emerald-600" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
