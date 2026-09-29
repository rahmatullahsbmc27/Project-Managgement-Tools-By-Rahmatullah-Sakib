import React from 'react';
import { Layers, Activity, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Campaign } from '../types';

interface StatsCardsProps {
  campaigns: Campaign[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ campaigns }) => {
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spent, 0);
  // Estimate revenue based on spend margin
  const totalRevenue = totalSpend * 5.06;

  const stats = [
    {
      label: 'Total Campaigns',
      value: totalCampaigns.toString(),
      trend: '+20%',
      trendLabel: 'vs. previous 30 days',
      icon: Layers,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns.toString(),
      trend: '+14%',
      trendLabel: 'vs. previous 30 days',
      icon: Activity,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Total Spend',
      value: `$${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '+18%',
      trendLabel: 'vs. previous 30 days',
      icon: DollarSign,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '+32%',
      trendLabel: 'vs. previous 30 days',
      icon: TrendingUp,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/80 dark:bg-[#111914]/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-xs flex flex-col justify-between transition-all hover:border-emerald-300 dark:hover:border-emerald-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.accent} flex items-center justify-center shrink-0`}>
                <Icon size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-bold">
                  <ArrowUpRight size={12} className="stroke-[3]" />
                  {stat.trend}
                </span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span className="truncate">{stat.trendLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
