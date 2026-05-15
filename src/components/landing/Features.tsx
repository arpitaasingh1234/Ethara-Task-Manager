import React from 'react';
import { Users, Shield, Zap, BarChart3, Database, Workflow as WorkflowIcon } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: <Users className="text-indigo-600" />,
    title: "Team Collaboration",
    description: "Collaborate seamlessly with your team in high-efficiency workspaces tailored for your projects."
  },
  {
    icon: <Shield className="text-purple-600" />,
    title: "Role-Based Access",
    description: "Secure your project data with granular permissions for Admins and Members."
  },
  {
    icon: <Zap className="text-yellow-600" />,
    title: "Real-Time Updates",
    description: "Stay in sync with instant updates across all devices. No manual refreshes needed."
  },
  {
    icon: <BarChart3 className="text-green-600" />,
    title: "Advanced Analytics",
    description: "Track team productivity and project health with beautiful, data-driven charts."
  },
  {
    icon: <Database className="text-blue-600" />,
    title: "No Mock Data",
    description: "Experience a true production system driven by real database records only."
  },
  {
    icon: <WorkflowIcon className="text-pink-600" />,
    title: "Project Workflows",
    description: "Customizable Kanban boards and task statuses to match your team's unique workflow."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 bg-indigo-50 w-fit mx-auto px-4 py-1.5 rounded-full">Core Capabilities</h2>
          <p className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900">
            Professional tools for <span className="text-indigo-600 italic">high-output</span> teams.
          </p>
          <p className="mt-6 text-lg text-slate-500 font-medium leading-relaxed">
            Everything you need to orchestrate complex projects without the unnecessary overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
              className="group relative"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                {React.cloneElement(feature.icon as React.ReactElement, { 
                  className: "w-8 h-8 transition-colors duration-300",
                  style: { color: 'currentColor' } 
                })}
              </div>
              <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                {feature.title}
                <div className="h-px flex-1 bg-slate-100 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
