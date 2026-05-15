import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth, handleFirestoreError, OperationType } from '../../contexts/AuthContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: any;
}

export default function CreateProjectModal({ isOpen, onClose, projectToEdit }: CreateProjectModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setName(projectToEdit.name || '');
        setDescription(projectToEdit.description || '');
        setSelectedUsers(projectToEdit.memberIds || []);
        setTeamRoles(projectToEdit.teamRoles || {});
      } else {
        setName('');
        setDescription('');
        if (user?.uid) setSelectedUsers([user.uid]);
        setTeamRoles({});
      }

      const fetchUsers = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'users'));
          setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      };
      fetchUsers();
    }
  }, [isOpen, user, projectToEdit]);

  const toggleUser = (userId: string) => {
    if (userId === user?.uid) return; // Cannot toggle self
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
         const newRoles = { ...teamRoles };
         delete newRoles[userId];
         setTeamRoles(newRoles);
         return prev.filter(id => id !== userId);
      } else {
         setTeamRoles(roles => ({ ...roles, [userId]: 'Tasker' }));
         return [...prev, userId];
      }
    });
  };

  const updateRole = (userId: string, role: string) => {
    setTeamRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !user) return;
    setIsSubmitting(true);

    try {
      const finalTeamRoles: Record<string, string> = { ...teamRoles };
      if (!projectToEdit) {
        finalTeamRoles[user.uid] = 'Admin'; // Creator is Admin
      }

      if (projectToEdit) {
        await updateDoc(doc(db, 'projects', projectToEdit.id), {
          name,
          description,
          memberIds: selectedUsers,
          teamRoles: finalTeamRoles,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          name,
          description,
          ownerId: user.uid,
          memberIds: selectedUsers,
          teamRoles: finalTeamRoles,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (error) {
      handleFirestoreError(error, projectToEdit ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    } finally {
      setIsSubmitting(false);
    }
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{projectToEdit ? 'Edit Team' : 'Create New Team'}</h2>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Team Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Marketing Campaign"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this team about?"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wider">Select Members</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                  {users.map(u => (
                    <div 
                      key={u.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedUsers.includes(u.id) 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-slate-200 bg-white hover:border-indigo-200'
                      }`}
                    >
                      <div 
                        onClick={() => toggleUser(u.id)}
                        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border ${
                         selectedUsers.includes(u.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}
                      >
                         {selectedUsers.includes(u.id) && <Check size={14} />}
                      </div>
                      <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} alt="" className="h-8 w-8 rounded-full" />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-slate-900">{u.displayName}</p>
                        <p className="truncate text-[10px] text-slate-500">{u.email}</p>
                      </div>
                      {selectedUsers.includes(u.id) && u.id !== user?.uid && (
                        <select
                          value={teamRoles[u.id] || 'Tasker'}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className="text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-600"
                        >
                          <option value="Tasker">Tasker</option>
                          <option value="QR">QR</option>
                          <option value="QL">QL</option>
                          <option value="PL">PL</option>
                        </select>
                      )}
                      {u.id === user?.uid && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">Admin</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!name || isSubmitting}
                  type="submit"
                  className="flex-[2] rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="mx-auto animate-spin" /> : (projectToEdit ? 'Save Changes' : 'Create Team')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
