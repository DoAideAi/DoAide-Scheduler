import { useState, useMemo } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const ZONES = [
  { id: "America/New_York", label: "New York (ET)" },
  { id: "America/Chicago", label: "Chicago (CT)" },
  { id: "America/Denver", label: "Denver (MT)" },
  { id: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { id: "Europe/London", label: "London (GMT/BST)" },
  { id: "Europe/Paris", label: "Paris (CET)" },
  { id: "Europe/Berlin", label: "Berlin (CET)" },
  { id: "Asia/Dubai", label: "Dubai (GST)" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Singapore", label: "Singapore (SGT)" },
  { id: "Asia/Tokyo", label: "Tokyo (JST)" },
  { id: "Australia/Sydney", label: "Sydney (AEST)" },
  { id: "Pacific/Auckland", label: "Auckland (NZST)" },
];

function formatTime(date, tz) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(date);
}

function formatDate(date, tz) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  }).format(date);
}

function getOffset(tz) {
  const now = new Date();
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  return (local - utc) / 3600000;
}

function isBusinessHour(hour) {
  return hour >= 9 && hour < 17;
}

export default function TimezonePage() {
  usePageTitle("World Timezone Converter — Find the Best Meeting Time");
  const [baseZone, setBaseZone] = useState("America/New_York");
  const [compareZones, setCompareZones] = useState(["Europe/London", "Asia/Kolkata"]);
  const [baseHour, setBaseHour] = useState(10);
  const [baseMinute, setBaseMinute] = useState(0);

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setHours(baseHour, baseMinute, 0, 0);
    return d;
  }, [baseHour, baseMinute]);

  const conversions = useMemo(() => {
    const baseOffset = getOffset(baseZone);
    return compareZones.map((tz) => {
      const offset = getOffset(tz);
      const diff = offset - baseOffset;
      const converted = new Date(baseDate.getTime() + diff * 3600000);
      const hour = converted.getHours();
      return {
        zone: tz,
        label: ZONES.find((z) => z.id === tz)?.label || tz,
        time: formatTime(baseDate, tz),
        date: formatDate(baseDate, tz),
        diff: diff >= 0 ? `+${diff}h` : `${diff}h`,
        isBusiness: isBusinessHour(hour),
      };
    });
  }, [baseZone, compareZones, baseDate]);

  const overlap = useMemo(() => {
    const allZones = [baseZone, ...compareZones];
    const hours = [];
    for (let h = 0; h < 24; h++) {
      const d = new Date();
      d.setHours(h, 0, 0, 0);
      const allBusiness = allZones.every((tz) => {
        const offset = getOffset(tz) - getOffset(baseZone);
        const localHour = (h + offset + 24) % 24;
        return isBusinessHour(Math.floor(localHour));
      });
      if (allBusiness) hours.push(h);
    }
    return hours;
  }, [baseZone, compareZones]);

  const toggleZone = (zoneId) => {
    setCompareZones((prev) =>
      prev.includes(zoneId) ? prev.filter((z) => z !== zoneId) : [...prev, zoneId]
    );
    track("timezone_toggle", { zone: zoneId });
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 720 }}>
          <h1 className="tool-title">World Timezone Converter</h1>
          <p className="tool-subtitle">
            Find the best meeting time across timezones. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Your Timezone
              <select className="calc-select" value={baseZone} onChange={(e) => setBaseZone(e.target.value)}>
                {ZONES.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
              </select>
            </label>

            <label className="calc-label">
              Your Time
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                <select className="calc-select" style={{ flex: 1 }} value={baseHour} onChange={(e) => setBaseHour(parseInt(e.target.value, 10))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}</option>
                  ))}
                </select>
                <select className="calc-select" style={{ flex: 1 }} value={baseMinute} onChange={(e) => setBaseMinute(parseInt(e.target.value, 10))}>
                  {[0, 15, 30, 45].map((m) => <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>)}
                </select>
              </div>
            </label>

            <div style={{ marginTop: "1rem" }}>
              <span className="calc-label" style={{ marginBottom: "0.5rem" }}>Compare With</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {ZONES.filter((z) => z.id !== baseZone).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => toggleZone(z.id)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      border: compareZones.includes(z.id) ? "1px solid #0D9488" : "1px solid rgba(255,255,255,0.12)",
                      background: compareZones.includes(z.id) ? "rgba(13,148,136,0.1)" : "transparent",
                      color: compareZones.includes(z.id) ? "#0D9488" : "#9CA3AF",
                      cursor: "pointer",
                    }}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            {conversions.length > 0 && (
              <div className="calc-result" aria-live="polite">
                {conversions.map((c) => (
                  <div key={c.zone} className="calc-result-row">
                    <span>{c.label} ({c.diff})</span>
                    <strong style={{ color: c.isBusiness ? "#0D9488" : "#9CA3AF" }}>
                      {c.time} · {c.date}
                    </strong>
                  </div>
                ))}

                {overlap.length > 0 && (
                  <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px", background: "rgba(13,148,136,0.08)" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#0D9488" }}>Overlapping Business Hours</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>
                      {overlap.map((h) => `${h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}`).join(", ")} (your time)
                    </p>
                  </div>
                )}

                <ShareButtons path="/timezone" text="Find the best meeting time across timezones — free tool on DoAide Scheduler" />
              </div>
            )}
          </div>

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DoAide World Timezone Converter",
            "url": "https://scheduler.doaide.com/tools/timezone-converter",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "Convert meeting times across world timezones and find overlapping business hours. Free, no sign-up required.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }) }} />

          <section className="tool-info">
            <h2>Scheduling Across Timezones</h2>
            <p>
              Coordinating meetings across timezones is one of the biggest challenges for remote
              teams. This tool shows you the overlapping business hours so you can find a time
              that works for everyone without the mental math.
            </p>
            <h3>Best Practices</h3>
            <ul>
              <li>Target overlapping business hours for synchronous meetings</li>
              <li>Rotate meeting times to share the burden fairly</li>
              <li>Record meetings for people in non-overlap timezones</li>
              <li>Use DoAide Scheduler to automatically detect attendee timezones</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
