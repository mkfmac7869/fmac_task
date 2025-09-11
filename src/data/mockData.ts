
import { Task, Project, TaskStatus, TaskPriority } from '../types/task';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Task Manager Dashboard',
    description: 'Create a modern task management dashboard',
    color: 'purple',
    members: [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff'
      },
      {
        id: '2',
        name: 'Jamie Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jamie+Smith&background=4287f5&color=fff'
      },
      {
        id: '3',
        name: 'Jordan Lee',
        avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Music Dashboard Website',
    description: 'Develop a music streaming dashboard',
    color: 'blue',
    members: [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff'
      },
      {
        id: '3',
        name: 'Jordan Lee',
        avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff'
      }
    ]
  },
  {
    id: 'p3',
    name: 'Banking App Design',
    description: 'Design a modern banking application',
    color: 'orange',
    members: [
      {
        id: '2',
        name: 'Jamie Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jamie+Smith&background=4287f5&color=fff'
      },
      {
        id: '3',
        name: 'Jordan Lee',
        avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff'
      }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Task Manager Dashboard',
    description: 'Design and implement the task manager dashboard UI',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: '2023-10-15',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff'
    },
    projectId: 'p1',
    progress: 40,
    createdAt: '2023-09-10',
    tags: ['UI', 'Design', 'Dashboard']
  },
  {
    id: 't2',
    title: 'Music Dashboard Website',
    description: 'Create a responsive music dashboard website',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    dueDate: '2023-09-30',
    assignee: {
      id: '3',
      name: 'Jordan Lee',
      avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff'
    },
    projectId: 'p2',
    progress: 100,
    createdAt: '2023-09-05',
    tags: ['Website', 'Music', 'Frontend']
  },
  {
    id: 't3',
    title: 'Banking App Design',
    description: 'Design modern UI for banking app',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: '2023-10-25',
    assignee: {
      id: '2',
      name: 'Jamie Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jamie+Smith&background=4287f5&color=fff'
    },
    projectId: 'p3',
    progress: 20,
    createdAt: '2023-09-15',
    tags: ['UI', 'Banking', 'Mobile']
  },
  {
    id: 't4',
    title: 'API Integration',
    description: 'Integrate tasks API with frontend',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '2023-10-20',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff'
    },
    projectId: 'p1',
    progress: 0,
    createdAt: '2023-09-18',
    tags: ['API', 'Backend', 'Integration']
  },
  {
    id: 't5',
    title: 'User Authentication',
    description: 'Implement user login and registration',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    dueDate: '2023-09-25',
    assignee: {
      id: '3',
      name: 'Jordan Lee',
      avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff'
    },
    projectId: 'p1',
    progress: 100,
    createdAt: '2023-09-01',
    tags: ['Auth', 'Security', 'Backend']
  }
];
