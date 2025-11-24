import React from 'react';
import { Box, Code2, Database, Globe } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <Code2 size={64} className="text-indigo-400 relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Siap untuk Berinovasi?</h2>
      <p className="text-slate-400 max-w-md">
        Masukkan topik industri atau minat Anda di atas, dan AI akan menghasilkan 50 ide skrip Python praktis untuk Anda.
      </p>
      
      <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-lg">
        <div className="flex flex-col items-center p-4 rounded-lg bg-slate-900 border border-slate-800">
          <Database className="text-emerald-400 mb-2" size={24} />
          <span className="text-xs text-slate-400">Data Science</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-slate-900 border border-slate-800">
          <Globe className="text-blue-400 mb-2" size={24} />
          <span className="text-xs text-slate-400">Web Scraping</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-slate-900 border border-slate-800">
          <Box className="text-purple-400 mb-2" size={24} />
          <span className="text-xs text-slate-400">Automation</span>
        </div>
      </div>
    </div>
  );
};