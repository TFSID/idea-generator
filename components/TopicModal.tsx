import React, { useState } from 'react';
import { Topic } from '../types';
import { X, Copy, Check, Terminal, FileText, BrainCircuit } from 'lucide-react';

interface TopicModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({ topic, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !topic) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(topic.refinedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <span className="inline-block px-2 py-1 mb-2 text-xs font-medium tracking-wider text-indigo-400 border border-indigo-500/30 rounded uppercase bg-indigo-500/10">
              {topic.category}
            </span>
            <h2 className="text-2xl font-bold text-white leading-tight">{topic.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Description Section */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <FileText size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wide">Research & Context</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg border-l-4 border-slate-700 pl-4">
              {topic.description}
            </p>
          </section>

          {/* Refined Prompt Section */}
          <section className="bg-black/40 rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 text-purple-400">
                <BrainCircuit size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wide">R.C.T.F.M Refined Prompt</h3>
              </div>
              <button 
                onClick={handleCopyPrompt}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>
            <div className="p-4 bg-slate-950/50">
              <pre className="font-mono text-sm text-slate-400 whitespace-pre-wrap overflow-x-auto p-2">
                {topic.refinedPrompt}
              </pre>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
             <div className="flex items-center gap-2 mb-3 text-blue-400">
              <Terminal size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wide">Suggested Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {topic.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 text-sm text-slate-300 bg-slate-800 rounded-full border border-slate-700">
                  {tag}
                </span>
              ))}
              <span className={`px-3 py-1 text-sm rounded-full border ${
                topic.complexity === 'Beginner' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' :
                topic.complexity === 'Intermediate' ? 'text-blue-400 border-blue-900 bg-blue-900/20' :
                'text-purple-400 border-purple-900 bg-purple-900/20'
              }`}>
                {topic.complexity}
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};