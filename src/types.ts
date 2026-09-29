export type Role = 'Admin' | 'Moderator';

export type CampaignStatus = 'Active' | 'Paused' | 'Rejected' | 'Completed';

export type CampaignCategory = 
  | 'Manpower' 
  | 'Student Consultancy' 
  | 'Travel' 
  | 'E-commerce' 
  | 'Others';

export interface Campaign {
  id: string; // e.g. "7492" (4 to 6 digit unique ID)
  clientName: string; // e.g. "NovaTech Solutions"
  campaignName: string; // e.g. "Brand Awareness"
  status: CampaignStatus;
  spent: number;
  dailyBudget: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
  direction: string; // Targeting / client instructions e.g. "Women 22-45 • Metro areas"
  category: CampaignCategory;
  adAccount: string; // e.g. "Meta Ads", "Google Ads"
  submittedBy: string;
  marketer: string;
  magicToken: string;
  quickNotes?: string;
  createdAt?: string;
}

export type ColumnId = 
  | 'status'
  | 'spent'
  | 'client'
  | 'budget'
  | 'duration'
  | 'direction'
  | 'category'
  | 'adAccount'
  | 'team';

export interface ColumnConfig {
  id: ColumnId;
  label: string;
  widthPercent: number; // Percent width for strict 100% horizontal fit with no scroll
}

export interface AgencyProfile {
  name: string;
  adminName: string;
  logoUrl: string;
}
