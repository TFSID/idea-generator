import React, { useState, useRef } from 'react';
import { generateIdeas } from './services/api';
import { ScriptIdea } from './types';
import { IdeaCard } from './components/IdeaCard';
import { DetailModal } from './components/DetailModal';
import { Sparkles, Search, Loader2, AlertCircle, Github, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ScriptIdea[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<ScriptIdea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const generatedIdeas = await generateIdeas(input);
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
    // Small delay to clear state after animation if we had one, but React state update is fine
    setTimeout(() => setSelectedIdea(null), 200);
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
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
             Powered by Gemini Flash
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        
        {/* Hero / Search Section */}
        <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
           {/* Background decorative blobs */}
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

           <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl">
             Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Python Project Ideas</span> with Case Studies
           </h2>
           <p className="text-lg text-slate-400 max-w-2xl mb-10">
             Enter a domain or topic (e.g., "Finance", "IoT", "Healthcare") and get 50 specialized project topics complete with R.C.T.F.M structured prompts for AI coding assistants.
           </p>

           <form onSubmit={handleGenerate} className="w-full max-w-2xl relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
             <div className="relative flex items-center bg-surface rounded-xl p-2 border border-slate-700 shadow-2xl">
                <Search className="ml-4 text-slate-500" size={24} />
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you want to build? (e.g., 'Stock Analysis', 'Web Scraper')"
                  className="flex-grow bg-transparent border-none outline-none text-white placeholder-slate-500 px-4 py-3 text-lg font-medium"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-600 disabled:text-slate-400 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating...
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
               <p className="mt-4 text-sm text-slate-400 animate-pulse">
                 Generating 50 detailed topics. This may take up to 30 seconds...
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
                       {ideas.length} Results Found
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
                   <p className="text-lg">Ready to generate ideas.</p>
                </div>
              )}
           </div>
        </div>
      </main>

      <footer className="bg-slate-950 py-8 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
            <p>&copy; {new Date().getFullYear()} GenScript. Designed for Developers.</p>
         </div>
      </footer>

      <DetailModal 
        isOpen={isModalOpen} 
        idea={selectedIdea} 
        onClose={closeModal} 
      />

    </div>
  );
};

export default App;