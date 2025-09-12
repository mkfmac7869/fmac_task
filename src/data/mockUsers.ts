
import { User, UserRole } from '../types/auth';

// Mock users for demo
export const mockUsers = [
  {
    id: '1',
    email: 'admin@fmac.com',
    password: 'password',
    name: 'Admin User',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ea384c&color=fff',
    roles: ['admin'] as UserRole[],
    department: 'Management',
    isApproved: true,
    approvedBy: '1',
    approvedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'head@fmac.com',
    password: 'password',
    name: 'Department Head',
    avatar: 'https://ui-avatars.com/api/?name=Department+Head&background=42f54b&color=fff',
    roles: ['head'] as UserRole[],
    department: 'Engineering',
    isApproved: true,
    approvedBy: '1',
    approvedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'member@fmac.com',
    password: 'password',
    name: 'Team Member',
    avatar: 'https://ui-avatars.com/api/?name=Team+Member&background=f5a442&color=fff',
    roles: ['member'] as UserRole[],
    department: 'Marketing',
    isApproved: true,
    approvedBy: '2',
    approvedAt: new Date(),
    createdAt: new Date()
  }
];
