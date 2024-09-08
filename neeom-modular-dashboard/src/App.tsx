import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your Pocketbase URL

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={pb.authStore.isValid ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard"
          element={pb.authStore.isValid ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
