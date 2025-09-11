
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  department: string;
  tasksCompleted: number;
  tasksInProgress: number;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@fmac.com',
    phone: '+1 (123) 456-7890',
    role: 'Product Manager',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=ea384c&color=fff',
    department: 'Product',
    tasksCompleted: 24,
    tasksInProgress: 5
  },
  {
    id: '2',
    name: 'Jamie Smith',
    email: 'jamie@fmac.com',
    phone: '+1 (234) 567-8901',
    role: 'Lead Developer',
    avatar: 'https://ui-avatars.com/api/?name=Jamie+Smith&background=4287f5&color=fff',
    department: 'Engineering',
    tasksCompleted: 32,
    tasksInProgress: 3
  },
  {
    id: '3',
    name: 'Jordan Lee',
    email: 'jordan@fmac.com',
    phone: '+1 (345) 678-9012',
    role: 'UI/UX Designer',
    avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=42f54b&color=fff',
    department: 'Design',
    tasksCompleted: 18,
    tasksInProgress: 7
  },
  {
    id: '4',
    name: 'Taylor Kim',
    email: 'taylor@fmac.com',
    phone: '+1 (456) 789-0123',
    role: 'QA Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Taylor+Kim&background=f5a442&color=fff',
    department: 'Quality Assurance',
    tasksCompleted: 15,
    tasksInProgress: 2
  },
  {
    id: '5',
    name: 'Morgan Chen',
    email: 'morgan@fmac.com',
    phone: '+1 (567) 890-1234',
    role: 'DevOps Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Morgan+Chen&background=42d1f5&color=fff',
    department: 'Operations',
    tasksCompleted: 21,
    tasksInProgress: 1
  },
  {
    id: '6',
    name: 'Riley Patel',
    email: 'riley@fmac.com',
    phone: '+1 (678) 901-2345',
    role: 'Marketing Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Riley+Patel&background=f542c5&color=fff',
    department: 'Marketing',
    tasksCompleted: 12,
    tasksInProgress: 4
  }
];

// Get unique departments from team members
export const departments = [...new Set(teamMembers.map(member => member.department))];

// Helper function to add a new team member
export const addTeamMember = (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksCompleted' | 'tasksInProgress'>): TeamMember => {
  // Generate a new ID
  const newId = String(teamMembers.length + 1);
  
  // Generate avatar URL
  const avatarUrl = `https://ui-avatars.com/api/?name=${member.name.replace(/ /g, '+')}&background=42d1f5&color=fff`;
  
  // Create new member
  const newMember: TeamMember = {
    id: newId,
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    role: member.role,
    department: member.department,
    avatar: avatarUrl,
    tasksCompleted: 0,
    tasksInProgress: 0
  };
  
  // Add to the array
  teamMembers.push(newMember);
  
  return newMember;
};
