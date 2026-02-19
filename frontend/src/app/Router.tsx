import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../shared/components/AppLayout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../features/Login';
import SignupPage from '../features/Signup';
import TimerPage from '../features/Timer';
import SubjectsPage from '../features/Subjects';
import LeaderboardPage from '../features/Leaderboard';
import ProfilePage from '../features/Profile';
import StatisticsPage from '../features/Statistics';
import FriendsPage from '../features/Friends';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Main app pages - empty for now, but we will uncomment these as we create the app pages*/}
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/timer" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timer"
          element={
            <ProtectedRoute>
              <TimerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
