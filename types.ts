
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  WORK = 'Work',
  STUDY = 'Study',
  PERSONAL = 'Personal',
  HEALTH = 'Health'
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  subTasks: SubTask[];
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  learnings: string;
  mood: string;
  image?: string;
  aiSummary?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isPro: boolean;
  streak: number;
  joinedDate: string;
  themeColor: 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan' | 'teal' | 'orange' | 'fuchsia' | 'sky' | 'slate' | 'lime';
}

export type View = 'dashboard' | 'tasks' | 'journal' | 'suggestions' | 'analytics' | 'settings' | 'calendar';
