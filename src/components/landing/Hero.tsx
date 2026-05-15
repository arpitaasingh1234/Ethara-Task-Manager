import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Hero() {
  const { login } = useAuth();
  return (
    <section className="relative overflow-hidden py-24 lg:py-40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Organizational Project Management
            </div>
            
            <h1 className="mb-8 text-6xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-7xl">
              Sync your team, <br />
              <span className="text-indigo-600">master your projects.</span>
            </h1>
            
            <p className="mb-10 text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
              A clean, professional workspace built for Ethara.ai. Manage tasks, track progress, and collaborate seamlessly across teams.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={login}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all sm:w-auto"
              >
                Sign In with Google
                <ArrowRight size={22} />
              </motion.button>
              
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-10 py-5 text-lg font-bold text-slate-900 hover:bg-slate-50 transition-all sm:w-auto">
                Live Demo
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-slate-100 pt-16">
              {['Role-Based Access', 'Real-time Sync', 'Enterprise Security'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
