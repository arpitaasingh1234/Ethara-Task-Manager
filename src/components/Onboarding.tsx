import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth, Role } from '../contexts/AuthContext';

export default function Onboarding() {
  const { user, updateRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      await updateRole(selectedRole);
    } catch (error) {
      console.error("Failed to update role", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-slate-900 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-2xl text-center"
      >
        <div className="mb-12 flex flex-col items-center">
           <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6">
              <Shield size={28} />
           </div>
           <h1 className="text-4xl font-black tracking-tight mb-4">Initialize Identity</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
             Select your primary workflow role to configure your EtharaSync workspace.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Admin Role */}
          <button
            onClick={() => setSelectedRole(Role.ADMIN)}
            className={`group flex flex-col items-center p-10 rounded-[2.5rem] border-2 transition-all text-center ${
              selectedRole === Role.ADMIN 
                ? 'border-indigo-600 bg-indigo-50 shadow-2xl shadow-indigo-100' 
                : 'border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
              selectedRole === Role.ADMIN ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-50 text-slate-400'
            }`}>
              <Shield size={40} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Admin</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Orchestrate projects, manage personnel, and access deep organization analytics.
            </p>
          </button>

          {/* Member Role */}
          <button
            onClick={() => setSelectedRole(Role.MEMBER)}
            className={`group flex flex-col items-center p-10 rounded-[2.5rem] border-2 transition-all text-center ${
              selectedRole === Role.MEMBER 
                ? 'border-emerald-500 bg-emerald-50 shadow-2xl shadow-emerald-100' 
                : 'border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
              selectedRole === Role.MEMBER ? 'bg-emerald-500 text-white -rotate-6' : 'bg-slate-50 text-slate-400'
            }`}>
              <User size={40} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Member</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Track assignments, update operational progress, and collaborate in real-time.
            </p>
          </button>
        </div>

        <motion.button
          disabled={!selectedRole || isSubmitting}
          whileHover={{ scale: selectedRole && !isSubmitting ? 1.02 : 1, y: selectedRole && !isSubmitting ? -4 : 0 }}
          whileTap={{ scale: selectedRole && !isSubmitting ? 0.98 : 1 }}
          onClick={handleSubmit}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-6 text-xl font-black transition-all uppercase tracking-widest shadow-2xl ${
            selectedRole && !isSubmitting
              ? 'bg-indigo-600 text-white shadow-indigo-200'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
               Finalize Setup
              <ArrowRight size={24} />
            </>
          )}
        </motion.button>
        
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
           <span>Secured Session</span>
           <div className="h-1 w-1 rounded-full bg-slate-200" />
           <span>{user?.email}</span>
        </div>
      </motion.div>
    </div>
  );
}
