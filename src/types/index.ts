export type AgeGroup = '10~20대' | '30~40대' | '50~60대' | '70대 이상';
export type Gender = '남성' | '여성';
export type QuestionId = number;
export type QuestionOptionId = string;

export interface QuestionAnswer {
  questionId: QuestionId;
  selectedOptionIds: QuestionOptionId[];
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
  id: QuestionId;
  question: string;
  options: Array<{
    id: QuestionOptionId;
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

export type QuestionProcessingStatus = 'idle' | 'submitting' | 'error'

export type QuestionProcessingErrorCode =
  | 'NETWORK_OR_CORS'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN'

export interface QuestionProcessingError {
  code: QuestionProcessingErrorCode
  userMessage: string
  developerMessage: string
}
