export type NodeStatus = 'locked' | 'not-started' | 'in-progress' | 'completed';

export type Category = 'fundamentals' | 'building-blocks' | 'patterns' | 'problems';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  category: Category;
  description: string;
  content: string;
  tips: string[];
  relatedIds: string[];
  quizQuestions: QuizQuestion[];
}

export interface RoadmapEdge {
  from: string;
  to: string;
}

export type UserProgress = Record<string, NodeStatus>;

export interface ProgressStats {
  total: number;
  byStatus: Record<NodeStatus, number>;
  byCategory: Record<Category, { total: number; completed: number }>;
}
