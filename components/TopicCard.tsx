import React from 'react';
import { Topic } from '../types';
import { Terminal, Copy, Check, ArrowRight } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  index: number;
  onViewDetails: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, index, onViewDetails }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `**${topic.title}**\n${topic.description}\n\nPROMPT:\n${topic.refinedPrompt}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Advanced': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
          title="Copy Idea & Prompt"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">
          {index + 1}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getComplexityColor(topic.complexity)}`}>
          {topic.complexity}
        </span>
        {topic.category && (
             <span className="ml-auto text-xs text-slate-500 truncate max-w-[120px]">
             {topic.category}
           </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-100 mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
        {topic.title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
        {topic.description}
      </p>

      <div className="pt-4 mt-auto border-t border-slate-800/50 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 h-6 overflow-hidden">
          {topic.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              <Terminal size={10} />
              {tag}
            </span>
          ))}
        </div>
        
        <button 
          onClick={() => onViewDetails(topic)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg transition-all group-hover:translate-x-1 duration-200"
        >
          Lihat Detail & Prompt
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};