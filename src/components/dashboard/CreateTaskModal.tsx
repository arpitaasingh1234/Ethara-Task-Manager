import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Calendar, Flag, User } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { useAuth, handleFirestoreError, OperationType } from '../../contexts/AuthContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  taskToEdit?: any;
}

export default function CreateTaskModal({ isOpen, onClose, projectId: initialProjectId, taskToEdit }: CreateTaskModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || '');
        setDescription(taskToEdit.description || '');
        setProjectId(taskToEdit.projectId || '');
        setPriority(taskToEdit.priority || 'medium');
        setDueDate(taskToEdit.dueDate || '');
        setAssigneeId(taskToEdit.assigneeId || '');
      } else {
        resetForm();
        if (user?.uid && !assigneeId) {
          setAssigneeId(user.uid);
        }
      }
      fetchData();
    }
  }, [isOpen, taskToEdit, user?.uid]);

  const fetchData = async () => {
    try {
      const projectsSnap = await getDocs(collection(db, 'projects'));
      setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data for task modal", error);
    }
  };

  // Only show users from the selected team
  const availableUsers = projectId 
    ? users.filter(u => {
        const p = projects.find(proj => proj.id === projectId);
        return p?.memberIds?.includes(u.id);
      })
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId || !user) return;
    setIsSubmitting(true);

    try {
      if (taskToEdit) {
        await updateDoc(doc(db, 'tasks', taskToEdit.id), {
          title,
          description,
          projectId,
          priority,
          dueDate,
          assigneeId,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'tasks'), {
          title,
          description,
          projectId,
          priority,
          dueDate,
          assigneeId,
          status: 'todo',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      onClose();
      resetForm();
    } catch (error) {
      handleFirestoreError(error, taskToEdit ? OperationType.UPDATE : OperationType.CREATE, 'tasks');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setAssigneeId(user?.uid || '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Team</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="">Select a team</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Task Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design user profile landing"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed task requirements..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                    <div className="flex gap-2">
                       {['low', 'medium', 'high', 'urgent'].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${
                               priority === p 
                               ? 'border-indigo-600 bg-indigo-600/10 text-indigo-600' 
                               : 'border-slate-200 text-slate-400'
                            }`}
                          >
                             {p}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider text-indigo-500">Assign To</label>
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="">Unassigned</option>
                      {availableUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.displayName}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div>
                 <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
                 <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium"
                    />
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!title || !projectId || isSubmitting}
                  type="submit"
                  className="flex-[2] rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="mx-auto animate-spin" /> : (taskToEdit ? 'Save Changes' : 'Create Task')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
