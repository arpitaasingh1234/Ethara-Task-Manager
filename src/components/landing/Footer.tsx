import { Layout, Globe, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Layout size={18} />
              </div>
              <span className="text-lg font-bold">EtharaSync</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              The next generation of task management for high-growth tech teams. Built for speed, security, and absolute focus.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors">
                <Mail size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          <div>
             <h4 className="font-bold mb-6">Product</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-600">Enterprise</a></li>
                <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6">Company</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6">Legal</h4>
             <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600">Security</a></li>
                <li><a href="#" className="hover:text-indigo-600">Compliance</a></li>
             </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© {currentYear} Ethara.ai. All rights reserved.</p>
          <div className="flex gap-8">
             <a href="#" className="hover:text-indigo-600">Status</a>
             <a href="#" className="hover:text-indigo-600">Cookies</a>
             <a href="#" className="hover:text-indigo-600">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
