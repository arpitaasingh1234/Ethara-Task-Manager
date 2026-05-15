import React from 'react';
import { Layout, Users, Edit, CheckSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectCardProps {
  project: any;
  taskCount?: number;
  onEditClick?: (project: any) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, taskCount = 0, onEditClick }) => {
  const { user } = useAuth();
  const myRole = user && project.teamRoles ? project.teamRoles[user.uid] : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
              <Layout size={24} />
           </div>
           {myRole && (
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <ShieldCheck size={14} className="text-indigo-500" />
                {myRole}
             </div>
           )}
        </div>
        {onEditClick && (
          <button 
            onClick={() => onEditClick(project)}
            className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Edit size={20} />
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 tracking-tight text-slate-900">{project.name}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10 leading-relaxed">{project.description || 'No description provided.'}</p>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
         <div className="flex -space-x-2">
            {project.memberIds?.slice(0, 3).map((id: string) => (
              <div key={id} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100" />
            ))}
            {project.memberIds?.length > 3 && (
               <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-50 text-[10px] font-black text-slate-500">
                  +{project.memberIds.length - 3}
               </div>
            )}
         </div>

         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
               <CheckSquare size={14} className="text-emerald-500" />
               {taskCount}
            </div>
            <div className="flex items-center gap-1.5">
               <Users size={14} className="text-indigo-500" />
               {project.memberIds?.length || 0}
            </div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
         <div className="h-full bg-indigo-600 w-1/3 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
