
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { hskData } from '../data';

interface HomeProps {
  setView: (view: AppView) => void;
  setLevel: (level: number) => void;
  hskDataLength: number;
}

const Home: React.FC<HomeProps> = ({ setView, setLevel }) => {
  const stats = useMemo(() => {
    const l1 = hskData.filter(i => i.level === 1).length;
    const l2 = hskData.filter(i => i.level === 2).length;
    return { l1, l2, total: hskData.length };
  }, []);

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <header className="relative py-16 px-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black mb-4 leading-tight">Mandarin Master Website</h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Professional Chinese learning platform. Master HSK 1-9 with Lao & English support.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setView(AppView.VOCABULARY)}
              className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <i className="fas fa-play"></i>
              Explore Vocabulary
            </button>
            <button 
              onClick={() => setView(AppView.EXAM)}
              className="bg-indigo-500/30 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500/50 transition-all"
            >
              Mock Exam
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 translate-x-1/4 translate-y-1/4">
          <i className="fas fa-graduation-cap text-[30rem]"></i>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-2xl font-bold text-gray-800">New HSK 3.0 Progress</h3>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
            Database: {stats.total} Words
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((lvl) => {
            const count = lvl === 1 ? stats.l1 : lvl === 2 ? stats.l2 : 0;
            // Target values based on New HSK 3.0 standards
            const target = lvl === 1 ? 500 : lvl === 2 ? 772 : 1000;
            const progress = Math.min(100, Math.round((count / target) * 100));

            return (
              <div 
                key={lvl}
                onClick={() => { if(lvl <= 2) { setLevel(lvl); setView(AppView.VOCABULARY); } }}
                className={`p-8 rounded-3xl border transition-all cursor-pointer group flex flex-col h-full ${
                  lvl <= 2 
                  ? 'bg-white border-gray-100 hover:border-indigo-500 hover:shadow-xl' 
                  : 'bg-gray-50 border-gray-100 opacity-60 grayscale cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                    lvl === 1 ? 'bg-green-100 text-green-600' : lvl === 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {lvl}
                  </div>
                  {lvl <= 2 && (
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-300 uppercase">Status</p>
                      <p className="text-xs font-bold text-green-500">Live</p>
                    </div>
                  )}
                </div>
                
                <h4 className="text-xl font-black text-gray-800 mb-2">HSK Level {lvl}</h4>
                <p className="text-gray-500 text-sm mb-8 flex-grow">
                  {lvl === 1 ? 'Basic survival Chinese. 500 words total target.' : lvl === 2 ? 'Daily communication. 772 words total target.' : 'Intermediate Chinese. Coming soon.'}
                </p>

                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-gray-400">Database Count</span>
                    <span className="text-indigo-600">{count} / {target}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${lvl === 1 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10">
          <div className="bg-indigo-800/50 w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">
            <i className="fas fa-bolt text-yellow-400"></i>
          </div>
          <div>
            <h4 className="text-3xl font-black mb-2">Quiz Practice</h4>
            <p className="text-indigo-200 mb-6 text-lg">Test your memory with HSK vocabulary challenges.</p>
            <button 
              onClick={() => setView(AppView.QUIZ)}
              className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black hover:bg-yellow-400 transition-all hover:scale-105"
            >
              Start Practice
            </button>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="bg-gray-50 w-24 h-24 rounded-3xl flex items-center justify-center text-4xl text-indigo-600 shrink-0">
            <i className="fas fa-puzzle-piece"></i>
          </div>
          <div>
            <h4 className="text-3xl font-black text-gray-800 mb-2">Sentence Hub</h4>
            <p className="text-gray-500 mb-6 text-lg">Master Chinese grammar by rebuilding actual sentences.</p>
            <button 
              onClick={() => setView(AppView.SENTENCE_BUILDER)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Build Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
