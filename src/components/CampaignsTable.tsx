import React, { useState } from 'react';
import { 
  GripVertical, 
  Link2, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Compass,
  StickyNote
} from 'lucide-react';
import { Campaign, ColumnConfig, ColumnId, Role, CampaignStatus, CampaignCategory } from '../types';

interface CampaignsTableProps {
  campaigns: Campaign[];
  columns: ColumnConfig[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
  activeRole: Role;
  onUpdateCampaign: (updated: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onCopyMagicLink: (campaign: Campaign) => void;
  onOpenMagicModal: (campaign: Campaign) => void;
  resetDefaultColumns: () => void;
}

const CATEGORIES: CampaignCategory[] = [
  'Manpower',
  'Student Consultancy',
  'Travel',
  'E-commerce',
  'Others',
];

const STATUS_CONFIG: Record<CampaignStatus, { dot: string; text: string; bg: string }> = {
  Active: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
  },
  Paused: {
    dot: 'bg-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
  },
  Rejected: {
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
  },
  Completed: {
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
  },
};

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
  campaigns,
  columns,
  setColumns,
  activeRole,
  onUpdateCampaign,
  onDeleteCampaign,
  onCopyMagicLink,
  onOpenMagicModal,
  resetDefaultColumns,
}) => {
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
  const [dragOverColIndex, setDragOverColIndex] = useState<number | null>(null);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Campaign | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverColIndex !== index) {
      setDragOverColIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedColIndex === null || draggedColIndex === targetIndex) {
      setDraggedColIndex(null);
      setDragOverColIndex(null);
      return;
    }

    const updated = [...columns];
    const [moved] = updated.splice(draggedColIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setColumns(updated);
    setDraggedColIndex(null);
    setDragOverColIndex(null);
  };

  const startInlineEdit = (campaign: Campaign) => {
    setEditingId(campaign.id);
    setEditForm({ ...campaign });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveInlineEdit = () => {
    if (editForm) {
      onUpdateCampaign(editForm);
    }
    setEditingId(null);
    setEditForm(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === campaigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaigns.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Render cell helper
  const renderCell = (colId: ColumnId, campaign: Campaign, isEditing: boolean) => {
    if (isEditing && editForm) {
      switch (colId) {
        case 'status':
          return (
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as CampaignStatus })}
              className="w-full text-[11px] py-1 px-1 rounded-md border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          );
        case 'spent':
          return (
            <input
              type="number"
              step="0.01"
              value={editForm.spent}
              onChange={(e) => setEditForm({ ...editForm, spent: parseFloat(e.target.value) || 0 })}
              className="w-full text-[11px] px-1 py-1 rounded-md border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          );
        case 'client':
          return (
            <div className="space-y-1">
              <input
                type="text"
                value={editForm.clientName}
                onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                className="w-full text-[11px] px-1 py-0.5 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                placeholder="Client Name"
              />
              <input
                type="text"
                value={editForm.quickNotes || ''}
                onChange={(e) => setEditForm({ ...editForm, quickNotes: e.target.value })}
                className="w-full text-[9.5px] px-1 py-0.5 rounded border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 placeholder:text-slate-400"
                placeholder="Quick memo note..."
              />
            </div>
          );
        case 'budget':
          return (
            <div className="space-y-0.5">
              <input
                type="number"
                value={editForm.totalBudget}
                onChange={(e) => setEditForm({ ...editForm, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full text-[10px] px-1 py-0.5 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                placeholder="Total"
              />
              <input
                type="number"
                value={editForm.dailyBudget}
                onChange={(e) => setEditForm({ ...editForm, dailyBudget: parseFloat(e.target.value) || 0 })}
                className="w-full text-[10px] px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                placeholder="Daily"
              />
            </div>
          );
        case 'duration':
          return (
            <div className="space-y-0.5">
              <input
                type="date"
                value={editForm.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                className="w-full text-[9px] px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
              <input
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                className="w-full text-[9px] px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>
          );
        case 'direction':
          return (
            <input
              type="text"
              value={editForm.direction}
              onChange={(e) => setEditForm({ ...editForm, direction: e.target.value })}
              className="w-full text-[10px] px-1.5 py-1 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Targeting / Instructions"
            />
          );
        case 'category':
          return (
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as CampaignCategory })}
              className="w-full text-[10px] py-1 px-1 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          );
        case 'adAccount':
          return (
            <input
              type="text"
              value={editForm.adAccount}
              onChange={(e) => setEditForm({ ...editForm, adAccount: e.target.value })}
              className="w-full text-[11px] px-1 py-0.5 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          );
        case 'team':
          return (
            <input
              type="text"
              value={editForm.marketer}
              onChange={(e) => setEditForm({ ...editForm, marketer: e.target.value })}
              className="w-full text-[10px] px-1 py-0.5 rounded border border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          );
      }
    }

    // Default Read View (Compact fonts to fit ONE screen horizontally without scrolling)
    switch (colId) {
      case 'status': {
        const config = STATUS_CONFIG[campaign.status];
        return (
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
            <span className={`text-[11px] font-bold ${config.text}`}>
              {campaign.status}
            </span>
          </div>
        );
      }
      case 'spent': {
        const spendPercent = Math.min(100, Math.round((campaign.spent / campaign.totalBudget) * 100)) || 0;
        return (
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                ${campaign.spent.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {spendPercent}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  spendPercent >= 100 ? 'bg-blue-500' : spendPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>
        );
      }
      case 'client': {
        return (
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate" title={campaign.clientName}>
                {campaign.clientName}
              </span>
              {campaign.quickNotes && (
                <div className="relative group shrink-0 inline-flex items-center">
                  <span
                    className="cursor-help p-0.5 rounded text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors inline-flex items-center"
                    aria-label="Quick memo note"
                  >
                    <StickyNote size={12} className="fill-amber-400/30 text-amber-600 dark:text-amber-400" />
                  </span>
                  {/* Tooltip on hover */}
                  <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:flex z-50 w-56 p-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] shadow-2xl border border-slate-700/80 pointer-events-none whitespace-normal leading-relaxed">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-amber-400">
                        <StickyNote size={11} />
                        <span>Campaign Quick Note</span>
                      </div>
                      <p className="text-slate-200 text-[11px] font-normal">{campaign.quickNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                #{campaign.id}
              </span>
              <span>·</span>
              <span className="truncate">{campaign.campaignName}</span>
            </div>
          </div>
        );
      }
      case 'budget': {
        return (
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ${campaign.totalBudget.toFixed(0)}
              <span className="text-[9px] font-normal text-slate-400 ml-0.5">tot</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              ${campaign.dailyBudget.toFixed(0)}/day
            </div>
          </div>
        );
      }
      case 'duration': {
        return (
          <div className="text-[10px] text-slate-700 dark:text-slate-300 tabular-nums">
            <div className="font-medium truncate">{campaign.startDate}</div>
            <div className="text-slate-400 truncate">to {campaign.endDate}</div>
          </div>
        );
      }
      case 'direction': {
        // MANDATORY: Show a snippet of the targeting details
        return (
          <div className="min-w-0" title={campaign.direction}>
            <div className="text-[11px] text-slate-700 dark:text-slate-200 truncate flex items-center gap-1 font-medium">
              <Compass size={11} className="text-emerald-600 shrink-0" />
              <span className="truncate">{campaign.direction}</span>
            </div>
          </div>
        );
      }
      case 'category': {
        return (
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate" title={campaign.category}>
            {campaign.category}
          </div>
        );
      }
      case 'adAccount': {
        return (
          <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">{campaign.adAccount}</span>
          </div>
        );
      }
      case 'team': {
        return (
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-900 dark:text-slate-200 truncate">
              {campaign.marketer}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              by {campaign.submittedBy}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-[#111914] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
      {/* Table Helper Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <GripVertical size={12} className="text-slate-400" />
          <span>Drag column headers to reorder • Double-click row for inline editing</span>
        </div>
        <button
          onClick={resetDefaultColumns}
          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
        >
          <RotateCcw size={10} />
          <span>Reset Order</span>
        </button>
      </div>

      {/* STRICT ZERO-SCROLL TABLE: table-fixed with calculated percentages */}
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 select-none">
              <th className="w-[30px] py-2 px-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === campaigns.length && campaigns.length > 0}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
              </th>

              {columns.map((col, index) => {
                const isOver = dragOverColIndex === index;
                return (
                  <th
                    key={col.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{ width: `${col.widthPercent}%` }}
                    className={`py-2 px-2 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-grab active:cursor-grabbing hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors ${
                      isOver ? 'border-l-2 border-emerald-500 bg-emerald-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <GripVertical size={10} className="text-slate-300 dark:text-slate-600 shrink-0" />
                      <span className="truncate">{col.label}</span>
                    </div>
                  </th>
                );
              })}

              <th className="w-[85px] py-2 px-2 text-right text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <p className="font-bold text-slate-700 dark:text-slate-300">No campaigns found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filter.</p>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const isEditing = editingId === campaign.id;
                const isSelected = selectedIds.includes(campaign.id);

                return (
                  <tr
                    key={campaign.id}
                    className={`group transition-colors ${
                      isEditing
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : isSelected
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2 px-2 text-left">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(campaign.id)}
                        className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                      />
                    </td>

                    {columns.map((col) => (
                      <td 
                        key={col.id} 
                        className="py-2 px-2 text-left truncate align-middle"
                        onDoubleClick={() => startInlineEdit(campaign)}
                      >
                        {renderCell(col.id, campaign, isEditing)}
                      </td>
                    ))}

                    <td className="py-2 px-2 text-right align-middle whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={saveInlineEdit}
                            title="Save Changes"
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            title="Cancel"
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => onCopyMagicLink(campaign)}
                            title="Copy Client Magic Link"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          >
                            <Link2 size={13} />
                          </button>
                          <button
                            onClick={() => onOpenMagicModal(campaign)}
                            title="Open Client Portal"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                          >
                            <ExternalLink size={13} />
                          </button>
                          <button
                            onClick={() => startInlineEdit(campaign)}
                            title="Inline Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit3 size={13} />
                          </button>
                          {activeRole === 'Admin' ? (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete campaign #${campaign.id}?`)) {
                                  onDeleteCampaign(campaign.id);
                                }
                              }}
                              title="Delete Task (Admin Only)"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 size={13} />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Moderators cannot delete tasks"
                              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{campaigns.length}</span> campaigns
        </div>
        <div>
          {activeRole === 'Moderator' && (
            <span className="text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60">
              Moderator: Task Deletion Disabled
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
