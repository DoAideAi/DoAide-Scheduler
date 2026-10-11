import { Link, useLocation } from "react-router-dom";

const TOOLS = [
  { path: "/tools/meeting-cost-calculator", label: "Meeting Cost" },
  { path: "/templates-gallery", label: "Templates" },
  { path: "/tools/timezone-converter", label: "Timezone" },
  { path: "/tools/availability-finder", label: "Availability" },
  { path: "/tools/meeting-planner", label: "AI Planner" },
  { path: "/tools/weekly-planner", label: "Weekly Plan" },
];

export default function ToolsNav() {
  const { pathname } = useLocation();
  return (
    <nav className="tools-nav">
      <Link to="/" className="tools-nav-brand">
        DoAide <em>|</em> Scheduler
      </Link>
      <div className="tools-nav-links">
        {TOOLS.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className={`tools-nav-link${pathname === t.path ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="tools-nav-cta">Get Started Free</Link>
    </nav>
  );
}
