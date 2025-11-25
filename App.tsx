import React, { useState, useRef } from 'react';
import { generateIdeas } from './services/api';
import { ScriptIdea, GenerationMode } from './types';
import { GENERATION_CONFIG } from './constants';
import { IdeaCard } from './components/IdeaCard';
import { DetailModal } from './components/DetailModal';
import { SavedIdeasModal } from './components/SavedIdeasModal';
import { Sparkles, Search, Loader2, AlertCircle, Github, Terminal, Briefcase, BookOpen, Code2, Database } from 'lucide-react';
import { LOCAL_API_ENDPOINT } from './constants';
// update
const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<GenerationMode>('python');
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ScriptIdea[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<ScriptIdea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [savedIdeas, setSavedIdeas] = useState<ScriptIdea[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const generatedIdeas = await generateIdeas(input, mode, count);
      if (generatedIdeas.length === 0) {
          setError("The model returned a response, but we couldn't parse any structured topics. Please try a different keyword.");
      } else {
          setIdeas(generatedIdeas);
          setTimeout(() => {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while contacting the AI.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (idea: ScriptIdea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIdea(null), 200);
  };

  const getModeIcon = (m: GenerationMode) => {
    switch (m) {
      case 'research': return <BookOpen size={18} />;
      case 'business': return <Briefcase size={18} />;
      case 'python': return <Code2 size={18} />;
    }
  };

  const fetchSavedIdeas = async () => {
    try {
      const res = await fetch(`${LOCAL_API_ENDPOINT}/ideas`);
      if (res.ok) {
        const data = await res.json();
        setSavedIdeas(data.ideas);
        setIsSavedModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to fetch saved ideas", e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-primary/30 selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              GenScript
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <button
               onClick={fetchSavedIdeas}
               className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
             >
               <Database size={16} />
               <span className="hidden sm:inline">Saved Ideas</span>
             </button>
             <div className="w-px h-4 bg-slate-700 hidden sm:block"></div>
             <div className="text-xs font-mono text-slate-500 hidden sm:block">
                Powered by Gemini Flash
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        
        {/* Hero / Search Section */}
        <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
           {/* Background decorative blobs */}
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

           <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl">
             Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Tailored Project Ideas</span>
           </h2>
           
           <p className="text-lg text-slate-400 max-w-2xl mb-8">
             {GENERATION_CONFIG[mode].description}
           </p>

           {/* Mode Selector */}
           <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
             {(Object.keys(GENERATION_CONFIG) as GenerationMode[]).map((key) => (
               <button
                 key={key}
                 onClick={() => setMode(key)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                   mode === key 
                     ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                     : 'text-slate-400 hover:text-white hover:bg-slate-800'
                 }`}
               >
                 {getModeIcon(key)}
                 {GENERATION_CONFIG[key].label}
               </button>
             ))}
           </div>

           <form onSubmit={handleGenerate} className="w-full max-w-2xl relative group flex flex-col gap-4">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

             {/* Search Input */}
             <div className="relative flex items-center bg-surface rounded-xl p-2 border border-slate-700 shadow-2xl z-10">
                <Search className="ml-4 text-slate-500" size={24} />
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Topic for ${GENERATION_CONFIG[mode].label}...`}
                  className="flex-grow bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-lg font-medium"
                  disabled={loading}
                />
             </div>

             {/* Controls Row */}
             <div className="flex items-center gap-4 z-10">
               <div className="flex-grow bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                 <span className="text-sm text-slate-400 whitespace-nowrap px-2">Count: {count}</span>
                 <input
                   type="range"
                   min="1"
                   max="50"
                   value={count}
                   onChange={(e) => setCount(Number(e.target.value))}
                   className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                   disabled={loading}
                 />
               </div>

               <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-600 disabled:text-slate-400 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 min-w-[140px] justify-center shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Generate
                      <Sparkles size={18} />
                    </>
                  )}
                </button>
             </div>

             {loading && (
               <p className="mt-2 text-sm text-slate-400 animate-pulse text-center z-10">
                 Generating {count} high-quality topics. Please wait...
               </p>
             )}
           </form>
        </section>

        {/* Results Section */}
        <div ref={resultSectionRef} className="flex-grow bg-slate-900/30 border-t border-slate-800/50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200">
                   <AlertCircle className="shrink-0 mt-0.5" />
                   <p>{error}</p>
                </div>
              )}

              {!loading && !error && ideas.length > 0 && (
                 <>
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-bold text-white">Generated Topics</h3>
                     <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-400 border border-slate-700">
                       {ideas.length} Results
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ideas.map((idea) => (
                        <IdeaCard 
                          key={idea.id} 
                          idea={idea} 
                          onViewDetails={openModal} 
                        />
                      ))}
                   </div>
                 </>
              )}

              {!loading && ideas.length === 0 && !error && (
                <div className="text-center py-20 text-slate-600">
                   <div className="inline-block p-6 rounded-full bg-slate-800/50 mb-4">
                      <Terminal size={48} className="text-slate-700" />
                   </div>
                   <p className="text-lg">Select a mode and start generating ideas.</p>
                </div>
              )}
           </div>
        </div>
      </main>

      <footer className="bg-slate-950 py-8 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
            <p>&copy; {new Date().getFullYear()} GenScript. Designed for Developers & Researchers.</p>
         </div>
      </footer>

      <DetailModal 
        isOpen={isModalOpen} 
        idea={selectedIdea} 
        onClose={closeModal} 
      />

      <SavedIdeasModal
        isOpen={isSavedModalOpen}
        ideas={savedIdeas}
        onClose={() => setIsSavedModalOpen(false)}
        onViewDetails={(idea) => {
          setIsSavedModalOpen(false);
          setTimeout(() => openModal(idea), 200);
        }}
      />

    </div>
  );
};

export default App;