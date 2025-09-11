
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task, TaskStatus } from '@/types/task';

interface MemberTasksTableProps {
  tasks: Task[];
  projects: any[];
}

const MemberTasksTable = ({ tasks, projects }: MemberTasksTableProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="py-4 px-6">
        <div className="flex justify-between items-center">
          <CardTitle>Tasks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <TableRow key={task.id} className="cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{project?.name || 'Unknown Project'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                          task.status === TaskStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {task.status === TaskStatus.IN_PROGRESS ? 'In Progress' : 
                         task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="w-20 h-2" />
                        <span className="text-xs">{task.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks assigned yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberTasksTable;
