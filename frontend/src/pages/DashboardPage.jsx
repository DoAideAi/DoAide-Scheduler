import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listBookings(), api.listMeetingTypes()])
      .then(([b, mt]) => {
        setBookings(b);
        setMeetingTypes(mt);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.start_time) > new Date())
    .slice(0, 5);

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" /><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.full_name || "there"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.business?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length, color: "text-brand-500" },
          { label: "Upcoming", value: upcoming.length, color: "text-blue-500" },
          { label: "Meeting Types", value: meetingTypes.length, color: "text-purple-500" },
          { label: "Plan", value: user?.business?.plan?.toUpperCase() || "FREE", color: "text-brand-500" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link to="/meeting-types" className="btn-primary">Create Meeting Type</Link>
        <Link to="/availability" className="btn-secondary">Set Availability</Link>
      </div>

      {/* Upcoming Bookings */}
      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No upcoming bookings. Share your booking link to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcoming.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{b.guest_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{b.guest_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(b.start_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(b.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Link */}
      {meetingTypes.length > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Your Booking Links</h2>
          <div className="space-y-2">
            {meetingTypes.filter((mt) => mt.is_active).map((mt) => (
              <div key={mt.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  /{user?.business?.slug}/{mt.slug}
                </span>
                <button
                  className="text-xs text-brand-500 hover:text-brand-600"
                  onClick={() => navigator.clipboard?.writeText(
                    `${window.location.origin}/book/${user?.business?.slug}/${mt.slug}`
                  )}
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
