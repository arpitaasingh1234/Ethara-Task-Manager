import React, { useState } from 'react';
import { useAuth, Role } from '../../contexts/AuthContext';
import CreateProjectModal from './CreateProjectModal';
import { 
  Layout as LayoutIcon, 
  CheckSquare, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function DashboardLayout({ children, activeTab = 'teams', onTabChange, searchQuery = '', onSearchChange }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutIcon size={20} />, label: 'Teams', id: 'teams' },
    { icon: <CheckSquare size={20} />, label: 'My Tasks', id: 'tasks' },
    { icon: <Users size={20} />, label: 'Members', id: 'team' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', id: 'analytics' },
    { icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-950">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-r border-slate-200 bg-white"
          >
            <div className="flex h-16 items-center px-6 gap-2 border-b border-slate-100">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                 <LayoutIcon size={18} />
               </div>
               <span className="text-lg font-bold tracking-tight">EtharaSync</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
               <div className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onTabChange?.(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === item.id 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="border-t border-slate-100 p-4">
               <div className="flex items-center gap-3 rounded-xl p-3 bg-slate-50">
                  <img src={user?.photoURL} alt="" className="h-10 w-10 rounded-full border border-slate-200" />
                  <div className="flex-1 overflow-hidden">
                     <p className="truncate text-sm font-bold text-slate-900">{user?.displayName}</p>
                     <p className="truncate text-[10px] text-slate-500 uppercase font-black tracking-widest">{user?.role}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
             >
               <Menu size={20} />
             </button>
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search teams or tasks..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-64 rounded-xl border border-slate-100 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
             {user?.role === Role.ADMIN && (
               <button 
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
               >
                  <Plus size={18} />
                  <span className="hidden sm:inline">New Team</span>
               </button>
             )}
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
           {children}
        </main>
        
        <CreateProjectModal 
          isOpen={isCreateProjectModalOpen} 
          onClose={() => setIsCreateProjectModalOpen(false)} 
        />
      </div>
    </div>
  );
}
