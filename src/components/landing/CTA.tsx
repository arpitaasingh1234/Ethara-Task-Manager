import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CTA() {
  const { login } = useAuth();
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 px-8 py-24 text-center text-white shadow-2xl shadow-indigo-200">
          {/* Subtle noise/texture effect would go here, using simple contrast for now */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-12 transform translate-x-1/4" />

          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
            <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
              Ready to <span className="text-indigo-200">Accelerate</span> your Team?
            </h2>
            <p className="mb-14 max-w-2xl text-xl text-indigo-50 font-medium leading-relaxed opacity-90">
              Join the high-efficiency teams already using EtharaSync to manage complex operations with absolute clarity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
               <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={login}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-xl font-black text-indigo-600 shadow-2xl shadow-black/10 hover:bg-slate-50 transition-all w-full sm:w-auto uppercase tracking-wider"
              >
                Sign In With Google
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <button className="flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm hover:opacity-80 transition-opacity">
                 <Mail size={18} />
                 Contact Sales
              </button>
            </div>
            
            <div className="mt-12 pt-12 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-center gap-8 opacity-60">
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Corporate Domain Locked</span>
               <span className="hidden sm:block h-1 w-1 rounded-full bg-white/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">End-to-End Encryption</span>
               <span className="hidden sm:block h-1 w-1 rounded-full bg-white/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">24/7 Priority Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
