# FMAC Task Manager - Technical Context Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Core Technologies](#core-technologies)
5. [Key Components](#key-components)
6. [Data Models](#data-models)
7. [Authentication & Authorization](#authentication--authorization)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Development Workflow](#development-workflow)
11. [Deployment](#deployment)
12. [Important Patterns](#important-patterns)

## 1. Project Overview

FMAC Task Manager is a full-stack web application built with React, TypeScript, and Firebase. It provides comprehensive task and project management capabilities with real-time collaboration features.

### Key Characteristics:
- **Single Page Application (SPA)** with client-side routing
- **Real-time data synchronization** using Firebase Firestore
- **Serverless architecture** with Firebase Cloud Functions
- **Component-based UI** with reusable components
- **Type-safe development** with TypeScript
- **Mobile-first responsive design**

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  Pages  │  Components  │  Hooks  │  Context  │  Utils       │
├─────────────────────────────────────────────────────────────┤
│                    State Management                          │
│              (Context API + Custom Hooks)                    │
├─────────────────────────────────────────────────────────────┤
│                   Firebase Services                          │
│  Firestore  │  Auth  │  Cloud Functions  │  Hosting        │
├─────────────────────────────────────────────────────────────┤
│                   External Services                          │
│                    Resend (Email)                           │
└─────────────────────────────────────────────────────────────┘
```

## 3. Project Structure

```
fmac-task-flow-pro-main/
├── src/                      # Source code
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── tasks/          # Task-related components
│   │   ├── projects/       # Project-related components
│   │   ├── team/           # Team management components
│   │   ├── member/         # Member management components
│   │   ├── departments/    # Department components
│   │   ├── taskDetails/    # Task detail components
│   │   ├── sidebar/        # Navigation components
│   │   └── ui/             # Base UI components (shadcn/ui)
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── TaskContext.tsx # Task/Project state
│   ├── hooks/              # Custom React hooks
│   │   ├── task/          # Task-specific hooks
│   │   ├── project/       # Project-specific hooks
│   │   ├── team/          # Team-specific hooks
│   │   └── memberManagement/ # Member management hooks
│   ├── pages/              # Page components (routes)
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Core libraries and services
│   ├── utils/              # Utility functions
│   └── data/               # Mock data and constants
├── functions/              # Firebase Cloud Functions
│   └── src/
│       ├── index.ts       # Main functions entry
│       └── testEmail.ts   # Email testing function
├── public/                 # Static assets
└── dist/                   # Build output
```

## 4. Core Technologies

### Frontend Technologies
- **React 18.3.1**: UI framework with hooks and functional components
- **TypeScript 5.5.3**: Type-safe JavaScript
- **Vite 5.4.1**: Build tool and dev server
- **React Router DOM 6.26.2**: Client-side routing
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **React Hook Form 7.53.0**: Form management
- **Recharts 2.12.7**: Data visualization
- **date-fns 3.6.0**: Date manipulation
- **Lucide React**: Icon library

### Backend Technologies
- **Firebase Firestore**: NoSQL document database
- **Firebase Authentication**: User authentication service
- **Firebase Cloud Functions**: Serverless functions
- **Resend**: Email delivery API

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 5. Key Components

### 5.1 Layout Components
- **Layout.tsx**: Main application layout wrapper
- **Sidebar.tsx**: Navigation sidebar
- **AuthGuard.tsx**: Route protection component

### 5.2 Page Components
- **Dashboard.tsx**: Main dashboard view
- **Tasks.tsx**: Task management page (Kanban/List views)
- **TaskDetails.tsx**: Individual task details
- **Projects.tsx**: Project management page
- **ProjectDetails.tsx**: Individual project details
- **Team.tsx**: Team member directory
- **MemberProfile.tsx**: Individual member profile
- **Calendar.tsx**: Calendar view of tasks
- **Reports.tsx**: Analytics and reporting
- **Settings.tsx**: User settings and preferences
- **MemberManagement.tsx**: Admin member management
- **DepartmentManagement.tsx**: Department administration

### 5.3 Feature Components

#### Task Components
- **KanbanColumn**: Drag-and-drop task column
- **TaskCard**: Individual task card
- **NewTaskDialog**: Task creation modal
- **TaskForm**: Task input form
- **TaskListView**: Alternative list layout
- **TaskStatusCards**: Status summary cards

#### Project Components
- **ProjectCard**: Project display card
- **NewProjectDialog**: Project creation modal
- **ProjectHeader**: Project detail header
- **ProjectTaskList**: Project-specific task list

#### Team Components
- **TeamMemberCard**: Member display card
- **AddMemberDialog**: Member addition modal
- **MemberSearch**: Member search functionality
- **PendingApprovals**: Approval queue for new members

## 6. Data Models

### 6.1 User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: UserRole[]; // ['admin', 'head', 'member']
  bio?: string;
  department?: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}
```

### 6.2 Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId?: string;
  progress: number;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  creator?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  } | null;
  tags: string[];
  createdAt?: string;
}
```

### 6.3 Project Model
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  members?: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  }[];
  departmentId?: string | null;
}
```

### 6.4 Department Model
```typescript
interface Department {
  id: string;
  name: string;
  head?: User;
  description?: string;
  memberCount: number;
}
```

## 7. Authentication & Authorization

### 7.1 Authentication Flow
1. **Registration**: New users sign up with email/password
2. **Approval**: Requires approval from admin/department head
3. **Login**: Authenticated via Firebase Auth
4. **Session**: Maintained with Firebase Auth tokens
5. **Logout**: Clears session and redirects to login

### 7.2 Role-Based Access Control
- **Admin**: Full system access
  - User management
  - Department management
  - All data access
  - System configuration

- **Head**: Department-level access
  - Approve new members
  - Manage department
  - Enhanced reporting
  - Team management

- **Member**: Basic access
  - Task management
  - Project participation
  - Personal profile
  - Limited reporting

### 7.3 Permission Hooks
```typescript
usePermissions(user) // Main permission hook
useAuthUtils() // Utility functions for auth
useMemberAuth() // Member-specific auth
```

## 8. State Management

### 8.1 Context Providers
- **AuthContext**: Global authentication state
  - Current user
  - Login/logout functions
  - Permission checks
  - Loading states

- **TaskContext**: Task and project state
  - Tasks array
  - Projects array
  - CRUD operations
  - Query functions

### 8.2 Custom Hooks Architecture
```
useTaskOperations()
├── useTaskState()      # Task list state
├── useAddTask()        # Create tasks
├── useUpdateTask()     # Update tasks
├── useDeleteTask()     # Delete tasks
└── useTaskQueries()    # Query tasks

useProjectOperations()
├── useProjectState()   # Project list state
├── useAddProject()     # Create projects
├── useUpdateProject()  # Update projects
├── useDeleteProject()  # Delete projects
└── useProjectQueries() # Query projects
```

## 9. API Integration

### 9.1 Firebase Service Layer
```typescript
FirebaseService
├── addDocument()
├── updateDocument()
├── deleteDocument()
├── getDocuments()
├── getDocument()
└── batchWrite()

Specialized Services:
├── TaskService
├── ProjectService
├── UserService
├── DepartmentService
├── CommentService
└── NotificationService
```

### 9.2 Email Integration
- **Trigger**: Task assignment/reassignment
- **Service**: Resend API via Cloud Functions
- **Templates**: HTML email templates
- **Features**: 
  - Professional formatting
  - Direct task links
  - Task details summary

## 10. Development Workflow

### 10.1 Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### 10.2 Firebase Setup
1. Create Firebase project
2. Enable Firestore and Authentication
3. Deploy security rules
4. Deploy Cloud Functions
5. Configure environment variables

### 10.3 Code Organization Patterns
- **Feature-based structure**: Components grouped by feature
- **Barrel exports**: Index files for cleaner imports
- **Custom hooks**: Business logic separated from UI
- **Type safety**: Interfaces for all data structures
- **Utility functions**: Reusable helper functions

## 11. Deployment

### 11.1 Build Process
1. TypeScript compilation
2. Vite bundling and optimization
3. Asset optimization
4. Environment variable injection

### 11.2 Deployment Platforms
- **Vercel**: Primary hosting platform
- **Firebase Hosting**: Alternative option
- **Netlify**: Additional option

### 11.3 Environment Configuration
```env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 12. Important Patterns

### 12.1 Component Patterns
- **Container/Presentational**: Separate logic from UI
- **Compound Components**: Related components work together
- **Render Props**: Flexible component composition
- **Custom Hooks**: Reusable stateful logic

### 12.2 Data Flow Patterns
- **Unidirectional**: Top-down data flow
- **Context for Global State**: Auth and task state
- **Local State**: Component-specific state
- **Optimistic Updates**: Immediate UI updates

### 12.3 Error Handling
- **Try-catch blocks**: Async operation protection
- **Toast notifications**: User feedback
- **Fallback UI**: Error boundaries (planned)
- **Logging**: Console logging for debugging

### 12.4 Performance Patterns
- **Code splitting**: Route-based splitting
- **Lazy loading**: Dynamic imports
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search and filter operations

### 12.5 Security Patterns
- **Input validation**: Client and server-side
- **Authentication checks**: Route guards
- **Firestore rules**: Database-level security
- **Role verification**: Permission checks

## Key Files Reference

### Core Configuration
- `src/lib/firebaseClient.ts`: Firebase initialization
- `src/lib/firebaseService.ts`: Database operations
- `src/main.tsx`: Application entry point
- `src/App.tsx`: Root component and routing

### Authentication
- `src/context/AuthContext.tsx`: Auth state management
- `src/hooks/useFirebaseAuth.ts`: Firebase auth integration
- `src/components/AuthGuard.tsx`: Route protection

### Task Management
- `src/context/TaskContext.tsx`: Task state management
- `src/hooks/useTaskOperations.ts`: Task CRUD operations
- `src/pages/Tasks.tsx`: Main task page
- `src/pages/TaskDetails.tsx`: Task detail view

### Utility Functions
- `src/utils/adminSetup.ts`: Admin initialization
- `src/utils/databaseInit.ts`: Database seeding
- `src/lib/utils.ts`: General utilities

This context documentation provides a comprehensive technical overview of the FMAC Task Manager application, serving as a reference for developers working on or maintaining the project.
