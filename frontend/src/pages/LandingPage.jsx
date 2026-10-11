import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DOAIDE_PRODUCTS = [
  { name: "Proposals", url: "https://proposals.doaide.com" },
  { name: "Scheduler", url: "https://scheduler.doaide.com" },
  { name: "Payroll", url: "https://payroll.doaide.com" },
  { name: "Inventory", url: "https://inventory.doaide.com" },
  { name: "Support", url: "https://support.doaide.com" },
  { name: "Analytics", url: "https://analytics-app.doaide.com" },
  { name: "GST", url: "https://gst.doaide.com" },
  { name: "Desk", url: "https://desk.doaide.com" },
  { name: "Jobs", url: "https://job.doaide.com" },
  { name: "409A", url: "https://409a.doaide.com" },
  { name: "Pulse", url: "https://pulse.doaide.com" },
  { name: "Med", url: "https://med.doaide.com" },
  { name: "Realty", url: "https://realty.doaide.com" },
  { name: "Reach", url: "https://reach.doaide.com" },
  { name: "Trade", url: "https://trade.doaide.com" },
];

const FEATURES = [
  {
    title: "Smart Scheduling",
    desc: "Set availability rules and let AI find the best times for everyone. No more back-and-forth emails.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></svg>
    ),
  },
  {
    title: "Booking Links",
    desc: "Share personalized booking pages for each meeting type. Clients pick a time that works for them.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
    ),
  },
  {
    title: "Team Scheduling",
    desc: "Round-robin assignment and collective availability for team meetings. Fair distribution guaranteed.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
    ),
  },
  {
    title: "Calendar Sync",
    desc: "Two-way sync with Google Calendar, Outlook, and iCal. Changes reflect instantly across all calendars.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
    ),
  },
  {
    title: "Custom Branding",
    desc: "Branded booking pages with your logo, colors, and custom domain. Make it yours.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><path d="M17.5 10.5c3 0 4.5 1.5 4.5 4v1h-4" /><circle cx="8.5" cy="6.5" r="2.5" /><path d="M2 15.5c0-2.5 1.5-4 4.5-4h4c3 0 4.5 1.5 4.5 4v1H2v-1z" /></svg>
    ),
  },
  {
    title: "Analytics & Insights",
    desc: "Track booking rates, popular times, no-shows, and meeting trends. Data-driven scheduling.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Set your availability", desc: "Define your working hours, buffer times, and meeting duration. Set different rules for each meeting type." },
  { step: "2", title: "Share your booking link", desc: "Send your personalized booking page to clients, or embed it on your website. They see only open slots." },
  { step: "3", title: "Meetings confirmed automatically", desc: "Clients pick a time, calendar syncs instantly, and both parties get confirmation. Zero back-and-forth." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "For individuals getting started",
    features: ["20 meetings/month", "1 meeting type", "Email notifications", "Basic booking page"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For professionals and consultants",
    features: ["Unlimited meetings", "Unlimited meeting types", "Google Calendar sync", "Custom branding", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$25",
    period: "/month",
    desc: "For growing teams",
    features: ["Everything in Pro", "Team scheduling", "Round-robin", "Collective availability", "Analytics dashboard"],
    cta: "Start Free Trial",
  },
];

const TESTIMONIALS = [
  { name: "Alex R.", role: "Financial Advisor", quote: "We eliminated 90% of the back-and-forth emails to schedule meetings. Clients just pick a time and it's done." },
  { name: "Maria L.", role: "Sales Director", quote: "The round-robin feature is perfect for our sales team. Leads are distributed fairly and no one gets overbooked." },
  { name: "David C.", role: "Dentist", quote: "Booking links on our website increased consultation bookings by 40%. Setup took five minutes." },
];

const FAQ_ITEMS = [
  { q: "How does DoAide Scheduler prevent double-booking?", a: "It syncs with your calendar in real-time. When someone books a slot, it's immediately blocked across all connected calendars. No manual coordination needed." },
  { q: "Can I set different availability for different meeting types?", a: "Yes. Each meeting type has its own availability rules, buffer times, and duration settings. A 15-minute check-in and a 60-minute consultation can have completely separate schedules." },
  { q: "Does it work with Google Calendar?", a: "Yes. Two-way sync with Google Calendar, Microsoft Outlook, and Apple iCal. Changes reflect instantly so your schedule is always accurate." },
  { q: "Can my team use it together?", a: "Yes. Team plans support round-robin scheduling, collective availability, and shared meeting types. Perfect for sales teams and support desks." },
  { q: "Is there a free plan?", a: "Yes. The Free plan includes 20 meetings per month with one meeting type. No credit card required to get started." },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="py-20 px-4 sm:px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <dt>
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  aria-expanded={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.q}
                  <span className="ml-4 text-[#0D9488] text-xl flex-shrink-0">{openIndex === i ? "−" : "+"}</span>
                </button>
              </dt>
              {openIndex === i && (
                <dd className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function AuthCard() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ email, password, business_name: businessName, full_name: fullName });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-[#1A1A1D] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mode === "login"
              ? "border-[#0D9488] text-[#0D9488]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setMode("login")}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mode === "register"
              ? "border-[#0D9488] text-[#0D9488]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setMode("register")}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <>
            <input
              type="text"
              placeholder="Business name"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <button
          type="submit"
          className="w-full py-2.5 bg-[#0D9488] text-white font-semibold rounded-lg hover:bg-[#0B7C72] transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B]">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <a href="https://doaide.com" className="flex items-center gap-2.5 no-underline">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            DoAide <span className="text-[#0D9488]">|</span> <span className="text-[#0D9488]">Scheduler</span>
          </span>
        </a>
        <nav className="flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">
            Pricing
          </Link>
        </nav>
      </header>

      <main>
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Smart Meeting Scheduling{" "}
                <span className="text-[#0D9488]">for Businesses</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                Share your booking link, let clients pick a time, and never double-book again.
                AI-powered scheduling that works around your calendar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  Free forever
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  No credit card
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 text-[#0D9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  20 meetings/month
                </div>
              </div>
            </div>
            <AuthCard />
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Everything You Need for Effortless Scheduling
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">
              From personal booking pages to team round-robin, DoAide Scheduler handles every scheduling scenario.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/30 transition-colors">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6" aria-labelledby="how-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="how-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-14">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0D9488] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="pricing-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14">Start free. Upgrade when you need more.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-xl border ${
                    plan.featured ? "border-[#0D9488] ring-2 ring-[#0D9488]/20" : "border-gray-200 dark:border-gray-700"
                  } bg-white dark:bg-[#0A0A0B]`}
                >
                  {plan.featured && <span className="text-xs font-semibold text-[#0D9488] uppercase tracking-wide">Most Popular</span>}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.desc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-[#0D9488] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                      plan.featured
                        ? "bg-[#0D9488] text-white hover:bg-[#0B7C72]"
                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6" aria-labelledby="testimonials-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-14">
              Trusted by Professionals Everywhere
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.name} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111113]">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <footer>
                    <strong className="text-gray-900 dark:text-white">{t.name}</strong>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="tools-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="tools-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Free Scheduling Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">
              No signup required. Use these tools instantly to optimize your meetings.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/calculator" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4B0;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">Meeting Cost Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Find out how much your meetings really cost per year.</p>
              </Link>
              <Link to="/tools/meeting-planner" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F916;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">AI Meeting Planner</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Generate structured meeting agendas with AI in seconds.</p>
              </Link>
              <Link to="/tools/weekly-planner" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4C5;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">Weekly Planner</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Plan your week with time-blocking and category tracking.</p>
              </Link>
              <Link to="/timezone" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F30D;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">Timezone Converter</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Convert meeting times across timezones with overlap detection.</p>
              </Link>
              <Link to="/tools/availability-finder" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F50D;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">Availability Finder</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Find overlapping available slots across multiple schedules.</p>
              </Link>
              <Link to="/templates-gallery" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#0D9488]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4C4;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#0D9488] transition-colors">Scheduling Templates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">6 ready-made templates for standups, demos, interviews, and more.</p>
              </Link>
            </div>
          </div>
        </section>

        <FaqSection />

        <section className="py-20 px-4 sm:px-6 text-center bg-gray-50 dark:bg-[#111113]">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Simplify Your Scheduling?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            Start scheduling smarter today. Free forever for up to 20 meetings per month.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block px-8 py-3.5 bg-[#0D9488] text-white text-lg font-semibold rounded-lg hover:bg-[#0B7C72] transition-colors cursor-pointer"
          >
            Get Started Free
          </button>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/pricing" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Pricing</Link>
                <a href="#features-heading" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("features-heading")?.scrollIntoView({ behavior: "smooth" }); }}>Features</a>
                <a href="#faq-heading" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("faq-heading")?.scrollIntoView({ behavior: "smooth" }); }}>FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Free Tools</h4>
              <div className="space-y-2 text-sm">
                <Link to="/calculator" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Meeting Cost Calculator</Link>
                <Link to="/tools/meeting-planner" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">AI Meeting Planner</Link>
                <Link to="/tools/weekly-planner" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Weekly Planner</Link>
                <Link to="/timezone" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Timezone Converter</Link>
                <Link to="/tools/availability-finder" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Availability Finder</Link>
                <Link to="/templates-gallery" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Scheduling Templates</Link>
                <Link to="/embed" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Embed Widgets</Link>
                <Link to="/blog" className="block text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">Blog</Link>
              </div>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">DoAide Products</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {DOAIDE_PRODUCTS.map((p) => (
                  <a key={p.name} href={p.url} className="text-gray-500 dark:text-gray-400 hover:text-[#0D9488] no-underline">{p.name}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <a href="https://doaide.com" className="flex items-center gap-2 no-underline">
              <span className="inline-block px-2.5 py-1 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold rounded-full">A DoAide Product</span>
            </a>
            <span className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
