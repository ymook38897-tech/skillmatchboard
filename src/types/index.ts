export type AgeGroup = '10~20대' | '30~40대' | '50~60대' | '70대 이상';
export type Gender = '남성' | '여성';

export interface QuestionAnswer {
  questionId: number;
  selectedOptionId: string | null;
  isUnknown: boolean;
}

export interface UserFormData {
  ageGroup: AgeGroup | null;
  gender: Gender | null;
  jobCategories: string[];
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
