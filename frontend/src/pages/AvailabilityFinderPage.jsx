import { useState, useMemo } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function hourLabel(h) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function newParticipant(name) {
  const slots = {};
  DAYS.forEach((d) => {
    slots[d] = { start: 9, end: 17 };
  });
  return { name, slots };
}

export default function AvailabilityFinderPage() {
  usePageTitle("Free Availability Finder — Find Overlapping Meeting Slots");
  const [participants, setParticipants] = useState([
    newParticipant("Person 1"),
    newParticipant("Person 2"),
  ]);
  const [newName, setNewName] = useState("");

  const addParticipant = () => {
    const name = newName.trim() || `Person ${participants.length + 1}`;
    setParticipants((prev) => [...prev, newParticipant(name)]);
    setNewName("");
    track("availability_add_participant", { count: participants.length + 1 });
  };

  const removeParticipant = (idx) => {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSlot = (pIdx, day, field, value) => {
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === pIdx
          ? { ...p, slots: { ...p.slots, [day]: { ...p.slots[day], [field]: parseInt(value, 10) } } }
          : p
      )
    );
  };

  const updateName = (pIdx, name) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === pIdx ? { ...p, name } : p))
    );
  };

  const overlap = useMemo(() => {
    const results = [];
    DAYS.forEach((day) => {
      const ranges = participants.map((p) => p.slots[day]);
      const start = Math.max(...ranges.map((r) => r.start));
      const end = Math.min(...ranges.map((r) => r.end));
      if (end > start) {
        results.push({ day, start, end, hours: end - start });
      }
    });
    return results;
  }, [participants]);

  const totalOverlap = overlap.reduce((sum, o) => sum + o.hours, 0);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 720 }}>
          <h1 className="tool-title">Availability Finder</h1>
          <p className="tool-subtitle">
            Find overlapping available time slots across multiple schedules. No sign-up required.
          </p>

          <div className="calc-card">
            {participants.map((p, pIdx) => (
              <div key={pIdx} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid #2A2A2D" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    className="calc-input"
                    value={p.name}
                    onChange={(e) => updateName(pIdx, e.target.value)}
                    style={{ flex: 1, marginTop: 0 }}
                    aria-label={`Name for participant ${pIdx + 1}`}
                  />
                  {participants.length > 2 && (
                    <button
                      onClick={() => removeParticipant(pIdx)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "transparent",
                        color: "#9CA3AF",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                      aria-label={`Remove ${p.name}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
                  {DAYS.map((day) => (
                    <div key={day}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9CA3AF" }}>{day}</span>
                      <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                        <select
                          className="calc-select"
                          value={p.slots[day].start}
                          onChange={(e) => updateSlot(pIdx, day, "start", e.target.value)}
                          style={{ fontSize: "0.8rem", padding: "0.35rem" }}
                          aria-label={`${p.name} ${day} start`}
                        >
                          {HOURS.filter((h) => h < p.slots[day].end).map((h) => (
                            <option key={h} value={h}>{hourLabel(h)}</option>
                          ))}
                        </select>
                        <select
                          className="calc-select"
                          value={p.slots[day].end}
                          onChange={(e) => updateSlot(pIdx, day, "end", e.target.value)}
                          style={{ fontSize: "0.8rem", padding: "0.35rem" }}
                          aria-label={`${p.name} ${day} end`}
                        >
                          {HOURS.filter((h) => h > p.slots[day].start).map((h) => (
                            <option key={h} value={h}>{hourLabel(h)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                className="calc-input"
                placeholder="Add participant name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                style={{ flex: 1, marginTop: 0 }}
              />
              <button onClick={addParticipant} className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                Add
              </button>
            </div>

            <div className="calc-result" aria-live="polite">
              <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem", color: "#fff" }}>
                Overlapping Slots
              </h3>
              {overlap.length === 0 ? (
                <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                  No overlapping hours found. Try adjusting the availability windows.
                </p>
              ) : (
                <>
                  {overlap.map((o) => (
                    <div key={o.day} className="calc-result-row">
                      <span>{o.day}</span>
                      <strong style={{ color: "#0D9488" }}>
                        {hourLabel(o.start)} — {hourLabel(o.end)} ({o.hours}h)
                      </strong>
                    </div>
                  ))}
                  <div className="calc-result-row calc-total">
                    <span>Total Overlap</span>
                    <strong>{totalOverlap} hours/week</strong>
                  </div>
                </>
              )}

              <ShareButtons
                path="/tools/availability-finder"
                text={`Find overlapping meeting times across ${participants.length} schedules — free tool on DoAide Scheduler`}
              />
            </div>
          </div>

          <section className="tool-info">
            <h2>Why Availability Matching Matters</h2>
            <p>
              Finding a time that works for everyone is the biggest friction point in scheduling.
              This tool shows the overlapping windows across multiple people's schedules so you
              can pick the best slot without the back-and-forth.
            </p>
            <h3>Tips for Better Scheduling</h3>
            <ul>
              <li>Share wider availability windows to maximize overlap</li>
              <li>For recurring meetings, find the slot with the most overlap hours</li>
              <li>Consider timezone differences when setting availability</li>
              <li>Use DoAide Scheduler to automate availability detection across connected calendars</li>
            </ul>
          </section>
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "DoAide Availability Finder",
        "url": "https://scheduler.doaide.com/tools/availability-finder",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Find overlapping available time slots across multiple schedules. Free, no sign-up required.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }) }} />
    </div>
  );
}
