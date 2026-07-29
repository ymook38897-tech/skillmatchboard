export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대' | '60대 이상';
export type Gender = '남성' | '여성' | '선택하지 않음';

export interface QuestionAnswer {
  questionId: number;
  selectedOptionId: string | null;
  isUnknown: boolean;
}

export interface UserFormData {
  ageGroup: AgeGroup | null;
  gender: Gender | null;
  jobCategory: string | null;
  jobCategoryUnknown: boolean;
  answers: QuestionAnswer[];
}

export interface Question {
  id: number;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface Result {
  id: string;
  jobTitle: string;
  compatibility: number;
  description: string;
  reason: string;
  connectedAnswers: string[];
  mainDuties: string[];
  requiredSkills: string[];
}
