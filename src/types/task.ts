
export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId?: string;
  progress: number;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  creator?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  tags: string[];
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  members?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  }[];
  departmentId?: string | null;
}

export interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  refreshTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByProject: (projectId: string) => Task[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}
