import React from 'react';
import { 
  Campaign, 
  Role, 
  CampaignStatus 
} from '../types';
import { 
  Link2, 
  Layers, 
  Users, 
  DollarSign, 
  Calendar,
  ExternalLink,
  Trash2,
  Compass,
  StickyNote
} from 'lucide-react';

interface MobileCardViewProps {
  campaigns: Campaign[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeRole: Role;
  onUpdateCampaign: (updated: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onCopyMagicLink: (campaign: Campaign) => void;
  onOpenMagicModal: (campaign: Campaign) => void;
  onOpenAddTask: () => void;
}

const STATUS_CONFIG: Record<CampaignStatus, { dot: string; text: string }> = {
  Active: { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  Paused: { dot: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-400' },
  Rejected: { dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-400' },
  Completed: { dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'E-commerce': 'bg-blue-600',
  'Student Consultancy': 'bg-indigo-600',
  'Travel': 'bg-teal-600',
  'Manpower': 'bg-amber-600',
  'Others': 'bg-emerald-600',
};

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  campaigns,
  activeFilter,
  setActiveFilter,
  activeRole,
  onUpdateCampaign,
  onDeleteCampaign,
  onCopyMagicLink,
  onOpenMagicModal,
  onOpenAddTask,
}) => {
  const totalCampaigns = campaigns.length;
  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spent, 0);

  const filterTabs = [
    { id: 'all', label: 'All', count: totalCampaigns },
    { id: 'active', label: 'Active', count: campaigns.filter(c => c.status === 'Active').length },
    { id: 'paused', label: 'Paused', count: campaigns.filter(c => c.status === 'Paused').length },
    { id: 'rejected', label: 'Rejected', count: campaigns.filter(c => c.status === 'Rejected').length },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-16">
      {/* Top Greeting */}
      <div className="pt-2 px-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Good Morning, Rahmatullah Sakib
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Rahmatullah Agency Campaigns Overview
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <div className="p-3 rounded-2xl bg-white dark:bg-[#111914] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <Layers size={13} />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Total Campaigns
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
            {totalCampaigns} <span className="text-[10px] text-emerald-600 font-bold">↑ 20%</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-[#111914] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <Users size={13} />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Active Clients
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
            {activeCount} <span className="text-[10px] text-emerald-600 font-bold">↑ 14%</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-[#111914] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <DollarSign size={13} />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Total Spend
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums truncate">
            ${totalSpend.toFixed(0)} <span className="text-[10px] text-emerald-600 font-bold">↑ 18%</span>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-1 no-scrollbar">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Smart Vertical Cards */}
      <div className="space-y-2.5 px-1">
        {campaigns.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No campaigns found</p>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const statusConfig = STATUS_CONFIG[campaign.status];
            const letter = campaign.clientName.charAt(0).toUpperCase();
            const bgClass = CATEGORY_COLORS[campaign.category] || 'bg-emerald-600';

            return (
              <div
                key={campaign.id}
                onClick={() => onOpenMagicModal(campaign)}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#111914] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${bgClass} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {letter}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {campaign.clientName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                          <span className={statusConfig.text}>{campaign.status}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <span>{campaign.category}</span>
                        <span className="mx-1">·</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">#{campaign.id}</span>
                      </div>

                      {/* Direction Snippet */}
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 truncate">
                        <Compass size={11} className="shrink-0" />
                        <span className="truncate">{campaign.direction}</span>
                      </div>

                      {/* Quick Notes Memo */}
                      {campaign.quickNotes && (
                        <div className="flex items-center gap-1 text-[9.5px] text-amber-700 dark:text-amber-400 font-medium mt-0.5 truncate bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
                          <StickyNote size={10} className="shrink-0" />
                          <span className="truncate">{campaign.quickNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      ${campaign.dailyBudget.toFixed(0)} / ${campaign.totalBudget.toFixed(0)}
                    </div>
                    <div className="text-[10px] text-slate-400">Daily / Total</div>

                    <div className="mt-1 text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[100px]">
                      {campaign.marketer}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>Spent: <strong className="text-slate-800 dark:text-slate-200">${campaign.spent.toFixed(2)}</strong></span>
                      <span>{Math.min(100, Math.round((campaign.spent / campaign.totalBudget) * 100))}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (campaign.spent / campaign.totalBudget) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onCopyMagicLink(campaign)}
                      title="Copy Magic Link"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      <Link2 size={13} />
                    </button>
                    <button
                      onClick={() => onOpenMagicModal(campaign)}
                      title="Open Portal"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                    >
                      <ExternalLink size={13} />
                    </button>
                    {activeRole === 'Admin' ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${campaign.clientName}?`)) {
                            onDeleteCampaign(campaign.id);
                          }
                        }}
                        title="Delete (Admin only)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={onOpenAddTask}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center font-bold text-xl z-30 transition-transform active:scale-95"
      >
        +
      </button>
    </div>
  );
};
