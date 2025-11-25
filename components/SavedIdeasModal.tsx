import React from 'react';
import { ScriptIdea } from '../types';
import { X, DollarSign, Activity, Terminal, BookOpen, Briefcase, Code2, Scroll } from 'lucide-react';

interface SavedIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: ScriptIdea[];
  onViewDetails?: (idea: ScriptIdea) => void;
}

export const SavedIdeasModal: React.FC<SavedIdeasModalProps> = ({ isOpen, onClose, ideas, onViewDetails }) => {
  if (!isOpen) return null;

  // Helper to determine mode icon (copied logic for consistency)
  const getModeIcon = (id: string) => {
    const parts = id.split('-');
    const mode = parts.length >= 2 ? parts[1] : 'unknown';
    switch (mode) {
      case 'research': return BookOpen;
      case 'business': return Briefcase;
      case 'python': return Code2;
      default: return Scroll;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Saved Ideas</h2>
            <p className="text-slate-400 text-sm mt-1">History of generated topics stored in local database.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
           {ideas.length === 0 ? (
             <div className="text-center py-20 text-slate-500">
               <p>No saved ideas found.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {ideas.map((idea, idx) => {
                 const ModeIcon = getModeIcon(idea.id);

                 return (
                   <div
                      key={idx}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-primary/40 hover:bg-slate-800 transition-all cursor-pointer group shadow-sm"
                      onClick={() => onViewDetails?.(idea)}
                   >
                      <div className="flex flex-col gap-3">
                         {/* Badges Row */}
                         <div className="flex flex-wrap items-center gap-2">

                           {/* Category Badge */}
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/20">
                             <ModeIcon size={12} className="mr-1.5 opacity-70" />
                             {idea.category}
                           </span>

                           {/* Money Value Badge */}
                           {idea.moneyValue && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                               <DollarSign size={10} className="mr-1" />
                               {idea.moneyValue}
                             </span>
                           )}

                           {/* Effort Value Badge */}
                           {idea.effortValue && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                               <Activity size={10} className="mr-1" />
                               {idea.effortValue}
                             </span>
                           )}
                         </div>

                         {/* Title & Desc */}
                         <div>
                           <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                             {idea.title}
                           </h3>
                           <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                             {idea.description}
                           </p>
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
