import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const MEETING_TYPES = [
  "1-on-1",
  "Team Standup",
  "Client Call",
  "Brainstorming",
  "Sprint Planning",
  "Retrospective",
  "Interview",
  "Product Demo",
  "All-Hands",
  "Training",
];

const DURATIONS = [15, 25, 30, 45, 60, 90];

export default function MeetingSchedulerPage() {
  usePageTitle("Free AI Meeting Planner — Generate Agendas Instantly");
  const [meetingType, setMeetingType] = useState("1-on-1");
  const [duration, setDuration] = useState(30);
  const [attendees, setAttendees] = useState(3);
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    track("meeting_planner_generate", { meetingType, duration, attendees });

    try {
      const resp = await fetch("/api/v1/tools/suggest-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_type: meetingType,
          duration_minutes: duration,
          attendee_count: attendees,
          goal,
        }),
      });
      if (!resp.ok) throw new Error("Failed to generate agenda");
      const data = await resp.json();
      setResult(data);
    } catch {
      setError("Could not generate agenda. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 720 }}>
          <h1 className="tool-title">AI Meeting Planner</h1>
          <p className="tool-subtitle">
            Generate a structured meeting agenda with AI. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Meeting Type
              <select
                className="calc-select"
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="calc-label">
              Duration
              <select
                className="calc-select"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d} minutes</option>
                ))}
              </select>
            </label>

            <label className="calc-label">
              Number of Attendees
              <input
                type="number"
                className="calc-input"
                value={attendees}
                onChange={(e) => setAttendees(Math.max(2, Math.min(100, parseInt(e.target.value, 10) || 2)))}
                min="2"
                max="100"
              />
            </label>

            <label className="calc-label">
              Meeting Goal (optional)
              <input
                type="text"
                className="calc-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Discuss Q4 roadmap priorities"
                maxLength={500}
              />
            </label>

            <button
              onClick={handleGenerate}
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: "0.5rem", width: "100%" }}
            >
              {loading ? "Generating..." : "Generate Agenda"}
            </button>

            {error && (
              <p style={{ color: "#EF4444", fontSize: "0.9rem", marginTop: "0.75rem" }}>
                {error}
              </p>
            )}

            {result && (
              <div className="calc-result" aria-live="polite">
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem", color: "#fff" }}>
                  Generated Agenda
                </h3>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    color: "#E5E7EB",
                    margin: "0 0 1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {result.agenda}
                </pre>

                {result.tips && result.tips.length > 0 && (
                  <>
                    <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "#0D9488" }}>
                      Tips
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#9CA3AF", fontSize: "0.85rem" }}>
                      {result.tips.map((tip, i) => (
                        <li key={i} style={{ marginBottom: "0.35rem" }}>{tip}</li>
                      ))}
                    </ul>
                  </>
                )}

                <ShareButtons
                  path="/tools/meeting-planner"
                  text="Generate AI meeting agendas instantly — free tool on DoAide Scheduler"
                />
              </div>
            )}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "DoAide AI Meeting Planner",
                "url": "https://scheduler.doaide.com/tools/meeting-planner",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "description": "Generate structured meeting agendas with AI. Free, no sign-up required.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              }),
            }}
          />

          <section className="tool-info">
            <h2>Why Meeting Agendas Matter</h2>
            <p>
              Meetings without agendas run 30% longer and produce fewer actionable outcomes.
              A clear agenda sets expectations, keeps discussion focused, and ensures every
              attendee knows their role before the meeting starts.
            </p>
            <h3>Best Practices for Meeting Agendas</h3>
            <ul>
              <li>Share the agenda at least 24 hours before the meeting</li>
              <li>Assign time blocks to each topic to prevent overruns</li>
              <li>Include a clear desired outcome for each agenda item</li>
              <li>End with action items and owners</li>
              <li>Use DoAide Scheduler to automate agenda sharing with booking confirmations</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
