
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentFilterProps {
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  departments: string[];
}

const DepartmentFilter = ({
  selectedDepartment,
  setSelectedDepartment,
  departments
}: DepartmentFilterProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <Select 
          value={selectedDepartment} 
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-500">
          {selectedDepartment === 'all' 
            ? 'Showing all departments' 
            : `Filtering by ${selectedDepartment} department`}
        </div>
      </div>
    </div>
  );
};

export default DepartmentFilter;
