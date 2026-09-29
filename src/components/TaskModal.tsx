import React, { useState } from 'react';
import { X, Save, Compass, StickyNote } from 'lucide-react';
import { Campaign, CampaignCategory, CampaignStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
  campaignToEdit?: Campaign | null;
}

const CATEGORIES: CampaignCategory[] = [
  'Manpower',
  'Student Consultancy',
  'Travel',
  'E-commerce',
  'Others',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaignToEdit,
}) => {
  const generateRandomId = () => Math.floor(1000 + Math.random() * 9000).toString();

  const [id, setId] = useState(campaignToEdit ? campaignToEdit.id : generateRandomId());
  const [clientName, setClientName] = useState(campaignToEdit ? campaignToEdit.clientName : '');
  const [campaignName, setCampaignName] = useState(campaignToEdit ? campaignToEdit.campaignName : '');
  const [status, setStatus] = useState<CampaignStatus>(campaignToEdit ? campaignToEdit.status : 'Active');
  const [spent, setSpent] = useState(campaignToEdit ? campaignToEdit.spent : 0);
  const [dailyBudget, setDailyBudget] = useState(campaignToEdit ? campaignToEdit.dailyBudget : 50);
  const [totalBudget, setTotalBudget] = useState(campaignToEdit ? campaignToEdit.totalBudget : 1500);
  const [startDate, setStartDate] = useState(campaignToEdit ? campaignToEdit.startDate : new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(campaignToEdit ? campaignToEdit.endDate : new Date(Date.now() + 30*24*3600*1000).toISOString().slice(0, 10));
  // MANDATORY CONSTRAINT 2: Direction/Targeting text field
  const [direction, setDirection] = useState(campaignToEdit ? campaignToEdit.direction : 'Women only, 22-45, Metro areas');
  const [category, setCategory] = useState<CampaignCategory>(campaignToEdit ? campaignToEdit.category : 'E-commerce');
  const [adAccount, setAdAccount] = useState(campaignToEdit ? campaignToEdit.adAccount : 'Meta Ads');
  const [submittedBy, setSubmittedBy] = useState(campaignToEdit ? campaignToEdit.submittedBy : 'Rahmatullah Sakib');
  const [marketer, setMarketer] = useState(campaignToEdit ? campaignToEdit.marketer : 'Tanjila Akter');
  const [quickNotes, setQuickNotes] = useState(campaignToEdit?.quickNotes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const campaign: Campaign = {
      id: id.trim() || generateRandomId(),
      clientName: clientName.trim(),
      campaignName: campaignName.trim() || 'General Promotion',
      status,
      spent: Number(spent) || 0,
      dailyBudget: Number(dailyBudget) || 1,
      totalBudget: Number(totalBudget) || 1,
      startDate,
      endDate,
      direction: direction.trim() || 'General audience',
      category,
      adAccount: adAccount.trim() || 'Meta Ads',
      submittedBy: submittedBy.trim() || 'Rahmatullah Sakib',
      marketer: marketer.trim() || 'Marketer',
      quickNotes: quickNotes.trim() || undefined,
      magicToken: campaignToEdit?.magicToken || `magic_${id}_${Math.random().toString(36).substring(2, 6)}`,
    };

    onSave(campaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-[#101713] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {campaignToEdit ? 'Edit Campaign Task' : 'Create New Campaign Task'}
            </h3>
            <p className="text-[11px] text-slate-500">Rahmatullah Agency Management</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[82vh] overflow-y-auto text-xs">
          {/* ID & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unique Task ID (4-6 digits)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono">#</span>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  placeholder="7492"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Client Name & Campaign Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Client / Page Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. NovaTech Solutions"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Brand Awareness"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* MANDATORY: Direction / Targeting Instruction Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Compass size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Direction / Targeting Instructions *</span>
            </label>
            <textarea
              rows={2}
              required
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="e.g. Women only, 22-45, Specific location: Dhaka Metro, High intent buyers"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Client-specific demographic, geographic, or creative guidelines.
            </p>
          </div>

          {/* Category & Ad Account */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ad Account
              </label>
              <input
                type="text"
                value={adAccount}
                onChange={(e) => setAdAccount(e.target.value)}
                placeholder="e.g. Meta Ads, Google Ads"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Budgets & Spent */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Budget ($)
              </label>
              <input
                type="number"
                step="1"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Budget ($)
              </label>
              <input
                type="number"
                step="1"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Real-Time Spent ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={spent}
                onChange={(e) => setSpent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Duration Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submitter & Marketer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marketer
              </label>
              <input
                type="text"
                value={marketer}
                onChange={(e) => setMarketer(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Submitted By
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Notes Section (Internal Campaign Memos) */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-900/40">
            <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <StickyNote size={13} className="text-amber-600 dark:text-amber-400" />
                <span>Quick Notes (Internal Campaign Memos)</span>
              </span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400/70 font-normal">Shows as icon tooltip on table</span>
            </label>
            <textarea
              rows={2}
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="e.g. VIP client - prioritize WhatsApp responses; test new creative angles on Fridays..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs"
            >
              <Save size={14} />
              <span>{campaignToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
