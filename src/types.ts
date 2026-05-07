/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  role: 'KAM' | 'Designer' | 'Admin';
}

export interface Brand {
  id: string;
  name: string;
  kamId: string; // Key Account Manager ID
}

export type DesignStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type ApprovalStatus = 'Pending' | 'Changes Requested' | 'Approved';
export type PublishStatus = 'Draft' | 'Scheduled' | 'Published';
export type IdeaStatus = 'Not Done' | 'In Progress' | 'Done';

export interface ContentItem {
  id: string;
  brandId: string;
  month: string; // e.g., "2024-05"
  contentNumber: string;
  ideas: string;
  ideaStatus: IdeaStatus;
  caption: string;
  designerId: string;
  designStatus: DesignStatus;
  approvalStatus: ApprovalStatus;
  publishStatus: PublishStatus;
  publishDate: string; 
  booking: string; 
  createdAt: number;
}

export interface Database {
  employees: Employee[];
  brands: Brand[];
  content: ContentItem[];
}
