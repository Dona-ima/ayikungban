import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UploadPage from './pages/UploadPage';
import NotificationsPage from './pages/NotificationsPage';
import ResultsPage from './pages/ResultsPage';
import AllResultsPage from './pages/AllResultsPage';
import ChatbotPage from './pages/ChatbotPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/results" element={<AllResultsPage />} />
      <Route path="/results/:id" element={<ResultsPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
    </Routes>
  );
};

export default App;
