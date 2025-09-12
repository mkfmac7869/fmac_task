
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FirebaseService } from '@/lib/firebaseService';

interface Department {
  id: string;
  name: string;
}

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const { signup } = useAuth();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        
        // Get departments from Firebase
        const data = await FirebaseService.getDocuments('departments');
        
        if (data && Array.isArray(data) && data.length > 0) {
          const formattedDepartments = data.map(dept => ({
            id: dept.id,
            name: dept.name
          }));
          setDepartments(formattedDepartments);
        } else {
          // No departments found - show empty state
          setDepartments([]);
          toast({
            title: 'No Departments Available',
            description: 'Please contact your administrator to set up departments.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
        toast({
          title: 'Error',
          description: 'Failed to load departments. Please try again or contact support.',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(email, password, name, department);
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please wait for approval from your department head or admin.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2e5ea70a-889d-46e0-8149-e69a1deee5f3.png" 
              alt="FMAC Logo" 
              className="h-20" 
            />
          </div>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <Select 
                  value={department} 
                  onValueChange={setDepartment} 
                  required
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger className={isLoadingDepartments ? "opacity-50" : ""}>
                    <SelectValue 
                      placeholder={
                        isLoadingDepartments 
                          ? "Loading departments..." 
                          : "Select your department"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        {isLoadingDepartments ? "Loading departments..." : "No departments available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {isLoadingDepartments && (
                  <p className="text-xs text-gray-500">Loading departments from database...</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="terms" className="h-4 w-4" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-fmac-red hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-fmac-red hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-fmac-red hover:bg-fmac-red/90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="text-sm text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-fmac-red hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
