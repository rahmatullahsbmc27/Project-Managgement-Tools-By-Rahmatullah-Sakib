import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { AgencyProfile, Role } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  agencyProfile: AgencyProfile;
  onOpenAgencySettings: () => void;
  activeRole: Role;
  campaignsCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  agencyProfile,
  onOpenAgencySettings,
  activeRole,
  campaignsCount,
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, count: campaignsCount },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'leads', label: 'Leads', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0f1712]/90 backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 select-none z-20 ${
        collapsed ? 'w-[70px]' : 'w-[250px]'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800/60 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <div 
            onClick={onOpenAgencySettings}
            title="Edit Brand Profile"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-500/20 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {agencyProfile.logoUrl ? (
              <img 
                src={agencyProfile.logoUrl} 
                alt={agencyProfile.name} 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="text-sm font-extrabold tracking-wider">
              {agencyProfile.name.charAt(0)}
            </span>
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {agencyProfile.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Ad Operations Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'settings') {
                  onOpenAgencySettings();
                } else {
                  setActiveTab(item.id);
                }
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon 
                size={18} 
                className={`shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`} 
              />
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Profile & Promo Bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100/80 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles size={12} />
              </div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                Agency Engine
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed mb-2.5">
              Live spend tracking & instant client magic links.
            </p>
            <button 
              onClick={onOpenAgencySettings}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
            >
              <span>Agency Brand</span>
              <Building2 size={13} />
            </button>
          </div>
        )}

        <div 
          onClick={onOpenAgencySettings}
          className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-1' : ''
          }`}
          title="Manage Agency Brand"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              RS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {agencyProfile.adminName || 'Rahmatullah Sakib'}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck size={11} className={activeRole === 'Admin' ? 'text-emerald-500' : 'text-amber-500'} />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{activeRole}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
