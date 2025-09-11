# FMAC Task Manager

A comprehensive task management application built with React, TypeScript, Firebase, and modern web technologies. This application provides a complete solution for project management, team collaboration, and task tracking with real-time email notifications.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, assign, track, and manage tasks with Kanban board and list views
- **Project Management**: Organize tasks into projects with progress tracking and team collaboration
- **Team Management**: Add team members, manage departments, and track individual performance
- **Real-time Updates**: Live data synchronization across all users
- **Email Notifications**: Automatic email alerts when tasks are assigned or reassigned

### User Interface
- **Modern Design**: Clean, responsive UI built with Tailwind CSS and shadcn/ui
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Mobile Responsive**: Optimized for all device sizes
- **Intuitive Navigation**: Easy-to-use sidebar navigation and breadcrumbs

### Advanced Features
- **Role-based Access Control**: Admin, manager, and member roles with appropriate permissions
- **Task Filtering & Search**: Find tasks quickly with advanced filtering options
- **Progress Tracking**: Visual progress bars and completion statistics
- **Comment System**: Collaborate on tasks with threaded comments
- **Activity Logging**: Track all changes and updates to tasks and projects

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend
- **Firebase Firestore** for database
- **Firebase Authentication** for user management
- **Firebase Cloud Functions** for serverless functions
- **Resend** for email notifications

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Git** for version control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Resend account (for email notifications)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mkfmac7869/fmac_task.git
   cd fmac_task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/lib/firebaseClient.ts`

4. **Set up Email Notifications (Optional)**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Deploy functions
   firebase deploy --only functions
   
   # Configure Resend API key
   firebase functions:config:set resend.api_key="your_resend_api_key"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Set up Firestore security rules
5. Deploy Cloud Functions for email notifications

### Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account or sign in
2. **Create Projects**: Set up your first project
3. **Add Team Members**: Invite team members to collaborate
4. **Create Tasks**: Start adding and assigning tasks
5. **Track Progress**: Monitor task completion and team performance

### Key Features
- **Dashboard**: Overview of all tasks, projects, and team activity
- **Tasks**: Create, assign, and track tasks with different views
- **Projects**: Organize tasks into projects with progress tracking
- **Team**: Manage team members and departments
- **Calendar**: View tasks and deadlines in calendar format
- **Reports**: Generate reports on team performance and task completion

## 🚀 Deployment

### Firebase Hosting
```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the dist folder to Netlify
```

## 📧 Email Notifications

The application includes automatic email notifications powered by Firebase Cloud Functions and Resend:

- **Task Assignment**: Users receive emails when assigned to new tasks
- **Task Reassignment**: Notifications when tasks are moved to different team members
- **Professional Templates**: Clean, branded email templates with task details
- **Direct Links**: One-click access to view task details

## 🔒 Security

- **Firebase Security Rules**: Comprehensive rules for data access control
- **Role-based Permissions**: Different access levels for admin, manager, and member roles
- **Input Validation**: Client and server-side validation for all forms
- **Secure Authentication**: Firebase Authentication with email/password

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [Firebase](https://firebase.google.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Resend](https://resend.com/) for email delivery services

## 📞 Support

For support, email support@fmac.com or create an issue in the GitHub repository.

## 🔗 Links

- **Live Demo**: [https://fmac-task.vercel.app](https://fmac-task.vercel.app)
- **Documentation**: [https://docs.fmac.com](https://docs.fmac.com)
- **GitHub Repository**: [https://github.com/mkfmac7869/fmac_task](https://github.com/mkfmac7869/fmac_task)

---

Made with ❤️ by the FMAC Team