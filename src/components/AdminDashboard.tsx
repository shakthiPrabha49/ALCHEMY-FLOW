import React from 'react';
import { Employee, Brand, ContentItem } from '../types';
import { TrendingUp, CheckCircle, Clock, BarChart3, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
  employees: Employee[];
  brands: Brand[];
  content: ContentItem[];
}

export function AdminDashboard({ employees, brands, content }: AdminDashboardProps) {
  const designers = employees.filter(e => e.role === 'Designer');
  
  // Calculate stats for each designer
  const designerStats = designers.map(designer => {
    const designerContent = content.filter(c => c.designerId === designer.id);
    const completed = designerContent.filter(c => c.designStatus === 'Completed').length;
    const wip = designerContent.filter(c => c.designStatus === 'In Progress' || c.designStatus === 'To Do').length;
    const uniqueBrands = new Set(designerContent.map(c => c.brandId)).size;
    
    return {
      ...designer,
      completed,
      wip,
      uniqueBrands,
      total: designerContent.length
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Admin Command Center</h1>
        <p className="text-[#666] text-sm">Performance metrics and team productivity overview.</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Content', value: content.length, icon: BarChart3, color: 'text-white' },
          { label: 'Total Brands', value: brands.length, icon: Briefcase, color: 'text-brand-orange' },
          { label: 'Tasks Finished', value: content.filter(c => c.designStatus === 'Completed').length, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Work In Progress', value: content.filter(c => c.designStatus === 'In Progress').length, icon: Clock, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111] border border-zinc-900 p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <TrendingUp size={14} className="text-[#333]" />
            </div>
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-3xl font-black", stat.color)}>{stat.value.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Designer Performance Table */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Designer Performance</h2>
        <div className="border border-zinc-900 rounded-sm overflow-hidden bg-[#111]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#151515] text-[10px] uppercase font-bold text-[#444] border-b border-zinc-900">
                <th className="p-4">Designer</th>
                <th className="p-4 text-center">Monthly Designs</th>
                <th className="p-4 text-center">Active WIP</th>
                <th className="p-4 text-center">Brand Coverage</th>
                <th className="p-4 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {designerStats.map(ds => (
                <tr key={ds.id} className="border-b border-zinc-900 hover:bg-[#151515] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center font-bold text-brand-orange">
                        {ds.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white uppercase">{ds.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-white text-lg">{ds.completed}</td>
                  <td className="p-4 text-center font-mono text-orange-400 text-lg">{ds.wip}</td>
                  <td className="p-4 text-center text-[#888]">{ds.uniqueBrands} Brands</td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="w-32 h-1 bg-[#222] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-orange transition-all duration-1000" 
                          style={{ width: `${ds.total > 0 ? (ds.completed / ds.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#444]">
                        {ds.total > 0 ? Math.round((ds.completed / ds.total) * 100) : 0}% Efficiency
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {designerStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#444]">No designer data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
