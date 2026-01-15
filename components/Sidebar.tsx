
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  currentLevel: number;
  setLevel: (level: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentLevel, setLevel }) => {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const menuItems = [
    { id: AppView.HOME, icon: 'fa-th-large', label: 'Dashboard' },
    { id: AppView.VOCABULARY, icon: 'fa-book-open', label: 'Vocab Bank' },
    { id: AppView.QUIZ, icon: 'fa-bolt', label: 'Quick Practice' },
    { id: AppView.SENTENCE_BUILDER, icon: 'fa-puzzle-piece', label: 'Builder' },
    { id: AppView.EXAM, icon: 'fa-graduation-cap', label: 'Cert. Exam' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-10">
        <div 
          onClick={() => setView(AppView.HOME)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <i className="fas fa-language"></i>
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">
            Mandarin<span className="text-indigo-600">Hub</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    currentView === item.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 ${currentView === item.id ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                  <span className={`font-bold text-sm ${currentView === item.id ? '' : ''}`}>{item.label}</span>
                  {currentView === item.id && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">HSK Path</p>
          <div className="grid grid-cols-3 gap-2 px-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`h-12 rounded-xl text-xs font-black transition-all ${
                  currentLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                } ${lvl > 2 ? 'opacity-40 cursor-not-allowed border border-dashed border-gray-200' : ''}`}
                title={lvl > 2 ? 'Locked' : `Level ${lvl}`}
                disabled={lvl > 2}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-8 border-t border-gray-50">
        <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
             <i className="fas fa-magic text-xs"></i>
          </div>
          <p className="text-[10px] text-indigo-800 font-bold leading-tight">AI Pronunciation is enabled</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
