import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailsPage from './pages/JobDetaisPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { useAuth } from './services/auth'; // Custom hook to check auth status

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          {/*  Protected routes:  */}
          {/*  <Route path="/admin" element={isAuthenticated && user.isAdmin ? <AdminPage /> : <Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

