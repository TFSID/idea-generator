import React from 'react';
import { ScriptIdea } from '../types';
import { X, Calendar } from 'lucide-react';

interface SavedIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: ScriptIdea[];
}

export const SavedIdeasModal: React.FC<SavedIdeasModalProps> = ({ isOpen, onClose, ideas }) => {
  if (!isOpen) return null;

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
               {ideas.map((idea, idx) => (
                 <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary border border-primary/20">
                         {idea.category}
                       </span>
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                          {/* We don't have exact timestamp in types but backend has it.
                              For now just showing static icon or nothing.
                              If we fetch from backend, we might get createdAt. */}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{idea.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{idea.description}</p>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
