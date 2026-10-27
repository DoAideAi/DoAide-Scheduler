import { Link, Outlet, useLocation } from "react-router-dom";
import { BLOG_ARTICLES } from "../data/blogArticles";
import MeetingProductivity from "./blog/MeetingProductivity";
import RemoteScheduling from "./blog/RemoteScheduling";
import CalendarManagement from "./blog/CalendarManagement";
import AiSchedulingSaves from "./blog/AiSchedulingSaves";
import AutomatedBookingGuide from "./blog/AutomatedBookingGuide";
import SmartSchedulingBoosts from "./blog/SmartSchedulingBoosts";
import EffectiveOneOnOnes from "./blog/EffectiveOneOnOnes";
import AiCalendarTools2026 from "./blog/AiCalendarTools2026";
import WeeklyPlanningFramework from "./blog/WeeklyPlanningFramework";
import BestFreeSchedulingTools2026 from "./blog/BestFreeSchedulingTools2026";
import ScheduleMeetingsAcrossTimezones from "./blog/ScheduleMeetingsAcrossTimezones";
import AppointmentSchedulingSmallBusinessesIndia from "./blog/AppointmentSchedulingSmallBusinessesIndia";

// Article pages, keyed by slug; titles and descriptions live in data/blogArticles.
const COMPONENTS = {
  "effective-one-on-one-meetings": EffectiveOneOnOnes,
  "ai-calendar-tools-2026": AiCalendarTools2026,
  "weekly-planning-framework": WeeklyPlanningFramework,
  "ai-scheduling-saves-time": AiSchedulingSaves,
  "automated-appointment-booking-guide": AutomatedBookingGuide,
  "smart-scheduling-customer-satisfaction": SmartSchedulingBoosts,
  "meeting-productivity-guide": MeetingProductivity,
  "remote-team-scheduling": RemoteScheduling,
  "calendar-management-tips": CalendarManagement,
  "best-free-scheduling-tools-2026": BestFreeSchedulingTools2026,
  "schedule-meetings-across-time-zones": ScheduleMeetingsAcrossTimezones,
  "appointment-scheduling-small-businesses-india": AppointmentSchedulingSmallBusinessesIndia,
};

const ARTICLES = BLOG_ARTICLES.map((a) => ({ ...a, component: COMPONENTS[a.slug] }));

export { ARTICLES };

export default function BlogLayout() {
  // Posts render their own h1, so the blog name is only the h1 on /blog.
  const isIndex = useLocation().pathname.replace(/\/+$/, "") === "/blog";
  const Title = isIndex ? "h1" : "p";
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">&larr; Back to DoAide Scheduler</Link>
        <Title className="blog-title">DoAide Scheduler Blog</Title>
        <p className="blog-subtitle">Guides and resources for better meetings and scheduling</p>
      </header>
      <Outlet />
    </div>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <span className="blog-read-more">Read more &rarr;</span>
        </Link>
      ))}
    </div>
  );
}
