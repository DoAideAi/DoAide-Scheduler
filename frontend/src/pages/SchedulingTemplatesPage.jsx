import { Link } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TEMPLATES = [
  {
    name: "1-on-1 Meeting",
    desc: "Recurring check-in between a manager and direct report. 30 minutes, weekly cadence.",
    settings: ["30 min", "Weekly", "Private", "Calendar sync", "Buffer: 5 min"],
  },
  {
    name: "Team Standup",
    desc: "Quick daily sync for agile teams. Keep it short, keep it focused.",
    settings: ["15 min", "Daily (weekdays)", "Team-only", "Auto-record notes", "Max 10 people"],
  },
  {
    name: "Client Call",
    desc: "External meeting with clients. Includes reminder emails and custom branding.",
    settings: ["45 min", "On-demand", "Branded page", "SMS reminders", "Auto-follow-up"],
  },
  {
    name: "Interview",
    desc: "Candidate interview slot with panel support and automatic calendar holds.",
    settings: ["60 min", "On-demand", "Panel scheduling", "Candidate self-book", "Calendar hold"],
  },
  {
    name: "Product Demo",
    desc: "Sales demo booking page with qualification questions and CRM integration.",
    settings: ["30 min", "On-demand", "Qualification form", "CRM sync", "Round-robin assignment"],
  },
  {
    name: "Office Hours",
    desc: "Drop-in availability for questions and support. First-come, first-served slots.",
    settings: ["20 min", "Weekly window", "Open booking", "Queue management", "Auto-close when full"],
  },
];

export default function SchedulingTemplatesPage() {
  usePageTitle("Free Scheduling Templates — 6 Meeting Page Templates");

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 800 }}>
          <h1 className="tool-title">Scheduling Templates</h1>
          <p className="tool-subtitle">
            Start with a proven meeting page. Pick a template and customize it for your workflow.
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            {TEMPLATES.map((t) => (
              <div key={t.name} className="calc-card">
                <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", color: "var(--ink-strong, #fff)" }}>
                  {t.name}
                </h2>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>
                  {t.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {t.settings.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(13,148,136,0.1)",
                        color: "#0D9488",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  to="/"
                  style={{
                    display: "inline-block",
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    background: "#0D9488",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Use this template
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <ShareButtons
              path="/templates-gallery"
              text="Free scheduling templates for 1-on-1s, standups, client calls, and more — DoAide Scheduler"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
