import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import AnswerPage from './pages/AnswerPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoryPage from './pages/my/HistoryPage';
import WrongNotesPage from './pages/my/WrongNotesPage';
import StatsPage from './pages/my/StatsPage';
import SettingsPage from './pages/SettingsPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 공개 페이지 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/answer/:answerToken" element={<AnswerPage />} />

        {/* 인증 필요 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/github/callback" element={<GitHubCallbackPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feedback/:answerId" element={<FeedbackPage />} />
          <Route path="/my/history" element={<HistoryPage />} />
          <Route path="/my/wrong-notes" element={<WrongNotesPage />} />
          <Route path="/my/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
