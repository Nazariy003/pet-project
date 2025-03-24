const QUESTION_TYPE = {
  CODE: 'code',
  TEXT: 'text'
} as const;

type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

export interface IQuestion {
  id?: number | string; // For frontend tracking
  _id?: string | number; // MongoDB ID
  title: string;
  type: QuestionType;
  description: string;
  time: number;
  usageCount?: number;
  topicIds?: string[]; // MongoDB ObjectIds
  topics?: string[]; // Topic titles for frontend display
  createdAt?: string;
  updatedAt?: string;
}

export {QUESTION_TYPE};
