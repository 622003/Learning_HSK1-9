
import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyItem, QuizQuestion } from '../types';
import { speakText } from '../services/geminiService';

interface QuizProps {
  items: VocabularyItem[];
  level: number;
}

const Quiz: React.FC<QuizProps> = ({ items, level }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const generateQuestions = useCallback(() => {
    const shuffledItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 10);
    const newQuestions: QuizQuestion[] = shuffledItems.map((item, idx) => {
      const type = Math.random() > 0.5 ? 'MATCHING' : 'TRANSLATION';
      const options = [item.english];
      while (options.length < 4) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        if (!options.includes(randomItem.english)) {
          options.push(randomItem.english);
        }
      }
      return {
        id: `q-${idx}`,
        type: type as any,
        question: item.hanzi,
        answer: item.english,
        options: options.sort(() => 0.5 - Math.random()),
        sourceItem: item
      };
    });
    setQuestions(newQuestions);
    setCurrentQuestionIdx(0);
    setScore(0);
    setIsFinished(false);
  }, [items]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const correct = option === questions[currentQuestionIdx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-indigo-50 animate-bounce-in">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-trophy text-4xl text-yellow-500"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
        <p className="text-gray-500 mb-8">You achieved a score of</p>
        <div className="text-6xl font-black text-indigo-600 mb-8">{score} / {questions.length}</div>
        <button
          onClick={generateQuestions}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) return <div>Loading questions...</div>;

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Practice</h2>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Question {currentQuestionIdx + 1} of {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 w-full bg-gray-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="text-center mb-10">
            <p className="text-gray-400 uppercase font-bold text-xs tracking-widest mb-4">Choose the correct translation</p>
            <div className="flex items-center justify-center gap-4">
              <h3 className="text-7xl font-bold text-gray-900">{currentQ.question}</h3>
              <button
                onClick={() => speakText(currentQ.question)}
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <i className="fas fa-volume-up text-2xl"></i>
              </button>
            </div>
            <p className="text-xl text-indigo-500 mt-2">{currentQ.sourceItem.pinyin}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options?.map((option, idx) => {
              let btnClass = "p-5 rounded-2xl border-2 text-left font-semibold transition-all ";
              if (selectedOption === option) {
                btnClass += option === currentQ.answer ? "bg-green-50 border-green-500 text-green-800" : "bg-red-50 border-red-500 text-red-800";
              } else if (selectedOption !== null && option === currentQ.answer) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else {
                btnClass += "border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-gray-600";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedOption === option && (
                      <i className={`fas ${option === currentQ.answer ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="mt-8 animate-fade-in">
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <i className={`fas ${isCorrect ? 'fa-lightbulb' : 'fa-info-circle'} mt-1`}></i>
                <div>
                  <p className="font-bold">{isCorrect ? 'Correct!' : 'Almost there!'}</p>
                  <p className="text-sm opacity-90">
                    "{currentQ.question}" means <strong>{currentQ.answer}</strong>.
                    Example: {currentQ.sourceItem.exampleHanzi} ({currentQ.sourceItem.exampleEnglish})
                  </p>
                </div>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <span>{currentQuestionIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
