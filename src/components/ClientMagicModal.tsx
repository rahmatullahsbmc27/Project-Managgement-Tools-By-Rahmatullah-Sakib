import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Building2,
  Lock
} from 'lucide-react';
import { Campaign, AgencyProfile, CampaignStatus } from '../types';

interface ClientMagicModalProps {
  campaign: Campaign | null;
  agencyProfile: AgencyProfile;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<CampaignStatus, { dot: string; text: string; bg: string }> = {
  Active: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  Paused: {
    dot: 'bg-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  Rejected: {
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  },
  Completed: {
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
  },
};

export const ClientMagicModal: React.FC<ClientMagicModalProps> = ({
  campaign,
  agencyProfile,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const magicUrl = `${window.location.origin}${window.location.pathname}?magic_token=${campaign.magicToken}&task_id=${campaign.id}#client-view`;

  const handleCopy = () => {
    navigator.clipboard.writeText(magicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const spendPercent = Math.min(100, Math.round((campaign.spent / campaign.totalBudget) * 100)) || 0;
  const statusConfig = STATUS_CONFIG[campaign.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#101713] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Client Magic Link
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Passwordless, read-only URL for {campaign.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Link URL Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Shareable Client Portal Link:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-600 dark:text-slate-300 truncate">
                {magicUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Clients do not need an account or password. They can only view their campaign progress and spend.
            </p>
          </div>

          {/* Live Preview Container (Simulating Client Screen) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Client Portal Live Preview</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#f7f9f7] to-[#eef4ef] dark:from-[#131d17] dark:to-[#0f1712] border border-slate-200/80 dark:border-slate-800 shadow-inner space-y-4">
              {/* Client Portal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {agencyProfile.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {agencyProfile.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Campaign Performance Portal
                    </div>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${statusConfig.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  <span className={statusConfig.text}>{campaign.status}</span>
                </div>
              </div>

              {/* Campaign Title & Unique ID */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {campaign.clientName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                    ID #{campaign.id}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {campaign.campaignName} · {campaign.category}
                </div>
              </div>

              {/* Spend & Budget Meter */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#17221b] border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Total Spent</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      ${campaign.spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Total Budget</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                      ${campaign.totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${spendPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{spendPercent}% of total budget consumed</span>
                  <span>Daily: ${campaign.dailyBudget.toFixed(0)}/day</span>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#17221b] border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <Calendar size={12} />
                    <span>Duration</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums text-[11px]">
                    {campaign.startDate} → {campaign.endDate}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#17221b] border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
                    <CreditCard size={12} />
                    <span>Ad Account</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                    {campaign.adAccount}
                  </div>
                </div>
              </div>

              {/* Targeting Direction */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#17221b] border border-slate-200/60 dark:border-slate-800/60 text-xs">
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">
                  Targeting Direction & Instructions
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                  {campaign.direction || 'General Audience'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
