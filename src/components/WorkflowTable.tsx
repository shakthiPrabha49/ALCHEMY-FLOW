import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Calendar, 
  User, 
  Edit3, 
  Trash2,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { ContentItem, DesignStatus, ApprovalStatus, PublishStatus, Employee } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface WorkflowTableProps {
  items: ContentItem[];
  designers: Employee[];
  onUpdate: (id: string, updates: Partial<ContentItem>) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  'To Do': 'text-[#666] bg-[#222]',
  'In Progress': 'text-orange-400 bg-orange-900/30 border border-orange-800',
  'Review': 'text-blue-400 bg-blue-900/30 border border-blue-800',
  'Completed': 'text-green-400 bg-green-900/30 border border-green-800',
  'Not Done': 'text-[#666] bg-[#222]',
  'Done': 'text-green-500 bg-green-500/10 border border-green-500/20',
  'Pending': 'text-[#888] bg-[#222]',
  'Changes Requested': 'text-red-400 bg-red-900/30 border border-red-800',
  'Approved': 'text-green-500',
  'Draft': 'text-[#666]',
  'Scheduled': 'text-[#888]',
  'Published': 'text-green-500',
};

export function WorkflowTable({ items, designers, onUpdate, onDelete }: WorkflowTableProps) {
  return (
    <div className="table-container">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-[#151515] border-b border-[#222] text-[10px] uppercase tracking-wider text-[#666]">
            <th className="p-3 font-semibold">Month</th>
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold w-1/4">Idea / Topic</th>
            <th className="p-3 font-semibold w-1/4">Caption</th>
            <th className="p-3 font-semibold text-center">Idea Status</th>
            <th className="p-3 font-semibold">Designer</th>
            <th className="p-3 font-semibold text-center">Design Status</th>
            <th className="p-3 font-semibold text-center">Client Appr.</th>
            <th className="p-3 font-semibold text-center">Publish</th>
            <th className="p-3 font-semibold">Date</th>
            <th className="p-3 font-semibold">Booking</th>
            <th className="p-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={12} className="p-12 text-center text-[#444]">
                No items found. Click "Add Row" to begin.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f] transition-colors group">
                <td className="p-3 text-[#555] uppercase font-bold">
                   <input 
                    type="month"
                    className="bg-transparent border-none p-0 w-24 focus:ring-0 text-[#555] font-bold"
                    value={item.month}
                    onChange={(e) => onUpdate(item.id, { month: e.target.value })}
                  />
                </td>
                <td className="p-3 font-mono text-[#444]">
                   <input 
                    type="text"
                    className="bg-transparent border-none p-0 w-8 focus:ring-0 text-[#444]"
                    value={item.contentNumber}
                    onChange={(e) => onUpdate(item.id, { contentNumber: e.target.value })}
                  />
                </td>
                <td className="p-3">
                  <textarea 
                    rows={1}
                    className="bg-transparent border-none p-0 w-full focus:ring-0 text-white font-medium resize-none min-h-[1.2rem]"
                    value={item.ideas}
                    onChange={(e) => onUpdate(item.id, { ideas: e.target.value })}
                    placeholder="Enter idea..."
                  />
                </td>
                <td className="p-3">
                  <textarea 
                    rows={1}
                    className="bg-transparent border-none p-0 w-full focus:ring-0 text-[#888] italic resize-none min-h-[1.2rem]"
                    value={item.caption}
                    onChange={(e) => onUpdate(item.id, { caption: e.target.value })}
                    placeholder="Enter caption..."
                  />
                </td>
                <td className="p-3 text-center">
                  <select
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-sm border-none cursor-pointer focus:ring-0",
                      statusColors[item.ideaStatus || 'Not Done']
                    )}
                    value={item.ideaStatus || 'Not Done'}
                    onChange={(e) => onUpdate(item.id, { ideaStatus: e.target.value as any })}
                  >
                    <option value="Not Done">Not Done</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td className="p-3">
                  <select 
                    className="bg-transparent border-none text-[#888] focus:ring-0 p-0 text-xs cursor-pointer"
                    value={item.designerId}
                    onChange={(e) => onUpdate(item.id, { designerId: e.target.value })}
                  >
                    <option value="">—</option>
                    {designers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-center">
                  <select
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-sm border-none cursor-pointer focus:ring-0",
                      statusColors[item.designStatus]
                    )}
                    value={item.designStatus}
                    onChange={(e) => onUpdate(item.id, { designStatus: e.target.value as DesignStatus })}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">Working</option>
                    <option value="Review">Feedback</option>
                    <option value="Completed">Finished</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                   <select
                      className={cn(
                        "text-[10px] font-bold py-0.5 border-none bg-transparent cursor-pointer focus:ring-0",
                        statusColors[item.approvalStatus]
                      )}
                      value={item.approvalStatus}
                      onChange={(e) => onUpdate(item.id, { approvalStatus: e.target.value as ApprovalStatus })}
                    >
                      <option value="Pending">—</option>
                      <option value="Changes Requested">Rejected</option>
                      <option value="Approved">Approved</option>
                    </select>
                </td>
                <td className="p-3 text-center">
                   <select
                      className={cn(
                        "text-[10px] py-0.5 border-none bg-transparent cursor-pointer focus:ring-0",
                        statusColors[item.publishStatus]
                      )}
                      value={item.publishStatus}
                      onChange={(e) => onUpdate(item.id, { publishStatus: e.target.value as PublishStatus })}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Published">Published</option>
                    </select>
                </td>
                <td className="p-3 text-[#555] whitespace-nowrap font-mono text-[11px]">
                   <input 
                    type="date"
                    className="bg-transparent border-none p-0 w-24 focus:ring-0 text-[#555] font-mono text-[10px]"
                    value={item.publishDate}
                    onChange={(e) => onUpdate(item.id, { publishDate: e.target.value })}
                  />
                </td>
                <td className="p-3">
                   <input 
                    className="bg-transparent border-none p-0 w-16 focus:ring-0 text-[#666] text-xs"
                    placeholder="Link..."
                    value={item.booking}
                    onChange={(e) => onUpdate(item.id, { booking: e.target.value })}
                  />
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-[#444] hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
