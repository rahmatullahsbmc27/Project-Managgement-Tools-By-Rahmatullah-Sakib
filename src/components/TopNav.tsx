import React from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Monitor,
  Command,
  X
} from 'lucide-react';
import { Role } from '../types';

interface TopNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isMobileViewActive: boolean;
  setIsMobileViewActive: (val: boolean) => void;
  onOpenAgencySettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  activeRole,
  setActiveRole,
  isMobileViewActive,
  setIsMobileViewActive,
  onOpenAgencySettings,
}) => {
  return (
    <header className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0f1712]/70 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-10 transition-colors">
      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by 4-6 digit ID (#7492) or client name..."
          className="w-full pl-9 pr-14 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-8 pr-1 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={14} />
          </button>
        ) : null}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-[10px] font-mono">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile / Desktop Toggle (for testing responsiveness instantly) */}
        <button
          onClick={() => setIsMobileViewActive(!isMobileViewActive)}
          title={isMobileViewActive ? "Switch to Desktop High-Density Table" : "Switch to Mobile Card View"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isMobileViewActive
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          {isMobileViewActive ? <Smartphone size={14} className="text-emerald-600" /> : <Monitor size={14} />}
          <span className="hidden sm:inline">
            {isMobileViewActive ? 'Mobile Cards' : 'Dense Table'}
          </span>
        </button>

        {/* Role Switcher (Admin vs Moderator) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveRole('Admin')}
            title="Admin: Full control, CAN delete tasks"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'Admin'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={13} className={activeRole === 'Admin' ? 'text-emerald-600 dark:text-emerald-400' : ''} />
            <span>Admin</span>
          </button>
          <button
            onClick={() => setActiveRole('Moderator')}
            title="Moderator: Standard role, CANNOT delete tasks"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'Moderator'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert size={13} className={activeRole === 'Moderator' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Moderator</span>
          </button>
        </div>

        {/* Dark / Light Toggle Switch */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Dark / Light Mode"
          className="relative flex items-center bg-slate-200 dark:bg-slate-800 w-14 h-8 p-1 rounded-full cursor-pointer transition-colors border border-slate-300/80 dark:border-slate-700"
        >
          <div className="flex items-center justify-between w-full px-1 text-slate-400">
            <Sun size={12} className={!isDarkMode ? 'text-amber-500' : 'text-slate-500'} />
            <Moon size={12} className={isDarkMode ? 'text-emerald-400' : 'text-slate-400'} />
          </div>
          <div 
            className={`absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-emerald-600 shadow-sm transition-transform duration-200 ease-out flex items-center justify-center ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {isDarkMode ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-amber-500" />}
          </div>
        </button>

        {/* Notification Bell */}
        <button 
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            3
          </span>
        </button>

        {/* User Pill */}
        <div 
          onClick={onOpenAgencySettings}
          className="flex items-center gap-2 pl-2 cursor-pointer group"
          title="Agency Profile Settings"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/50 shadow-2xs group-hover:ring-2 ring-emerald-500/30 transition-all">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Sakib Rahman" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Rahmatullah Sakib
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
              {activeRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
