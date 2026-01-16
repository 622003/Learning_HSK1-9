
import React, { useState, useMemo } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import VocabularyList from './components/VocabularyList';
import Quiz from './components/Quiz';
import SentenceBuilder from './components/SentenceBuilder';
import MockExam from './components/MockExam';
import { AppView } from './types';
import { hskData } from './data';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [level, setLevel] = useState<number>(1);

  const filteredItems = useMemo(() => {
    return hskData.filter(item => item.level === level);
  }, [level]);

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <Home setView={setView} setLevel={setLevel} hskDataLength={hskData.length} />;
      case AppView.VOCABULARY:
        return <VocabularyList items={filteredItems} level={level} />;
      case AppView.QUIZ:
        return <Quiz items={filteredItems} level={level} />;
      case AppView.SENTENCE_BUILDER:
        return <SentenceBuilder items={filteredItems} />;
      case AppView.EXAM:
        return <MockExam items={filteredItems} level={level} onFinish={() => setView(AppView.HOME)} />;
      default:
        return <Home setView={setView} setLevel={setLevel} hskDataLength={hskData.length} />;
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter']">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        currentLevel={level} 
        setLevel={setLevel} 
      />
      
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-30 -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-[80px] opacity-30 -z-10 translate-y-1/2 -translate-x-1/2"></div>

        <div className="p-10 max-w-7xl mx-auto pt-8 pb-32">
          {/* Breadcrumb / Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <span className="hover:text-indigo-600 cursor-pointer" onClick={() => setView(AppView.HOME)}>Home</span>
              <i className="fas fa-chevron-right text-[10px]"></i>
              <span className="text-gray-800 capitalize">{view.toLowerCase().replace('_', ' ')}</span>
              {view !== AppView.HOME && (
                <>
                  <i className="fas fa-chevron-right text-[10px]"></i>
                  <span className="text-indigo-600">HSK Level {level}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 pr-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Student</p>
                  <p className="text-sm font-bold text-gray-800">Learning Mode</p>
                </div>
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>

      {/* Floating Action Menu for Quick Access */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3">
         {view !== AppView.HOME && (
           <button 
             onClick={() => setView(AppView.HOME)}
             className="bg-white text-gray-600 p-4 rounded-2xl shadow-xl hover:text-indigo-600 transition-all border border-gray-100"
             title="Home Dashboard"
           >
             <i className="fas fa-home text-xl"></i>
           </button>
         )}
         <button 
          onClick={() => setView(view === AppView.VOCABULARY ? AppView.QUIZ : AppView.VOCABULARY)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2.5xl shadow-2xl flex items-center gap-3 transition-all active:scale-95 group"
        >
          <div className="bg-white/20 rounded-xl w-10 h-10 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <i className={`fas ${view === AppView.VOCABULARY ? 'fa-vial' : 'fa-book'}`}></i>
          </div>
          <span className="font-bold pr-2">{view === AppView.VOCABULARY ? 'Practice Now' : 'Study Bank'}</span>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.95); opacity: 0; }
          60% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .rounded-2.5xl { border-radius: 1.25rem; }
      `}</style>

      <SpeedInsights />
    </div>
  );
};

export default App;
