import { useState, useCallback } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";
import { copyToClipboard } from "../lib/share";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "8 AM" },
  { start: "09:00", end: "10:00", label: "9 AM" },
  { start: "10:00", end: "11:00", label: "10 AM" },
  { start: "11:00", end: "12:00", label: "11 AM" },
  { start: "12:00", end: "13:00", label: "12 PM" },
  { start: "13:00", end: "14:00", label: "1 PM" },
  { start: "14:00", end: "15:00", label: "2 PM" },
  { start: "15:00", end: "16:00", label: "3 PM" },
  { start: "16:00", end: "17:00", label: "4 PM" },
  { start: "17:00", end: "18:00", label: "5 PM" },
];

const CATEGORIES = [
  { value: "deep-work", label: "Deep Work", color: "#3B82F6" },
  { value: "meetings", label: "Meetings", color: "#0D9488" },
  { value: "admin", label: "Admin", color: "#9CA3AF" },
  { value: "break", label: "Break", color: "#10B981" },
  { value: "personal", label: "Personal", color: "#A78BFA" },
];

function emptyGrid() {
  const grid = {};
  DAYS.forEach((day) => {
    grid[day] = {};
    TIME_SLOTS.forEach((slot) => {
      grid[day][slot.start] = { task: "", category: "" };
    });
  });
  return grid;
}

function exportToText(grid) {
  let text = "WEEKLY PLANNER\n" + "=".repeat(40) + "\n\n";
  DAYS.forEach((day) => {
    text += `${day.toUpperCase()}\n` + "-".repeat(20) + "\n";
    TIME_SLOTS.forEach((slot) => {
      const cell = grid[day][slot.start];
      if (cell.task) {
        const cat = CATEGORIES.find((c) => c.value === cell.category);
        text += `  ${slot.label}: ${cell.task}${cat ? ` [${cat.label}]` : ""}\n`;
      }
    });
    text += "\n";
  });
  return text;
}

export default function WeeklyPlannerPage() {
  usePageTitle("Free Weekly Planner Template — Plan Your Week in Minutes");
  const [grid, setGrid] = useState(emptyGrid);
  const [copied, setCopied] = useState(false);

  const updateCell = useCallback((day, time, field, value) => {
    setGrid((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: { ...prev[day][time], [field]: value },
      },
    }));
  }, []);

  const clearAll = () => {
    setGrid(emptyGrid());
    track("weekly_planner_clear");
  };

  const handleExport = async () => {
    const text = exportToText(grid);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      track("weekly_planner_export");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filledSlots = DAYS.reduce((sum, day) => {
    return sum + TIME_SLOTS.filter((s) => grid[day][s.start].task).length;
  }, 0);

  const categoryBreakdown = CATEGORIES.map((cat) => {
    const hours = DAYS.reduce((sum, day) => {
      return sum + TIME_SLOTS.filter((s) => grid[day][s.start].category === cat.value).length;
    }, 0);
    return { ...cat, hours };
  }).filter((c) => c.hours > 0);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 960 }}>
          <h1 className="tool-title">Weekly Planner</h1>
          <p className="tool-subtitle">
            Plan your week with time-blocking. No sign-up required.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <span
                key={cat.value}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.75rem",
                  color: cat.color,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, display: "inline-block" }} />
                {cat.label}
              </span>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.5rem", textAlign: "left", color: "#9CA3AF", borderBottom: "1px solid #2A2A2D", minWidth: 50 }}>
                    Time
                  </th>
                  {DAYS.map((day) => (
                    <th key={day} style={{ padding: "0.5rem", textAlign: "left", color: "#9CA3AF", borderBottom: "1px solid #2A2A2D", minWidth: 140 }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot.start}>
                    <td style={{ padding: "0.35rem 0.5rem", color: "#6B7280", borderBottom: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap", verticalAlign: "top" }}>
                      {slot.label}
                    </td>
                    {DAYS.map((day) => {
                      const cell = grid[day][slot.start];
                      const cat = CATEGORIES.find((c) => c.value === cell.category);
                      return (
                        <td
                          key={day}
                          style={{
                            padding: "0.25rem",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            borderLeft: cat ? `3px solid ${cat.color}` : "3px solid transparent",
                            verticalAlign: "top",
                          }}
                        >
                          <input
                            type="text"
                            value={cell.task}
                            onChange={(e) => updateCell(day, slot.start, "task", e.target.value)}
                            placeholder="Add task"
                            aria-label={`${day} ${slot.label} task`}
                            style={{
                              width: "100%",
                              padding: "0.3rem 0.4rem",
                              fontSize: "0.78rem",
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: 4,
                              color: "#E5E7EB",
                              boxSizing: "border-box",
                              marginBottom: "0.15rem",
                            }}
                          />
                          <select
                            value={cell.category}
                            onChange={(e) => updateCell(day, slot.start, "category", e.target.value)}
                            aria-label={`${day} ${slot.label} category`}
                            style={{
                              width: "100%",
                              padding: "0.2rem",
                              fontSize: "0.72rem",
                              background: "rgba(10,10,11,0.6)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: 4,
                              color: cat ? cat.color : "#6B7280",
                              boxSizing: "border-box",
                            }}
                          >
                            <option value="">Category</option>
                            {CATEGORIES.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(filledSlots > 0 || categoryBreakdown.length > 0) && (
            <div className="calc-card" style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#fff" }}>
                  Summary
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                  {filledSlots} of {DAYS.length * TIME_SLOTS.length} slots filled
                </span>
              </div>
              {categoryBreakdown.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {categoryBreakdown.map((c) => (
                    <div key={c.value} style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: c.color, fontWeight: 600 }}>{c.hours}h</span>{" "}
                      <span style={{ color: "#9CA3AF" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button onClick={handleExport} className="btn btn-primary">
              {copied ? "Copied!" : "Copy as Text"}
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: "0.5rem 0.9rem",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
                color: "#9CA3AF",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ShareButtons
              path="/tools/weekly-planner"
              text="Plan your week with this free weekly planner template — DoAide Scheduler"
            />
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "DoAide Weekly Planner",
                "url": "https://scheduler.doaide.com/tools/weekly-planner",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "description": "Interactive weekly planner with time-blocking and category tracking. Free, no sign-up required.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              }),
            }}
          />

          <section className="tool-info">
            <h2>Why Time-Blocking Works</h2>
            <p>
              Time-blocking is the practice of assigning specific tasks to specific hours in
              your day. Research shows that people who time-block are 18% more productive than
              those who rely on to-do lists alone, because it forces intentional decisions about
              how to spend each hour.
            </p>
            <h3>How to Use This Planner</h3>
            <ul>
              <li>Start by blocking your non-negotiables: recurring meetings, deep work sessions</li>
              <li>Use categories to visualize your time balance at a glance</li>
              <li>Aim for at least 2 hours of uninterrupted deep work daily</li>
              <li>Leave buffer time between meetings to avoid back-to-back fatigue</li>
              <li>Copy your plan as text and share it with your team or paste it into your calendar</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
