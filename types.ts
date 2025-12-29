
export interface StudentInfo {
  fullName: string;
  className: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface EssayQuestion {
  id: number;
  text: string;
  suggestedAnswer: string;
  category: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: number;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  timeTaken: number;
  studentInfo: StudentInfo;
}

export enum AppState {
  REGISTRATION,
  HOME,
  QUIZ,
  RESULT,
  REVIEW,
  ESSAY
}
