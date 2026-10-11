import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/meeting-types", label: "Meeting Types", icon: "📋" },
  { path: "/bookings", label: "Bookings", icon: "📅" },
  { path: "/availability", label: "Availability", icon: "🕐" },
  { path: "/calendar", label: "Calendar", icon: "📆" },
  { path: "/team", label: "Team", icon: "👥" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Shell() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-500">S</span>
            <span className="font-semibold text-gray-900 dark:text-white">DoAide <span className="text-brand-500">|</span> Scheduler</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {user?.full_name || user?.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                {user?.business?.name}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                title="Sign out"
              >
                ↗
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
