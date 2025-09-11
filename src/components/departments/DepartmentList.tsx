
import { useState } from 'react';
import { Department } from '@/pages/DepartmentManagement';
import { User } from '@/types/auth';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import EditDepartmentDialog from './EditDepartmentDialog';

interface DepartmentListProps {
  departments: Department[];
  onUpdateDepartment: (department: Department) => void;
  onDeleteDepartment: (departmentId: string) => void;
  getAvailableHeads: () => Promise<User[]>;
  isLoading: boolean;
}

const DepartmentList = ({ 
  departments, 
  onUpdateDepartment, 
  onDeleteDepartment,
  getAvailableHeads,
  isLoading 
}: DepartmentListProps) => {
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);

  const handleEditClick = (department: Department) => {
    setDepartmentToEdit(department);
  };

  const handleEditClose = () => {
    setDepartmentToEdit(null);
  };

  return (
    <>
      <Table>
        <TableCaption>List of departments and their heads</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Department Head</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmac-red"></div>
                  <span className="ml-2">Loading departments...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : departments.length > 0 ? (
            departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>
                  {department.head ? (
                    <div className="flex items-center gap-2">
                      {department.head.avatar && (
                        <img 
                          src={department.head.avatar} 
                          alt={department.head.name} 
                          className="h-8 w-8 rounded-full" 
                        />
                      )}
                      <div>
                        <p className="font-medium">{department.head.name}</p>
                        <p className="text-xs text-muted-foreground">{department.head.email}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No head assigned</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{department.memberCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDeleteDepartment(department.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No departments found. Create a new department to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {departmentToEdit && (
        <EditDepartmentDialog
          department={departmentToEdit}
          getAvailableHeads={getAvailableHeads}
          onDepartmentUpdated={onUpdateDepartment}
          onClose={handleEditClose}
        />
      )}
    </>
  );
};

export default DepartmentList;
