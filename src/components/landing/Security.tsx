import { ShieldCheck, Lock, Globe, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

export default function Security() {
  return (
    <section id="security" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-indigo-600/5 blur-2xl" />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="relative flex items-center justify-center h-96 w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-800"
                >
                   <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                            <ShieldCheck size={32} />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest opacity-50">Verified</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Lock size={32} />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest opacity-50">TLS 1.3</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                            <Globe size={32} />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest opacity-50">Global</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                            <Fingerprint size={32} />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest opacity-50">Auth</span>
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-base font-bold uppercase tracking-wider text-indigo-600 mb-4">Security At Scale</h2>
            <h3 className="text-4xl font-extrabold tracking-tight mb-6">Designed for Enterprise Security Standards.</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              EtharaSync uses the same underlying infrastructure that powers the world's largest companies. Your data is isolated, encrypted, and access-controlled by default.
            </p>

            <div className="space-y-6">
               {[
                 { title: "SSO Integration", text: "Seamless Google OAuth integration for instant onboarding." },
                 { title: "Domain Enforcement", text: "Automated rejection of any non-company email domains." },
                 { title: "RBAC Controls", text: "Multi-tiered role systems to ensure data isolation." }
               ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="mt-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{item.text}</p>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
