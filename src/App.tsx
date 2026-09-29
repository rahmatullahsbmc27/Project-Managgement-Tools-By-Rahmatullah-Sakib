import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  FileDown, 
  Filter, 
  Search, 
  Check, 
  AlertCircle,
  Copy,
  ChevronDown
} from 'lucide-react';
import { 
  Campaign, 
  ColumnConfig, 
  Role, 
  AgencyProfile, 
  CampaignStatus 
} from './types';
import { 
  INITIAL_CAMPAIGNS, 
  DEFAULT_COLUMNS, 
  INITIAL_AGENCY_PROFILE 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { StatsCards } from './components/StatsCards';
import { CampaignsTable } from './components/CampaignsTable';
import { MobileCardView } from './components/MobileCardView';
import { ClientMagicModal } from './components/ClientMagicModal';
import { AgencyProfileModal } from './components/AgencyProfileModal';
import { TaskModal } from './components/TaskModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Persistence with localStorage
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('brainfy_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    try {
      const saved = localStorage.getItem('brainfy_columns');
      return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    } catch {
      return DEFAULT_COLUMNS;
    }
  });

  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(() => {
    try {
      const saved = localStorage.getItem('brainfy_agency');
      return saved ? JSON.parse(saved) : INITIAL_AGENCY_PROFILE;
    } catch {
      return INITIAL_AGENCY_PROFILE;
    }
  });

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isMobileViewActive, setIsMobileViewActive] = useState(false);

  // Modals state
  const [magicModalCampaign, setMagicModalCampaign] = useState<Campaign | null>(null);
  const [agencyModalOpen, setAgencyModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('brainfy_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('brainfy_columns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem('brainfy_agency', JSON.stringify(agencyProfile));
  }, [agencyProfile]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auto-detect window width for initial mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileViewActive(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check URL parameters for magic link access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const magicToken = urlParams.get('magic_token');
    const taskId = urlParams.get('task_id');
    if (magicToken || taskId) {
      const match = campaigns.find(c => c.magicToken === magicToken || c.id === taskId);
      if (match) {
        setMagicModalCampaign(match);
      }
    }
  }, [campaigns]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers
  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`Updated campaign #${updated.id} successfully!`);
  };

  const handleDeleteCampaign = (id: string) => {
    if (activeRole !== 'Admin') {
      showToast('Error: Only Admins are permitted to delete tasks.');
      return;
    }
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showToast(`Deleted campaign #${id}`);
  };

  const handleCreateOrSaveTask = (campaign: Campaign) => {
    if (campaignToEdit) {
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
      showToast(`Updated #${campaign.id}`);
    } else {
      setCampaigns(prev => [campaign, ...prev]);
      showToast(`Created new campaign #${campaign.id}`);
    }
    setCampaignToEdit(null);
  };

  const handleCopyMagicLink = (campaign: Campaign) => {
    const magicUrl = `${window.location.origin}${window.location.pathname}?magic_token=${campaign.magicToken}&task_id=${campaign.id}#client-view`;
    navigator.clipboard.writeText(magicUrl);
    showToast(`Passwordless Magic Link for "${campaign.clientName}" copied!`);
  };

  const resetDefaultColumns = () => {
    setColumns(DEFAULT_COLUMNS);
    showToast('Reset column order to default.');
  };

  // Filter & Search Logic
  // Constraint 4: Global search must instantly filter by 4 to 6-digit Unique ID or Client Name
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      // Status filter
      if (activeFilter !== 'all') {
        if (c.status.toLowerCase() !== activeFilter.toLowerCase()) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase().replace(/^#/, '');
        const matchId = c.id.toLowerCase().includes(query);
        const matchClient = c.clientName.toLowerCase().includes(query);
        const matchCampaign = c.campaignName.toLowerCase().includes(query);
        const matchDirection = (c.direction || '').toLowerCase().includes(query);
        const matchCategory = c.category.toLowerCase().includes(query);
        const matchMarketer = c.marketer.toLowerCase().includes(query);
        return matchId || matchClient || matchCampaign || matchDirection || matchCategory || matchMarketer;
      }

      return true;
    });
  }, [campaigns, activeFilter, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: campaigns.length,
      active: campaigns.filter(c => c.status === 'Active').length,
      paused: campaigns.filter(c => c.status === 'Paused').length,
      rejected: campaigns.filter(c => c.status === 'Rejected').length,
      completed: campaigns.filter(c => c.status === 'Completed').length,
    };
  }, [campaigns]);

  return (
    <div className={`min-h-screen flex bg-[#f0f4f1] dark:bg-[#0b100d] text-slate-800 dark:text-slate-100 transition-colors`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 shadow-xl text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
          <Check size={14} className="text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collapsible Left Sidebar */}
      {!isMobileViewActive && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          agencyProfile={agencyProfile}
          onOpenAgencySettings={() => setAgencyModalOpen(true)}
          activeRole={activeRole}
          campaignsCount={campaigns.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Bar with Search & Theme */}
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          isMobileViewActive={isMobileViewActive}
          setIsMobileViewActive={setIsMobileViewActive}
          onOpenAgencySettings={() => setAgencyModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6 max-w-full overflow-hidden">
          {isMobileViewActive ? (
            /* Smart Vertical Cards for Mobile (Image 1 replica) */
            <MobileCardView
              campaigns={filteredCampaigns}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              activeRole={activeRole}
              onUpdateCampaign={handleUpdateCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onCopyMagicLink={handleCopyMagicLink}
              onOpenMagicModal={(campaign) => setMagicModalCampaign(campaign)}
              onOpenAddTask={() => {
                setCampaignToEdit(null);
                setTaskModalOpen(true);
              }}
            />
          ) : (
            /* Desktop Viewport (Image 2 replica) */
            <div className="space-y-4">
              {/* Header Row: Title, Subtitle, Date filter, Export & Add buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Campaigns
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    All Campaigns
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage and track all your ad campaigns in one place. Stay on top of performance, budgets, and client updates.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Date range display */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                    <CalendarIcon size={14} className="text-slate-400" />
                    <span>Last 30 days</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </div>

                  {/* Export PDF Button */}
                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/70 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
                  >
                    <FileDown size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Export PDF</span>
                  </button>

                  {/* New Campaign Task Button */}
                  <button
                    onClick={() => {
                      setCampaignToEdit(null);
                      setTaskModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>New Campaign</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <StatsCards campaigns={campaigns} />

              {/* Filter Tabs & Search Bar Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-xs">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === 'all'
                        ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    All Campaigns ({tabCounts.all})
                  </button>
                  <button
                    onClick={() => setActiveFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === 'active'
                        ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Active ({tabCounts.active})
                  </button>
                  <button
                    onClick={() => setActiveFilter('paused')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === 'paused'
                        ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Paused ({tabCounts.paused})
                  </button>
                  <button
                    onClick={() => setActiveFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === 'rejected'
                        ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Rejected ({tabCounts.rejected})
                  </button>
                  <button
                    onClick={() => setActiveFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === 'completed'
                        ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Completed ({tabCounts.completed})
                  </button>
                </div>

                {/* Inline filter count badge & info */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery && (
                    <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      Filter: "{searchQuery}"
                    </span>
                  )}
                  <span>
                    Showing {filteredCampaigns.length} of {campaigns.length}
                  </span>
                </div>
              </div>

              {/* STRICT: High-Density Table with zero horizontal scrolling and drag-drop columns */}
              <CampaignsTable
                campaigns={filteredCampaigns}
                columns={columns}
                setColumns={setColumns}
                activeRole={activeRole}
                onUpdateCampaign={handleUpdateCampaign}
                onDeleteCampaign={handleDeleteCampaign}
                onCopyMagicLink={handleCopyMagicLink}
                onOpenMagicModal={(campaign) => setMagicModalCampaign(campaign)}
                resetDefaultColumns={resetDefaultColumns}
              />
            </div>
          )}
        </main>
      </div>

      {/* Client Magic Link Modal */}
      <ClientMagicModal
        campaign={magicModalCampaign}
        agencyProfile={agencyProfile}
        isOpen={!!magicModalCampaign}
        onClose={() => setMagicModalCampaign(null)}
      />

      {/* Agency Profile Modal (Brand Name & Logo URL only) */}
      <AgencyProfileModal
        agencyProfile={agencyProfile}
        onSave={(updated) => {
          setAgencyProfile(updated);
          showToast(`Agency brand updated to "${updated.name}"`);
        }}
        activeRole={activeRole}
        isOpen={agencyModalOpen}
        onClose={() => setAgencyModalOpen(false)}
      />

      {/* Create / Edit Campaign Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setCampaignToEdit(null);
        }}
        onSave={handleCreateOrSaveTask}
        campaignToEdit={campaignToEdit}
      />

      {/* Export Report Modal */}
      <ExportModal
        campaigns={filteredCampaigns}
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
