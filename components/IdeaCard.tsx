import React from 'react';
import { ScriptIdea } from '../types';
import { Terminal, FileCode, ArrowRight, DollarSign, Activity } from 'lucide-react';

interface IdeaCardProps {
  idea: ScriptIdea;
  onViewDetails: (idea: ScriptIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onViewDetails }) => {
  return (
    <div className="group relative bg-surface border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full">
      
      {/* Category Badge */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-primary border border-slate-700">
           <Terminal size={12} className="mr-1.5" />
           {idea.category}
        </span>
        {idea.moneyValue && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
             <DollarSign size={10} className="mr-1" />
             Valuable
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-100 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {idea.title}
      </h3>

      {/* Description Preview */}
      <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
        {idea.description}
      </p>

      {/* Action Area */}
      <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center">
         <div className="flex items-center text-xs text-slate-500">
            <FileCode size={14} className="mr-1" />
            Topic Idea
         </div>
         
         <button 
           onClick={() => onViewDetails(idea)}
           className="flex items-center gap-2 text-sm font-medium text-white hover:text-accent transition-colors"
         >
           View Details
           <ArrowRight size={16} />
         </button>
      </div>
      
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};