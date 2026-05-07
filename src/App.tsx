/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Search, 
  ChevronDown, 
  Bell, 
  Settings,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Hash,
  Users2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Employee, Brand, ContentItem, DesignStatus, ApprovalStatus, PublishStatus } from './types';
import { WorkflowTable } from './components/WorkflowTable';
import { AdminDashboard } from './components/AdminDashboard';

// --- API Service ---
const API_BASE = '/api';

const api = {
  getEmployees: () => fetch(`${API_BASE}/employees`).then(res => res.json()),
  getBrands: () => fetch(`${API_BASE}/brands`).then(res => res.json()),
  getContent: () => fetch(`${API_BASE}/content`).then(res => res.json()),
  
  createEmployee: (data: Partial<Employee>) => 
    fetch(`${API_BASE}/employees`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
  createBrand: (data: Partial<Brand>) => 
    fetch(`${API_BASE}/brands`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
  createContent: (data: Partial<ContentItem>) => 
    fetch(`${API_BASE}/content`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
  updateContent: (id: string, data: Partial<ContentItem>) => 
    fetch(`${API_BASE}/content/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
  deleteContent: (id: string) => 
    fetch(`${API_BASE}/content/${id}`, { method: 'DELETE' })
};

export default function App() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Modals state
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form states
  const [newBrand, setNewBrand] = useState({ name: '', kamId: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'KAM' as Employee['role'] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [b, e, c] = await Promise.all([
        api.getBrands(),
        api.getEmployees(),
        api.getContent()
      ]);
      setBrands(b);
      setEmployees(e);
      setContent(c);
      if (b.length > 0 && !selectedBrandId) {
        setSelectedBrandId(b[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.kamId) return;
    const res = await api.createBrand(newBrand);
    setBrands([...brands, res]);
    setSelectedBrandId(res.id);
    setIsBrandModalOpen(false);
    setNewBrand({ name: '', kamId: '' });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name) return;
    const res = await api.createEmployee(newEmployee);
    setEmployees([...employees, res]);
    setIsEmployeeModalOpen(false);
    setNewEmployee({ name: '', role: 'KAM' });
  };

  const handleAddRow = async () => {
    if (!selectedBrandId) return;
    const res = await api.createContent({
      brandId: selectedBrandId,
      month: new Date().toISOString().slice(0, 7),
      contentNumber: (filteredContent.length + 1).toString(),
      ideas: '',
      ideaStatus: 'Not Done',
      caption: '',
      designerId: '',
      designStatus: 'To Do',
      approvalStatus: 'Pending',
      publishStatus: 'Draft',
      publishDate: new Date().toISOString().split('T')[0]
    });
    setContent([...content, res]);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // Simple local password
      setIsAdminAuthenticated(true);
      setIsAdminView(true);
      setIsAdminLoginOpen(false);
      setAdminPassword('');
    } else {
      alert("Invalid password");
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<ContentItem>) => {
    const res = await api.updateContent(id, updates);
    setContent(content.map(c => c.id === id ? res : c));
  };

  const handleDeleteContent = async (id: string) => {
    await api.deleteContent(id);
    setContent(content.filter(c => c.id !== id));
  };

  const selectedBrand = brands.find(b => b.id === selectedBrandId);
  const kam = employees.find(e => e.id === selectedBrand?.kamId);
  const filteredContent = content.filter(c => c.brandId === selectedBrandId);
  const designers = employees.filter(e => e.role === 'Designer');
  const kams = employees.filter(e => e.role === 'KAM');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden overflow-x-auto bg-brand-black">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-brand-dark border-r border-border-subtle flex flex-col shrink-0"
          >
            <div className="p-4 border-b border-border-subtle text-[10px] font-bold text-[#444] uppercase tracking-widest flex items-center justify-between">
              <span>Brands</span>
              <button onClick={() => setIsBrandModalOpen(true)} className="text-[#666] hover:text-brand-orange">
                <Plus size={14} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto min-h-0 border-b border-border-subtle">
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrandId(brand.id);
                    setIsAdminView(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 flex justify-between items-center transition-all cursor-pointer",
                    selectedBrandId === brand.id && !isAdminView
                      ? "bg-[#1A1A1A] border-l-4 border-brand-orange text-brand-orange font-medium" 
                      : "text-[#888] hover:bg-[#151515] hover:text-[#bbb]"
                  )}
                >
                  <span className="truncate text-sm">{brand.name}</span>
                  <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-[#888]">
                    {content.filter(c => c.brandId === brand.id).length.toString().padStart(2, '0')}
                  </span>
                </button>
              ))}
              {brands.length === 0 && (
                <p className="text-[10px] text-[#444] px-4 py-3">No brands added.</p>
              )}
            </nav>

            <div className="flex flex-col h-1/3 bg-brand-black border-t border-border-subtle overflow-hidden">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-[10px] font-bold text-[#444] uppercase tracking-widest">Team</h2>
                <button onClick={() => setIsEmployeeModalOpen(true)} className="text-[#666] hover:text-brand-orange">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {employees.map(emp => (
                  <div key={emp.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#333] border border-[#444] flex items-center justify-center text-[10px] font-bold text-[#888] shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white uppercase truncate">{emp.name}</p>
                      <p className="text-[10px] text-[#666]">{emp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-brand-black overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-border-subtle flex items-center justify-between px-6 bg-surface shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center font-bold text-black text-xs">AF</div>
            <h1 className="text-sm font-semibold tracking-tight text-brand-orange uppercase">
              ALCHEMY FLOW <span className="text-[#666] font-normal">| Local Instance</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                if (isAdminAuthenticated) {
                  setIsAdminView(!isAdminView);
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className={cn(
                "text-xs uppercase font-bold tracking-widest flex items-center gap-2",
                isAdminView ? "text-brand-orange" : "text-[#888] hover:text-white"
              )}
            >
              <LayoutDashboard size={14} />
              Admin Dashboard
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-[#888] uppercase tracking-widest">Server Status</p>
              <p className="text-xs font-medium text-green-500 flex items-center justify-end gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 
                Local Network Active
              </p>
            </div>
            <button onClick={() => setIsBrandModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              New Brand
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {isAdminView ? (
            <AdminDashboard 
              employees={employees} 
              brands={brands} 
              content={content} 
            />
          ) : selectedBrandId ? (
            <div className="flex flex-col h-full">
              {/* Brand Sub-header */}
              <div className="p-6 flex flex-col md:flex-row md:items-end justify-between border-b border-border-subtle gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-light text-white tracking-tight">{selectedBrand?.name}</h2>
                    <span className="text-[10px] border border-brand-orange text-brand-orange px-2 py-0.5 rounded uppercase font-bold tracking-widest">Active Campaign</span>
                  </div>
                  <p className="text-[#666] text-xs">
                    Account Manager: <span className="text-[#CCC] font-medium">{kam?.name || 'Unassigned'}</span> | 
                    Month: <span className="text-[#CCC] font-medium">May 2026</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddRow} className="btn-primary h-9">
                    <PlusCircle size={16} />
                    Add Row
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto p-6">
                <WorkflowTable 
                  items={filteredContent} 
                  designers={designers}
                  onUpdate={handleUpdateContent}
                  onDelete={handleDeleteContent}
                />
              </div>

              {/* Summary Bar */}
              <div className="h-10 bg-surface border-t border-border-subtle flex items-center px-6 justify-between text-[10px] text-[#666] uppercase shrink-0">
                <div className="flex gap-8">
                  <p>Total Items: <span className="text-white font-bold">{filteredContent.length.toString().padStart(2, '0')}</span></p>
                  <p>Approved: <span className="text-green-500 font-bold">{filteredContent.filter(c => c.approvalStatus === 'Approved').length.toString().padStart(2, '0')}</span></p>
                  <p>Pending: <span className="text-brand-orange font-bold">{filteredContent.filter(c => c.approvalStatus === 'Pending').length.toString().padStart(2, '0')}</span></p>
                </div>
                <p className="hidden sm:block">© 2026 Alchemy Local Management v2.1.0</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-surface border border-border-subtle rounded-sm flex items-center justify-center text-brand-orange mb-6">
                <Briefcase size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Initialize Workstation</h2>
              <p className="text-[#666] text-sm max-w-sm mb-6">Connect to the local network and select a brand from the command center to begin managing workflows.</p>
              <button onClick={() => setIsBrandModalOpen(true)} className="btn-primary">
                <Plus size={18} />
                Connect New Brand
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdminLoginOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm bg-[#111] border border-zinc-800 rounded-sm p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 bg-brand-orange rounded flex items-center justify-center text-black mb-4">
                  <Settings size={24} />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Admin Access</h2>
                <p className="text-xs text-[#666] mt-1">Enter password to view performance data</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password" 
                  className="input-field text-center font-mono tracking-widest text-lg" 
                  placeholder="••••••••" 
                  autoFocus
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                />
                <button type="submit" className="btn-primary w-full justify-center h-12">Login to Dashboard</button>
                <button type="button" onClick={() => setIsAdminLoginOpen(false)} className="w-full text-xs text-[#444] uppercase font-bold tracking-widest hover:text-[#666]">Cancel</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Modals --- */}
      
      {/* Brand Modal */}
      <AnimatePresence>
        {isBrandModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsBrandModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-brand-dark border border-zinc-800 rounded-2xl overflow-hidden p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">New Brand</h2>
              <form onSubmit={handleAddBrand} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Brand Name</label>
                  <input 
                    className="input-field" 
                    placeholder="Acme Corp" 
                    value={newBrand.name}
                    onChange={e => setNewBrand({...newBrand, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Key Account Manager</label>
                  <select 
                    className="input-field"
                    value={newBrand.kamId}
                    onChange={e => setNewBrand({...newBrand, kamId: e.target.value})}
                  >
                    <option value="">Select Manager</option>
                    {kams.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                  {kams.length === 0 && (
                    <p className="text-[10px] text-brand-orange mt-2">Add a KAM employee first!</p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">Create Brand</button>
                  <button type="button" onClick={() => setIsBrandModalOpen(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Modal */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmployeeModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-brand-dark border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Add Team Member</h2>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Full Name</label>
                  <input className="input-field" placeholder="John Doe" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['KAM', 'Designer'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setNewEmployee({...newEmployee, role: role as Employee['role']})}
                        className={cn(
                          "py-3 rounded-lg border text-sm font-bold transition-all",
                          newEmployee.role === role ? "border-brand-orange bg-brand-orange/10 text-brand-orange" : "border-zinc-800 text-zinc-500"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">Add Member</button>
                  <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

