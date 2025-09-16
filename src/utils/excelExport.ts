import * as XLSX from 'xlsx';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { format } from 'date-fns';

interface ExportTask {
  'Task ID': string;
  'Title': string;
  'Description': string;
  'Status': string;
  'Priority': string;
  'Progress': string;
  'Due Date': string;
  'Created Date': string;
  'Project': string;
  'Assignees': string;
  'Creator': string;
  'Tags': string;
  'Comments Count': number;
  'Attachments Count': number;
  'Subtasks Count': number;
  'Completed Subtasks': number;
  'Checklists Count': number;
}

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.IN_REVIEW:
      return 'In Review';
    case TaskStatus.COMPLETED:
      return 'Completed';
    default:
      return status;
  }
};

const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.URGENT:
      return 'Urgent';
    case TaskPriority.HIGH:
      return 'High';
    case TaskPriority.MEDIUM:
      return 'Medium';
    case TaskPriority.LOW:
      return 'Low';
    default:
      return priority;
  }
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return dateString;
  }
};

const formatDueDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch {
    return dateString;
  }
};

export const exportTasksToExcel = (
  tasks: Task[], 
  projects: any[] = [], 
  filename?: string
): void => {
  // Create a map of project IDs to project names
  const projectMap = new Map();
  projects.forEach(project => {
    projectMap.set(project.id, project.name);
  });

  // Transform tasks data for Excel export
  const exportData: ExportTask[] = tasks.map(task => {
    // Handle assignees
    const assignees = Array.isArray(task.assignees) 
      ? task.assignees.map(a => a.name).join(', ')
      : task.assignee?.name || 'Unassigned';

    // Handle tags
    const tags = Array.isArray(task.tags) 
      ? task.tags.join(', ')
      : '';

    // Handle creator
    const creator = task.creator?.name || 'Unknown';

    // Handle project
    const projectName = task.projectId ? projectMap.get(task.projectId) || 'Unknown Project' : 'No Project';

    // Count subtasks
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    const completedSubtasks = subtasks.filter(st => st.completed).length;

    // Count comments and attachments
    const commentsCount = Array.isArray(task.comments) ? task.comments.length : 0;
    const attachmentsCount = Array.isArray(task.attachments) ? task.attachments.length : 0;
    const checklistsCount = Array.isArray(task.checklists) ? task.checklists.length : 0;

    return {
      'Task ID': task.id,
      'Title': task.title,
      'Description': task.description || '',
      'Status': getStatusLabel(task.status),
      'Priority': getPriorityLabel(task.priority),
      'Progress': `${task.progress || 0}%`,
      'Due Date': formatDueDate(task.dueDate),
      'Created Date': formatDate(task.createdAt),
      'Project': projectName,
      'Assignees': assignees,
      'Creator': creator,
      'Tags': tags,
      'Comments Count': commentsCount,
      'Attachments Count': attachmentsCount,
      'Subtasks Count': subtasks.length,
      'Completed Subtasks': completedSubtasks,
      'Checklists Count': checklistsCount,
    };
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Task ID
    { wch: 30 }, // Title
    { wch: 40 }, // Description
    { wch: 12 }, // Status
    { wch: 10 }, // Priority
    { wch: 10 }, // Progress
    { wch: 12 }, // Due Date
    { wch: 18 }, // Created Date
    { wch: 20 }, // Project
    { wch: 25 }, // Assignees
    { wch: 15 }, // Creator
    { wch: 20 }, // Tags
    { wch: 12 }, // Comments Count
    { wch: 15 }, // Attachments Count
    { wch: 12 }, // Subtasks Count
    { wch: 15 }, // Completed Subtasks
    { wch: 12 }, // Checklists Count
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  // Generate filename with current date if not provided
  const defaultFilename = `tasks_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;
  const finalFilename = filename || defaultFilename;

  // Write and download the file
  XLSX.writeFile(workbook, finalFilename);
};

export const exportFilteredTasksToExcel = (
  tasks: Task[],
  projects: any[] = [],
  filterInfo?: {
    totalTasks: number;
    filteredTasks: number;
    activeFilters: string[];
  }
): void => {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  let filename = `tasks_export_${timestamp}.xlsx`;
  
  if (filterInfo && filterInfo.activeFilters.length > 0) {
    filename = `tasks_filtered_export_${timestamp}.xlsx`;
  }

  exportTasksToExcel(tasks, projects, filename);
};
