import { Moon, Sun, Layout, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { login } = useAuth();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Layout size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Ethara<span className="text-indigo-600">Sync</span>
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Workflow</a>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all"
          >
            <LogIn size={18} />
            Sign In
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
