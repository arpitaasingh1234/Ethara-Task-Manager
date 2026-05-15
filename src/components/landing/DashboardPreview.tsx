import { motion } from 'motion/react';
import { Layout, CheckSquare, BarChart2, Users2 } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-indigo-600">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center text-center text-white mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Experience the Interface</h2>
          <p className="max-w-2xl text-lg text-indigo-100 opacity-90">
            A minimalist, powerful dashboard designed to reduce cognitive load while providing total project visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
             <motion.div 
               whileHover={{ scale: 1.01 }}
               className="h-full rounded-2xl bg-white dark:bg-slate-900 border border-indigo-400/20 shadow-2xl overflow-hidden"
             >
                {/* Simulated Kanban UI */}
                <div className="h-14 border-b flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-800/50">
                   <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                      <Layout size={18} className="text-indigo-600" />
                      Product Launch 2026
                   </div>
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                         <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-200" />
                      ))}
                      <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
                   </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                   {['To Do', 'In Progress', 'Done'].map((col, idx) => (
                      <div key={col} className="flex flex-col gap-4">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{col}</span>
                            <span className="h-5 w-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">{idx + 2}</span>
                         </div>
                         {[1, 2].map(i => (
                            <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm">
                               <div className="w-1/4 h-1.5 bg-indigo-500 rounded mb-3"></div>
                               <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                               <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-700/50 rounded mb-4"></div>
                               <div className="flex justify-between items-center">
                                  <div className="h-6 w-16 bg-slate-50 dark:bg-slate-700 rounded-full"></div>
                                  <div className="h-6 w-6 rounded-full bg-indigo-100"></div>
                               </div>
                            </div>
                         ))}
                      </div>
                   ))}
                </div>
             </motion.div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="flex-1 rounded-2xl bg-indigo-700/50 border border-white/10 backdrop-blur-sm p-8 text-white">
                <BarChart2 className="mb-6 h-10 w-10 text-indigo-300" />
                <h3 className="text-2xl font-bold mb-3">Analytics First</h3>
                <p className="text-indigo-100 opacity-80 leading-relaxed">
                   Real-time productivity insights. Track velocity, completion rates, and team health without running complex reports.
                </p>
             </div>
             <div className="flex-1 rounded-2xl bg-indigo-800/80 border border-white/10 backdrop-blur-sm p-8 text-white">
                <Users2 className="mb-6 h-10 w-10 text-indigo-300" />
                <h3 className="text-2xl font-bold mb-3">Team Health</h3>
                <p className="text-indigo-100 opacity-80 leading-relaxed">
                   Monitor workload distribution to prevent burnout and ensure task alignment across all departments.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
