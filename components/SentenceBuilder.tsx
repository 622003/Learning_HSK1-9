
import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../services/geminiService';

interface SentenceBuilderProps {
  items: VocabularyItem[];
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ items }) => {
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userSelection, setUserSelection] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const setupNewSentence = useCallback(() => {
    if (items.length === 0) return;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    // Clean characters from exampleHanzi for shuffling
    const chars = randomItem.exampleHanzi.replace(/[。？！，.?!,]/g, '').split('');
    
    setCurrentItem(randomItem);
    setShuffledWords([...chars].sort(() => 0.5 - Math.random()));
    setUserSelection([]);
    setIsCorrect(null);
    setFeedback('');
  }, [items]);

  useEffect(() => {
    setupNewSentence();
  }, [setupNewSentence]);

  const addChar = (char: string, index: number) => {
    setUserSelection(prev => [...prev, char]);
    setShuffledWords(prev => prev.filter((_, i) => i !== index));
  };

  const removeChar = (char: string, index: number) => {
    setShuffledWords(prev => [...prev, char]);
    setUserSelection(prev => prev.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    if (!currentItem) return;
    const answer = currentItem.exampleHanzi.replace(/[。？！，.?!,]/g, '');
    const userStr = userSelection.join('');
    
    if (userStr === answer) {
      setIsCorrect(true);
      setFeedback('Excellent! You built it correctly.');
      speakText(currentItem.exampleHanzi);
    } else {
      setIsCorrect(false);
      setFeedback('Not quite right. Try again!');
    }
  };

  if (!currentItem) return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
      <p className="text-gray-500 font-bold">Please select a level with vocabulary first.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Sentence Builder</h2>
        <p className="text-gray-500">Arrange the characters to match the meaning.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="mb-8 text-center space-y-4">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <i className="fas fa-quote-left text-indigo-200 text-3xl mb-2 block"></i>
            <p className="text-xl text-indigo-900 font-bold mb-1">"{currentItem.exampleLao}"</p>
            <p className="text-indigo-400 italic text-sm">{currentItem.exampleEnglish}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Hint: {currentItem.english}</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{currentItem.pinyin}</span>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">Your Sentence</p>
          <div className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-wrap gap-2 p-4 items-center justify-center bg-gray-50">
            {userSelection.map((char, idx) => (
              <button
                key={`user-${idx}`}
                onClick={() => removeChar(char, idx)}
                className="w-14 h-14 flex items-center justify-center bg-white border-2 border-indigo-200 rounded-xl text-3xl font-bold text-indigo-600 shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                {char}
              </button>
            ))}
            {userSelection.length === 0 && <span className="text-gray-400 italic">Click character boxes below to start...</span>}
          </div>
        </div>

        <div className="mb-10">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">Available Characters</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {shuffledWords.map((char, idx) => (
              <button
                key={`avail-${idx}`}
                onClick={() => addChar(char, idx)}
                className="w-16 h-16 flex items-center justify-center bg-indigo-600 text-white rounded-2xl text-3xl font-bold shadow-md hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={setupNewSentence}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Skip / New
          </button>
          <button
            onClick={checkAnswer}
            disabled={shuffledWords.length > 0}
            className={`flex-[2] py-4 rounded-xl font-bold transition-all shadow-lg ${
              shuffledWords.length === 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            Check Answer
          </button>
        </div>

        {feedback && (
          <div className={`mt-8 p-6 rounded-2xl text-center animate-fade-in ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="text-lg font-bold mb-2">{feedback}</p>
            {isCorrect && (
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">{currentItem.exampleHanzi}</p>
                <p className="text-sm opacity-75">{currentItem.examplePinyin}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilder;
