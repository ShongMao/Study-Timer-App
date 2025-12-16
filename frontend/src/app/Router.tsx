import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../shared/components/AppLayout';

// The following imports are commented because we have not created these pages yet.
// import LoginPage from '@/features/auth/LoginPage';
// import TimerPage from '@/features/timer/TimerPage';
// import LeaderboardPage from '@/features/leaderboard/LeaderboardPage';
// import StatisticsPage from '@/features/statistics/StatisticsPage';
// import ProfilePage from '@/features/profile/ProfilePage';
import TestPage from '../features/Test';
import SubjectsPage from '../features/Subjects';

export default function AppRouter() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* Main app pages - empty for now, but we will uncomment these as we create the app pages*/}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />

        {/* <Route path="/" element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/test" replace />} />
    </Routes>
  );
}
