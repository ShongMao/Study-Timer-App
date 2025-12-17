import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../shared/components/AppLayout';

// The following imports are commented because we have not created these pages yet.
// import TimerPage from '@/features/timer/TimerPage';
// import StatisticsPage from '@/features/statistics/StatisticsPage';
// import ProfilePage from '@/features/profile/ProfilePage';
import LoginPage from '../features/Login';
import SignupPage from '../features/Signup';
import TestPage from '../features/Test';
import SubjectsPage from '../features/Subjects';
import LeaderboardPage from '../features/Leaderboard';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Main app pages - empty for now, but we will uncomment these as we create the app pages*/}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* <Route path="/" element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
