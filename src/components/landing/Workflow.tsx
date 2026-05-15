import { motion } from 'motion/react';

const steps = [
  {
    number: "01",
    title: "Domain Verification",
    description: "Secure one-click sign in with your @ethara.ai Google account."
  },
  {
    number: "02",
    title: "Assign Role",
    description: "Choose your role on first login to unlock your personalized workspace."
  },
  {
    number: "03",
    title: "Create & Join",
    description: "Launch new projects or join existing teams as an invited member."
  },
  {
    number: "04",
    title: "Manage & Track",
    description: "Assign tasks, update status, and track progress in real-time."
  }
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">The Protocol</h2>
            <p className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900 leading-[1.1]">
              Engineered for <span className="text-slate-400">minimal</span> friction.
            </p>
          </div>
          <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
            A frictionless onboarding experience designed for teams that value speed. From zero to fully operational in under 30 seconds.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-[32px] left-0 h-px w-full bg-slate-200 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="flex flex-col items-start"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-indigo-600 text-xl font-black text-indigo-600 shadow-xl shadow-indigo-100 relative z-20">
                  {step.number}
                </div>
                <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
