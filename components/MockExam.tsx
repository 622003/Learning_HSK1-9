
import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../services/geminiService';

interface MockExamProps {
  items: VocabularyItem[];
  level: number;
  onFinish: () => void;
}

interface ExamQuestion {
  id: number;
  type: 'LISTENING' | 'READING' | 'SENTENCE';
  question: string;
  options: string[];
  answer: string;
  pinyin?: string;
  source: VocabularyItem;
}

const MockExam: React.FC<MockExamProps> = ({ items, level, onFinish }) => {
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateExam = useCallback(() => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const questions: ExamQuestion[] = shuffled.slice(0, 15).map((item, idx) => {
      const types: Array<'LISTENING' | 'READING' | 'SENTENCE'> = ['LISTENING', 'READING', 'SENTENCE'];
      const type = types[idx % 3];
      
      let questionText = item.hanzi;
      let ans = item.english;
      let opts = [item.english];

      if (type === 'SENTENCE') {
        questionText = item.exampleHanzi;
        ans = item.exampleEnglish;
        opts = [item.exampleEnglish];
      }

      while (opts.length < 4) {
        const rand = items[Math.floor(Math.random() * items.length)];
        const potentialOpt = type === 'SENTENCE' ? rand.exampleEnglish : rand.english;
        if (!opts.includes(potentialOpt)) opts.push(potentialOpt);
      }

      return {
        id: idx,
        type,
        question: questionText,
        answer: ans,
        options: opts.sort(() => 0.5 - Math.random()),
        pinyin: item.pinyin,
        source: item
      };
    });
    setExamQuestions(questions);
  }, [items]);

  useEffect(() => {
    generateExam();
  }, [generateExam]);

  const handleAnswer = (val: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = val;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    return userAnswers.reduce((acc, ans, idx) => {
      return ans === examQuestions[idx].answer ? acc + 1 : acc;
    }, 0);
  };

  if (isCompleted) {
    const score = calculateScore();
    return (
      <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl shadow-2xl text-center border border-indigo-50 animate-bounce-in">
        <h2 className="text-4xl font-black text-indigo-900 mb-4">Exam Finished!</h2>
        <div className="text-7xl font-black text-indigo-600 my-8">{score} <span className="text-3xl text-gray-300">/ {examQuestions.length}</span></div>
        <div className="space-y-4 mb-8">
          <p className="text-gray-500">Performance: {score >= examQuestions.length * 0.6 ? 'Passed! 🎉' : 'Needs practice 📚'}</p>
        </div>
        <button onClick={onFinish} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">Back to Dashboard</button>
      </div>
    );
  }

  if (examQuestions.length === 0) return <div className="text-center py-20 font-bold text-gray-400">Loading Exam...</div>;

  const q = examQuestions[currentIdx];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">HSK {level} Mock Exam</h2>
          <p className="text-indigo-500 font-bold">Time Remaining: {formatTime(timeLeft)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 font-bold">Progress</p>
          <p className="text-xl font-black text-indigo-600">{currentIdx + 1} / {examQuestions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-12">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
              Section: {q.type}
            </span>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              {q.type === 'LISTENING' ? (
                <button 
                  onClick={() => speakText(q.question)}
                  className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform"
                >
                  <i className="fas fa-volume-up"></i>
                </button>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-6xl font-bold text-gray-900">{q.question}</h3>
                  <p className="text-xl text-indigo-400 font-medium">{q.pinyin}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className={`p-6 rounded-2xl border-2 text-left font-bold transition-all ${
                  userAnswers[currentIdx] === opt 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                    : 'border-gray-50 hover:border-indigo-100 text-gray-600 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${userAnswers[currentIdx] === opt ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-12 pt-8 border-t border-gray-50">
            <button 
              onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-indigo-600 disabled:opacity-0 transition-all"
            >
              Previous
            </button>
            
            {currentIdx === examQuestions.length - 1 ? (
              <button 
                onClick={() => setIsCompleted(true)}
                className="px-10 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all"
              >
                Submit Exam
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(p => p + 1)}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExam;
