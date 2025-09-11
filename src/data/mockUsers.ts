
import { User, UserRole } from '../types/auth';

// Mock users for demo
export const mockUsers = [
  {
    id: '1',
    email: 'admin@fmac.com',
    password: 'password',
    name: 'Admin User',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ea384c&color=fff',
    role: 'admin' as UserRole,
    department: 'Management'
  },
  {
    id: '2',
    email: 'manager@fmac.com',
    password: 'password',
    name: 'General Manager',
    avatar: 'https://ui-avatars.com/api/?name=General+Manager&background=4287f5&color=fff',
    role: 'manager' as UserRole,
    department: 'Operations'
  },
  {
    id: '3',
    email: 'head@fmac.com',
    password: 'password',
    name: 'Department Head',
    avatar: 'https://ui-avatars.com/api/?name=Department+Head&background=42f54b&color=fff',
    role: 'head' as UserRole,
    department: 'Engineering'
  },
  {
    id: '4',
    email: 'member@fmac.com',
    password: 'password',
    name: 'Team Member',
    avatar: 'https://ui-avatars.com/api/?name=Team+Member&background=f5a442&color=fff',
    role: 'member' as UserRole,
    department: 'Marketing'
  }
];
