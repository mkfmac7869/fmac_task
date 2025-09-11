
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect the root path to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
