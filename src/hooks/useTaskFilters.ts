import { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { isToday, isTomorrow, isPast, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assignee: 'all' | 'me' | 'unassigned' | string;
  dueDate: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this_week';
  project: string | 'all';
  tags: string[];
  showCompleted: boolean;
}

export interface SortConfig {
  field: 'title' | 'status' | 'priority' | 'dueDate' | 'assignee' | 'project' | 'createdAt';
  direction: 'asc' | 'desc';
}

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  assignee: 'all',
  dueDate: 'all',
  project: 'all',
  tags: [],
  showCompleted: true
};

const defaultSort: SortConfig = {
  field: 'createdAt',
  direction: 'desc'
};

export const useTaskFilters = (tasks: Task[]) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort);

  const updateFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const updateSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedTasks = useMemo(() => {
    // Apply filters
    let filtered = tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Show completed filter
      if (!filters.showCompleted && task.status === TaskStatus.COMPLETED) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Assignee filter
      if (filters.assignee !== 'all') {
        if (filters.assignee === 'me') {
          // Check if user is assigned (either in assignees array or old assignee field)
          const isAssignedToUser = task.assignee?.id === user?.id || 
            (task.assignees && task.assignees.some(assignee => assignee.id === user?.id));
          if (!isAssignedToUser) return false;
        } else if (filters.assignee === 'unassigned') {
          // Task is unassigned if no assignee and no assignees
          const hasAssignee = task.assignee || (task.assignees && task.assignees.length > 0);
          if (hasAssignee) return false;
        } else {
          // Specific member ID filter
          const isAssignedToMember = task.assignee?.id === filters.assignee || 
            (task.assignees && task.assignees.some(assignee => assignee.id === filters.assignee));
          if (!isAssignedToMember) return false;
        }
      }

      // Due date filter
      if (filters.dueDate !== 'all' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        
        switch (filters.dueDate) {
          case 'today':
            if (!isToday(dueDate)) return false;
            break;
          case 'tomorrow':
            if (!isTomorrow(dueDate)) return false;
            break;
          case 'overdue':
            if (!isPast(dueDate) || isToday(dueDate)) return false;
            break;
          case 'this_week':
            const now = new Date();
            const weekEnd = new Date(now);
            weekEnd.setDate(weekEnd.getDate() + 7);
            if (!isWithinInterval(dueDate, { 
              start: startOfDay(now), 
              end: endOfDay(weekEnd) 
            })) return false;
            break;
        }
      }

      // Project filter
      if (filters.project !== 'all' && task.projectId !== filters.project) {
        return false;
      }

      // Tag filter
      if (filters.tags.length > 0) {
        // Handle both array and string (JSON) formats for task tags
        const taskTags = Array.isArray(task.tags) ? task.tags : [];
        const hasAllTags = filters.tags.every(filterTag => 
          taskTags.some(taskTag => 
            typeof taskTag === 'string' && 
            taskTag.toLowerCase() === filterTag.toLowerCase()
          )
        );
        if (!hasAllTags) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          const statusOrder = {
            [TaskStatus.TODO]: 0,
            [TaskStatus.IN_PROGRESS]: 1,
            [TaskStatus.IN_REVIEW]: 2,
            [TaskStatus.COMPLETED]: 3
          };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'priority':
          const priorityOrder = {
            [TaskPriority.URGENT]: 0,
            [TaskPriority.HIGH]: 1,
            [TaskPriority.MEDIUM]: 2,
            [TaskPriority.LOW]: 3
          };
          aValue = a.priority ? priorityOrder[a.priority] : 4;
          bValue = b.priority ? priorityOrder[b.priority] : 4;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'assignee':
          aValue = a.assignee?.name || 'zzz';
          bValue = b.assignee?.name || 'zzz';
          break;
        case 'project':
          aValue = a.projectId || 'zzz';
          bValue = b.projectId || 'zzz';
          break;
        case 'createdAt':
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, filters, sortConfig, user]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.assignee !== 'all') count++;
    if (filters.dueDate !== 'all') count++;
    if (filters.project !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (!filters.showCompleted) count++;
    return count;
  }, [filters]);

  // Get all unique tags from tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      if (task.tags) {
        // Handle both array and string (JSON) formats
        const tags = Array.isArray(task.tags) ? task.tags : [];
        tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            tagSet.add(tag.trim());
          }
        });
      }
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  return {
    filters,
    sortConfig,
    filteredTasks: filteredAndSortedTasks,
    updateFilter,
    resetFilters,
    updateSort,
    activeFilterCount,
    availableTags
  };
};
