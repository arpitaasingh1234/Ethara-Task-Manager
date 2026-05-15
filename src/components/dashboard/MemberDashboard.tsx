import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import ProjectCard from './ProjectCard';
import { 
  CheckSquare, 
  Clock, 
  Layout, 
  MessageCircle, 
  Calendar,
  AlertCircle,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, onSnapshot, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../contexts/AuthContext';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen for tasks assigned to current user
    const qTasks = query(collection(db, 'tasks'), where('assigneeId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tasks');
    });

    // Listen for projects user belongs to
    const qProjects = query(collection(db, 'projects'), where('memberIds', 'array-contains', user.uid));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    const unsubUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTasks();
      unsubProjects();
      unsubUsers();
    };
  }, [user]);

  const teamMembers = allUsers.filter(u => projects.some(p => p.memberIds?.includes(u.id)));

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const stats = [
    { label: 'My Tasks', value: tasks.filter(t => t.status !== 'done').length, icon: <CheckSquare className="text-indigo-500" /> },
    { label: 'Active Teams', value: projects.length, icon: <Layout className="text-purple-500" /> },
    { label: 'Due Soon', value: tasks.filter(t => t.status !== 'done' && t.dueDate).length, icon: <Clock className="text-amber-500" /> },
  ];

  const [activeTab, setActiveTab] = useState('tasks');
  const [taskTab, setTaskTab] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTasks = tasks.filter(t => (t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase())) && t.status === taskTab);
  const filteredTeamMembers = teamMembers.filter(u => u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderContent = () => {
    if (activeTab === 'teams') {
      return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-tight">My Teams</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                   <p className="text-sm text-slate-400">You are not part of any teams yet.</p>
                ) : (
                   projects.map(project => (
                      <ProjectCard 
                         key={project.id} 
                         project={project} 
                         taskCount={tasks.filter(t => t.projectId === project.id).length}
                      />
                   ))
                )}
             </div>
          </div>
      );
    }
    if (activeTab === 'team') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Organization Members ({filteredTeamMembers.length})</h3>
             </div>
             {filteredTeamMembers.length === 0 ? (
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                   <Users size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="font-bold text-slate-800 uppercase">No members found</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTeamMembers.map((u: any) => (
                      <div key={u.id} className="p-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                         <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} alt="" className="h-12 w-12 rounded-full border border-slate-200" />
                         <div className="overflow-hidden">
                            <p className="truncate font-bold text-slate-900">{u.displayName}</p>
                            <p className="truncate text-xs text-slate-500">{u.email}</p>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
       );
    }
    if (activeTab === 'analytics') {
       return (
          <div className="flex flex-col gap-8">
             <div className="mb-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">My Workspace</h1>
                <p className="text-slate-500 font-medium">Welcome back, {user?.displayName.split(' ')[0]}</p>
             </div>

             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-2">
               {stats.map((card, i) => (
                 <motion.div
                   key={card.label}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all"
                 >
                   <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-slate-50 p-3">
                         {card.icon}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
                         <h3 className="text-2xl font-black text-slate-900 leading-tight">{card.value}</h3>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </div>

             <div className="rounded-3xl border border-slate-100 bg-white p-8">
                <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-tight">Analytics</h3>
                <p className="text-slate-500 font-bold text-center py-12">Analytics view goes here.</p>
             </div>
          </div>
       );
    }
    if (activeTab === 'settings') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-tight">Settings</h3>
             <p className="text-slate-500 font-bold text-center py-12">Settings view goes here.</p>
          </div>
       );
    }
    if (activeTab === 'teams') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">My Teams</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                   <p className="text-sm text-slate-400 col-span-full text-center py-8">No teams found.</p>
                ) : (
                   filteredProjects.map(project => (
                      <ProjectCard 
                         key={project.id} 
                         project={project} 
                         taskCount={tasks.filter(t => t.projectId === project.id).length}
                      />
                   ))
                )}
             </div>
          </div>
       );
    }
    
    // Default to 'tasks'
    return (
       <div className="rounded-3xl border border-slate-100 bg-white p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-50 pb-4">
             <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tight">
               <CheckSquare size={20} className="text-indigo-500" />
               Currently Assigned Tasks
             </h3>
             <div className="flex bg-slate-50 p-1 rounded-xl">
               {[
                 { id: 'todo', label: 'To Do' },
                 { id: 'in-progress', label: 'In Progress' },
                 { id: 'done', label: 'Done' }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setTaskTab(tab.id)}
                   className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                     taskTab === tab.id 
                       ? 'bg-white text-indigo-600 shadow-sm' 
                       : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
             </div>
          </div>
          
          {filteredTasks.length === 0 ? (
             <div className="flex h-64 flex-col items-center justify-center text-center border-2 border-dashed border-slate-50 rounded-3xl">
                <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-200">
                   <CheckSquare size={32} />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-tight">No tasks found</p>
                <p className="text-sm text-slate-400 mt-2">{searchQuery ? 'Change your search filter.' : 'You\'re all caught up! Relax or check other teams.'}</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all border-l-4 border-l-indigo-600 flex flex-col"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          task.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                          task.priority === 'high' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-50 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                     </div>
                     <h4 className="font-bold text-slate-900 mb-2">{task.title}</h4>
                     <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-1">{task.description}</p>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                           <Calendar size={14} />
                           {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                        <select 
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-lg px-2 py-1 outline-none border-none focus:ring-0 cursor-pointer text-indigo-600 hover:bg-indigo-50"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">Working</option>
                          <option value="done">Done</option>
                        </select>
                     </div>
                  </motion.div>
                ))}
             </div>
          )}
       </div>
    );
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
