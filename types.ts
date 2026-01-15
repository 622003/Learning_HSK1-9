
export enum AppView {
  HOME = 'HOME',
  VOCABULARY = 'VOCABULARY',
  QUIZ = 'QUIZ',
  SENTENCE_BUILDER = 'SENTENCE_BUILDER',
  EXAM = 'EXAM'
}

export interface VocabularyItem {
  id: number;
  hanzi: string;
  pinyin: string;
  english: string;
  lao: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleEnglish: string;
  exampleLao: string;
  level: number;
}

export interface QuizQuestion {
  id: string;
  type: 'MATCHING' | 'REORDER' | 'TRANSLATION';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  sourceItem: VocabularyItem;
}
