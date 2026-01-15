
import React, { useState, useMemo } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../services/geminiService';

interface VocabularyListProps {
  items: VocabularyItem[];
  level: number;
}

const ITEMS_PER_PAGE = 12;

const VocabularyList: React.FC<VocabularyListProps> = ({ items, level }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    setCurrentPage(1); // Reset to first page on search
    if (!term) return items;
    return items.filter(item => 
      item.hanzi.includes(term) ||
      item.pinyin.toLowerCase().includes(term) ||
      item.english.toLowerCase().includes(term) ||
      item.lao.includes(term)
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const levelColors: Record<number, string> = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
    6: 'bg-purple-100 text-purple-800',
    7: 'bg-pink-100 text-pink-800',
    8: 'bg-gray-800 text-white',
    9: 'bg-black text-yellow-400',
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Vocabulary Bank</h2>
          <p className="text-gray-500">HSK {level} Learning Path • {items.length} words total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold border border-indigo-100">
            {filteredItems.length} Found
          </div>
          <div className={`${levelColors[level] || 'bg-indigo-100 text-indigo-800'} px-4 py-2 rounded-xl font-bold text-sm uppercase`}>
            Level {level}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"></i>
        <input 
          type="text" 
          placeholder="Search Chinese, Pinyin, English or Lao..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-4xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.hanzi}
                      </h3>
                      <p className="text-lg text-indigo-600 font-medium">{item.pinyin}</p>
                    </div>
                    <button
                      onClick={() => speakText(item.hanzi)}
                      className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <i className="fas fa-volume-up"></i>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded mt-1 shrink-0">EN</span>
                      <span className="text-gray-700 font-semibold">{item.english}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-indigo-200 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 shrink-0">LA</span>
                      <span className="text-indigo-900 font-bold">{item.lao}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Example</p>
                      <button onClick={() => speakText(item.exampleHanzi)} className="text-indigo-300 hover:text-indigo-600">
                        <i className="fas fa-volume-up text-xs"></i>
                      </button>
                    </div>
                    <p className="text-gray-800 font-medium">{item.exampleHanzi}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 mb-2">{item.examplePinyin}</p>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                        <p className="text-[13px] text-gray-600 leading-relaxed italic">{item.exampleEnglish}</p>
                      </div>
                      <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/30">
                        <p className="text-[13px] text-indigo-900 font-bold leading-relaxed">{item.exampleLao}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-indigo-600">{currentPage}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-400 font-medium">{totalPages}</span>
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <i className="fas fa-search text-gray-200 text-6xl mb-4"></i>
          <h3 className="text-xl font-bold text-gray-400">No results found</h3>
          <p className="text-gray-400">Try a different search or change level.</p>
        </div>
      )}
    </div>
  );
};

export default VocabularyList;
