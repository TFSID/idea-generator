import React, { useState } from 'react';
import { ScriptIdea } from '../types';
import { X, Copy, Check, Cpu, BookOpen } from 'lucide-react';
// update
interface DetailModalProps {
  idea: ScriptIdea | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ idea, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !idea) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(idea.refinedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-surface border border-slate-600 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/50">
          <div>
            <span className="text-xs font-mono text-accent mb-1 block">{idea.category}</span>
            <h2 className="text-2xl font-bold text-white pr-8">{idea.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Description Section */}
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <BookOpen size={20} className="text-secondary" />
              <h3>Context & Case Study</h3>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-5 text-slate-300 leading-relaxed text-sm sm:text-base border border-slate-800">
              {idea.description}
            </div>
          </div>

          {/* Prompt Section */}
          <div>
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Cpu size={20} className="text-primary" />
                  <h3>R.C.T.F.M Refined Prompt</h3>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
             </div>

             <div className="relative group">
               <pre className="bg-slate-950 rounded-xl p-5 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
                 {idea.refinedPrompt}
               </pre>
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {/* Floating copy icon for quick access usually goes here, but we have the header button */}
               </div>
             </div>
             <p className="mt-2 text-xs text-slate-500">
               Copy this prompt into Gemini or Claude to generate the full production-ready Python code.
             </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-200 transition-colors"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};
