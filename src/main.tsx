
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/adminSetup'; // Ensure admin roles are set up
import './utils/databaseInit'; // Initialize database with sample data
import './utils/testTaskUpdate'; // Test task update functionality
import './utils/cleanupDatabase'; // Database cleanup functionality
import './utils/checkDatabaseState'; // Check database state utility

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
