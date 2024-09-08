import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your Pocketbase URL

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
