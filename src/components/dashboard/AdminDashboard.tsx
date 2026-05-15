import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import ProjectCard from './ProjectCard';
import CreateTaskModal from './CreateTaskModal';
import CreateProjectModal from './CreateProjectModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight,
  CheckSquare,
  Users,
  Settings,
  Edit
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    members: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for all projects
    const qProjects = query(collection(db, 'projects'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setStats(prev => ({ ...prev, totalProjects: snapshot.size }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    // Listen for all tasks
    const qTasks = query(collection(db, 'tasks'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
      setStats(prev => ({ 
        ...prev, 
        totalTasks: snapshot.size,
        completedTasks: data.filter(t => (t as any).status === 'done').length,
        inProgressTasks: data.filter(t => (t as any).status === 'in-progress').length,
        todoTasks: data.filter(t => (t as any).status === 'todo').length
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tasks');
    });

    // Listen for all users
    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStats(prev => ({ ...prev, members: snapshot.size }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => {
      unsubProjects();
      unsubTasks();
      unsubUsers();
    };
  }, []);

  const statCards = [
    { label: 'Active Teams', value: stats.totalProjects, icon: <BarChart3 className="text-indigo-500" /> },
    { label: 'Pending Tasks', value: stats.todoTasks + stats.inProgressTasks, icon: <Clock className="text-amber-500" /> },
    { label: 'Completed', value: stats.completedTasks, icon: <CheckCircle2 className="text-emerald-500" /> },
    { label: 'Total Members', value: stats.members, icon: <PlusCircle className="text-blue-500" /> },
  ];

  const computeChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, tasks: 0 }));
    
    tasks.forEach(task => {
      if (task.createdAt) {
         const date = typeof task.createdAt.toDate === 'function' ? task.createdAt.toDate() : new Date(task.createdAt);
         const dayName = days[date.getDay()];
         const dayIndex = data.findIndex(d => d.name === dayName);
         if (dayIndex !== -1) {
            data[dayIndex].tasks += 1;
         }
      }
    });

    const today = new Date().getDay();
    const orderedData = [];
    for (let i = 6; i >= 0; i--) {
      const idx = (today - i + 7) % 7;
      orderedData.push(data[idx]);
    }
    return orderedData;
  };

  const chartData = computeChartData();
  const [activeTab, setActiveTab] = useState('teams');
  const [taskTab, setTaskTab] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProjects = projects.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTasks = tasks.filter(t => (t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase())) && t.status === taskTab);
  const filteredUsers = usersList.filter(u => u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderContent = () => {
    if (activeTab === 'analytics') {
      return (
         <div className="flex flex-col gap-8">
            <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
               <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Organization Overview</h1>
                  <p className="text-slate-500 font-medium">Real-time performance metrics</p>
               </div>
               <div className="flex gap-3">
                  <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                     Download Report
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-2">
               {statCards.map((card, i) => (
                 <motion.div
                   key={card.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl hover:border-indigo-100"
                 >
                   <div className="flex items-center justify-between mb-6">
                      <div className="rounded-xl bg-slate-50 p-3">
                         {card.icon}
                      </div>
                   </div>
                   <p className="mb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{card.label}</p>
                   <h3 className="text-4xl font-black text-slate-900 leading-none mt-2">{card.value}</h3>
                 </motion.div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
               <div className="col-span-1 lg:col-span-12 rounded-3xl border border-indigo-50 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4">Weekly Productivity</h3>
                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                           <defs>
                              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                           <Tooltip 
                              contentStyle={{ 
                                 backgroundColor: '#fff', 
                                 border: '1px solid #f1f5f9', 
                                 borderRadius: '16px',
                                 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                                 fontSize: '12px'
                              }} 
                           />
                           <Area type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTasks)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
         </div>
      );
    }
    
    if (activeTab === 'team') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Organization Members ({filteredUsers.length})</h3>
             </div>
             {filteredUsers.length === 0 ? (
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                   <Users size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="font-bold text-slate-800 uppercase">No members found</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredUsers.map((u: any) => (
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
    
    if (activeTab === 'tasks') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-50 pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">All Tasks</h3>
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
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                   <CheckSquare size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="font-bold text-slate-800 uppercase">No tasks found</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTasks.map(task => (
                      <div key={task.id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all relative flex flex-col group border-l-4 border-l-indigo-600">
                         <button 
                            onClick={() => handleEditTask(task)}
                            className="absolute top-4 right-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600"
                         >
                            <Edit size={16} />
                         </button>
                         <h4 className="font-bold text-slate-900 mb-2 pr-6">{task.title}</h4>
                         <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">{task.description}</p>
                         <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-50 mt-auto">
                            <select 
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                              className="text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-lg px-2 py-1 outline-none border-none focus:ring-0 cursor-pointer text-indigo-600 hover:bg-indigo-50"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">Working</option>
                              <option value="done">Done</option>
                            </select>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                              task.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                              task.priority === 'high' ? 'bg-amber-50 text-amber-600' :
                              'bg-slate-50 text-slate-400'
                            }`}>
                              {task.priority || 'medium'}
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
       );
    }

    if (activeTab === 'settings') {
       return (
          <div className="rounded-3xl border border-slate-100 bg-white p-8">
             <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4">Settings</h3>
             <div className="text-center text-slate-500 py-12">
                <Settings size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-bold">Organization settings go here.</p>
             </div>
          </div>
       );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="col-span-1 lg:col-span-8 rounded-3xl border border-slate-100 bg-white p-8">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Teams</h3>
               <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full px-4 py-1.5 transition-all">View All</button>
            </div>
            
            {filteredProjects.length === 0 ? (
               <div className="flex h-64 flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-200">
                     <PlusCircle size={48} />
                  </div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">No teams found</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs">{searchQuery ? 'Try matching a different name.' : 'Get started by creating your first team.'}</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      taskCount={tasks.filter(t => t.projectId === project.id).length}
                      onEditClick={handleEditProject}
                    />
                  ))}
               </div>
            )}
         </div>
         
         <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 flex-1">
               <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-tight">System Alerts</h3>
            <div className="space-y-4">
               <div className="flex gap-4 p-5 rounded-2xl bg-red-50 text-red-600 border border-red-100">
                  <AlertCircle size={20} className="shrink-0" />
                  <div>
                     <p className="text-xs font-black uppercase tracking-widest">Domain Policy</p>
                     <p className="text-sm opacity-90 mt-1 font-medium italic">Enforcing @ethara.ai domain policy.</p>
                  </div>
               </div>

               {stats.todoTasks > 10 && (
                  <div className="flex gap-4 p-5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                     <Clock size={20} className="shrink-0" />
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest">Backlog Alert</p>
                        <p className="text-sm opacity-90 mt-1 font-medium">There are {stats.todoTasks} pending tasks.</p>
                     </div>
                  </div>
               )}

               <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 size={20} className="shrink-0" />
                  <div>
                     <p className="text-xs font-black uppercase tracking-widest">Core Status</p>
                     <p className="text-sm opacity-90 mt-1 font-medium">All systems operational.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
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
      <div className="mb-6 flex justify-end gap-3">
         <button 
           onClick={() => {
             setSelectedProject(null);
             setIsProjectModalOpen(true);
           }}
           className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
         >
            Create Team
         </button>
         <button 
           onClick={() => {
             setSelectedTask(null);
             setIsTaskModalOpen(true);
           }}
           className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
         >
            Create Task
         </button>
      </div>

      {renderContent()}

      <CreateTaskModal 
         isOpen={isTaskModalOpen} 
         onClose={() => setIsTaskModalOpen(false)} 
         taskToEdit={selectedTask}
      />
      <CreateProjectModal
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         projectToEdit={selectedProject}
      />
    </DashboardLayout>
  );
}
