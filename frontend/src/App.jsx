import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Shell from "./components/Shell";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import MeetingTypesPage from "./pages/MeetingTypesPage";
import BookingsPage from "./pages/BookingsPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import CalendarPage from "./pages/CalendarPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import PricingPage from "./pages/PricingPage";
import PublicBookingPage from "./pages/PublicBookingPage";
import MeetingCalculatorPage from "./pages/MeetingCalculatorPage";
import SchedulingTemplatesPage from "./pages/SchedulingTemplatesPage";
import TimezonePage from "./pages/TimezonePage";
import AvailabilityFinderPage from "./pages/AvailabilityFinderPage";
import EmbedPage from "./pages/EmbedPage";
import MeetingSchedulerPage from "./pages/MeetingSchedulerPage";
import WeeklyPlannerPage from "./pages/WeeklyPlannerPage";
import BlogLayout, { ARTICLES, BlogIndex } from "./pages/BlogLayout";
import useSEO from "./hooks/useSEO";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  useSEO(useLocation().pathname.replace(/\/+$/, "") || "/");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/book/:businessSlug/:meetingSlug" element={<PublicBookingPage />} />

      {/* Free tools */}
      <Route path="/calculator" element={<MeetingCalculatorPage />} />
      <Route path="/tools/meeting-cost-calculator" element={<MeetingCalculatorPage />} />
      <Route path="/templates-gallery" element={<SchedulingTemplatesPage />} />
      <Route path="/timezone" element={<TimezonePage />} />
      <Route path="/tools/timezone-converter" element={<TimezonePage />} />
      <Route path="/tools/availability-finder" element={<AvailabilityFinderPage />} />
      <Route path="/tools/meeting-planner" element={<MeetingSchedulerPage />} />
      <Route path="/tools/weekly-planner" element={<WeeklyPlannerPage />} />
      <Route path="/embed" element={<EmbedPage />} />
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogIndex />} />
        {ARTICLES.map(a => <Route key={a.slug} path={a.slug} element={<a.component />} />)}
      </Route>

      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meeting-types" element={<MeetingTypesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>
    </Routes>
  );
}
