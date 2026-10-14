import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Binary,
  Bot,
  UserCheck,
  Languages,
  Boxes,
  FolderGit2,
  Activity,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  Mic,
  Volume2,
  ChevronRight,
  Code2,
  BarChart3,
  HelpCircle,
  Play,
} from "lucide-react";

export const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeDemoTab, setActiveDemoTab] = useState("roadmap");
  const [roadmapDemoStep, setRoadmapDemoStep] = useState(2);
  const [dsaSolvedCount, setDsaSolvedCount] = useState(24);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-64 w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] -right-64 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Eyebrow Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm hover:bg-indigo-500/15 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>The Autonomous Developer Career OS • MERN Stack & AI Agents</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-slate-400 font-normal">v2.0 Active</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Engineer Your Path to Senior Developer with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Precision Telemetry & AI
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Stop getting lost in tutorial hell and disconnected LeetCode sheets. DevAtlas combines sequenced career roadmaps, real-time DSA tracking, autonomous AI voice interviews, and actionable mentor feedback into one unified workspace.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Return to Your Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Start Free Career Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#131b2e] hover:bg-[#1a2542] border border-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </>
          )}
        </div>

        {/* Trust & Guarantee Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free Developer Tool</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Interactive Voice & LLM Models</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Open MERN Architecture</span>
          </div>
        </div>

        {/* 2. INTERACTIVE DEMO VIEWER (The "Aha!" Moment) */}
        <div className="mt-14 max-w-5xl mx-auto bg-[#101728]/90 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Mac-style Window Topbar */}
          <div className="px-5 py-3.5 bg-[#0d1322] border-b border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                devatlas-workspace.preview // interactive telemetry
              </span>
            </div>

            {/* Interactive Tab Selectors */}
            <div className="flex items-center gap-1 bg-[#141d33] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveDemoTab("roadmap")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "roadmap"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setActiveDemoTab("interview")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "interview"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Interview
              </button>
              <button
                onClick={() => setActiveDemoTab("aaravi")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "aaravi"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Agent Aaravi
              </button>
              <button
                onClick={() => setActiveDemoTab("dsa")}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "dsa"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                DSA Tracker
              </button>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="p-6 sm:p-8 text-left bg-gradient-to-b from-[#101728] to-[#0c1220]">
            {/* TAB 1: ROADMAP DEMO */}
            {activeDemoTab === "roadmap" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Active Track
                      </span>
                      <h3 className="text-lg font-bold text-white">Full-Stack MERN Architect Track</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Sequenced prerequisite graph with automated mastery metrics.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Track Progress</p>
                      <p className="text-xl font-bold text-indigo-400">{Math.round((roadmapDemoStep / 5) * 100)}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-300">
                      {Math.round((roadmapDemoStep / 5) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Simulated Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: "1. Advanced Modern JS & Async", status: "completed", hours: "25 hrs", tag: "ES6+, Event Loop" },
                    { title: "2. React 19 State & TanStack", status: roadmapDemoStep >= 2 ? "completed" : "in-progress", hours: "30 hrs", tag: "Hooks, Virtual DOM" },
                    { title: "3. Express REST & Clean Arch", status: roadmapDemoStep >= 3 ? "completed" : "in-progress", hours: "20 hrs", tag: "Controllers, Services" },
                    { title: "4. MongoDB & Schema Indexing", status: roadmapDemoStep >= 4 ? "completed" : "locked", hours: "20 hrs", tag: "Aggregation, Mongoose" },
                    { title: "5. JWT Security & Auth Cookies", status: roadmapDemoStep >= 5 ? "completed" : "locked", hours: "15 hrs", tag: "HttpOnly, Refresh flow" },
                    { title: "6. Redis Cache & Microservices", status: "locked", hours: "25 hrs", tag: "In-memory, Pub/Sub" },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => setRoadmapDemoStep(idx + 1)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        step.status === "completed"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                          : step.status === "in-progress"
                          ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-200 ring-1 ring-indigo-500/30"
                          : "bg-[#141d33] border-slate-800 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          {step.status}
                        </span>
                        <span className="text-[10px] text-slate-400">{step.hours}</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-2">{step.title}</p>
                      <span className="mt-2 inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                        {step.tag}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 text-center italic">
                  💡 Click any step to simulate real-time progress updating and milestone unblocking.
                </p>
              </div>
            )}

            {/* TAB 2: AI INTERVIEW DEMO */}
            {activeDemoTab === "interview" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live AI Technical Interview: Round 2 (System Design)</h4>
                      <p className="text-xs text-slate-400">Target Role: Senior Full-Stack Engineer • Candidate Resume Parsed</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Audio Connected
                  </span>
                </div>

                {/* Dialog Mockup */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Technical Lead:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      "I see on your resume that you built a high-throughput notifications service in DevAtlas. How would you handle 50,000 concurrent WebSocket connections while preventing MongoDB connection pool exhaustion?"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 text-xs space-y-1 ml-4 sm:ml-8">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                      <Mic className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                      <span>Candidate Voice Input (Live Speech-to-Text):</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      "We decouple connection state using a Redis pub/sub adapter so multiple Node instances can broadcast without opening individual DB streams. We also queue database writes with BullMQ workers in batch increments."
                    </p>
                  </div>

                  {/* Evaluation Rubric preview */}
                  <div className="p-3.5 rounded-xl bg-[#131b2e] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>AI Evaluation: High Architectural Soundness (9.2 / 10)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Identified horizontal scale bottlenecks & cache decoupling</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AGENT AARAVI DEMO */}
            {activeDemoTab === "aaravi" && (
              <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                {/* Visual Orb */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-indigo-600/30 animate-orb-wave-1 blur-md" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-bl from-purple-500/40 to-pink-500/40 animate-orb-wave-2 blur-sm" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center animate-orb-breathe">
                      <Languages className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-bold text-purple-300">Agent Aaravi</span>
                  <span className="text-[10px] text-slate-400">Indian Female Persona (en-IN)</span>
                </div>

                {/* Subtitle & Coaching Card */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Aaravi's Spoken Feedback</span>
                      <span className="text-[10px] text-slate-400">Daily Standup Simulation</span>
                    </div>
                    <p className="text-slate-200 italic leading-relaxed">
                      "Great start! You explained the blocker clearly. However, instead of saying <span className="line-through text-rose-400">'I did finished the API'</span>, say <span className="text-emerald-400 font-semibold">'I have finished the API endpoint'</span>. In daily standups, present tense sounds crisp and professional!"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      <p className="text-[10px] font-bold uppercase">Vocabulary Boost</p>
                      <p className="font-semibold text-white mt-0.5">"Mitigate latency" instead of "make faster"</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      <p className="text-[10px] font-bold uppercase">Fluency Score</p>
                      <p className="font-semibold text-white mt-0.5">88% Natural pacing & clear pauses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DSA TRACKER DEMO */}
            {activeDemoTab === "dsa" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Binary className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Curated Blind 75 & Top Tech Catalog</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Total Solved:</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{dsaSolvedCount} / 75</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Problem Title</th>
                        <th className="py-2 px-3">Difficulty</th>
                        <th className="py-2 px-3">Topics</th>
                        <th className="py-2 px-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { title: "Two Sum", diff: "Easy", topics: "Array, Hash Map", solved: true },
                        { title: "Longest Substring Without Repeating", diff: "Medium", topics: "Sliding Window", solved: true },
                        { title: "LRU Cache Design", diff: "Medium", topics: "Hash Map, Doubly Linked List", solved: false },
                        { title: "Trapping Rain Water", diff: "Hard", topics: "Two Pointer, Stack", solved: false },
                      ].map((prob, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold ${
                                prob.solved ? "text-emerald-400" : "text-amber-400"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {prob.solved ? "Solved" : "Pending"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">{prob.title}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prob.diff === "Easy"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : prob.diff === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {prob.diff}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{prob.topics}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setDsaSolvedCount((prev) => prev + 1)}
                              className="px-2.5 py-1 rounded bg-[#141d33] hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. METRICS BAR */}
      <section className="border-y border-slate-800/80 bg-[#0d1322] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">500+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Curated DSA Problems</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">6+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Sequenced Career Tracks</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">&lt; 1s</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Autonomous AI Response</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Free & Open Architecture</p>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM VS DEVATLAS (Why Coders Get Stuck) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">The Developer Growth Paradox</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Disconnected Tutorials Never Turn Coders into Software Architects
          </h3>
          <p className="mt-4 text-sm text-slate-400">
            Most aspiring engineers consume hundreds of video hours and solve random LeetCode problems without a structured telemetry system to measure true competence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without DevAtlas */}
          <div className="p-8 rounded-2xl bg-[#121624] border border-rose-500/20 space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center font-bold">✕</div>
              <h4 className="text-lg font-bold">The Fragmented Approach</h4>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Scattered bookmarks across 10 different course sites with zero completion telemetry.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Blind LeetCoding without understanding how data structures map to real backend microservices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Freezes during real technical rounds because mock interviews cost $200/hr or don't exist.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>Struggles with English verbal articulation during daily standups and engineering syncs.</span>
              </li>
            </ul>
          </div>

          {/* With DevAtlas */}
          <div className="p-8 rounded-2xl bg-[#121a30] border border-indigo-500/40 space-y-5 shadow-xl shadow-indigo-950/30">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center font-bold">✓</div>
              <h4 className="text-lg font-bold text-white">The DevAtlas Engineered Workspace</h4>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Single active roadmap with sequenced milestones and prerequisite locks based on industry standards.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>DSA practice linked directly to platform problem catalogs with difficulty telemetry.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Unlimited autonomous AI technical interviews tailored to your exact stack and resume projects.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Conversational spoken English practice with Agent Aaravi for confident global communication.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURE PILLARS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d17] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Platform Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Six Interconnected Engines for Complete Developer Preparation
            </h3>
            <p className="mt-4 text-sm text-slate-400">
              Every feature in DevAtlas feeds data into the centralized AI mentor to provide you with continuous, high-signal feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Roadmaps */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Sequenced Learning Roadmaps</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step career tracks (Full Stack MERN, Frontend, Backend, AI Engineering) with prerequisite dependency graphs so you learn technologies in logical sequence.
              </p>
              <Link to="/roadmaps" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                <span>View Roadmaps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: DSA Tracker */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <Binary className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">DSA Practice Tracker</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log problems across LeetCode and GeeksforGeeks. Track difficulty ratios, topic mastery percentages, and identify weak algorithmic patterns before interviews.
              </p>
              <Link to="/features#dsa" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300">
                <span>Explore Problem Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: AI Interviewer */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Autonomous AI Tech Interviewer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parses your projects and skills directly from your resume. Conducts multi-turn voice interviews with live microphone speech recognition and structured scorecards.
              </p>
              <Link to="/features#interview" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300">
                <span>Learn About Voice AI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4: Agent Aaravi */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Languages className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Aaravi: Spoken English AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tactile voice partner featuring Indian female voice synthesis. Practice daily standups, architectural discussions, and casual office small talk with instant grammar corrections.
              </p>
              <Link to="/features#english" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Meet Agent Aaravi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 5: Skills & Projects */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                <Boxes className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Skills & Project Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Catalog your verified skills across frontend, backend, database, and devops. Show real GitHub repositories and live deployments to validate your proof of work.
              </p>
              <Link to="/features#skills" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300">
                <span>View Portfolio System</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 6: AI Mentor Reports */}
            <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Automated AI Growth Reports</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Weekly telemetry synthesizes your DSA solve rate, roadmap progression, and interview results to recommend your single Next Best Action.
              </p>
              <Link to="/features#mentor" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                <span>See Mentor Guidance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (The 4-Step Process) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Simple, Disciplined Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DevAtlas Takes You From Zero to Offer
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Pick Your Goal",
              desc: "Select your target role: Full-Stack MERN, Frontend, or Backend Architect to calibrate your dashboard.",
            },
            {
              step: "02",
              title: "Follow Milestones",
              desc: "Work through sequenced roadmap items, logging code milestones and daily DSA problem challenges.",
            },
            {
              step: "03",
              title: "Test with AI Agents",
              desc: "Run full mock technical interviews and voice conversations with Agent Aaravi to perfect communication.",
            },
            {
              step: "04",
              title: "Receive Telemetry",
              desc: "Review weekly diagnostic reports to eliminate blind spots and demonstrate true production readiness.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#101728] border border-slate-800 relative">
              <span className="text-3xl font-black text-indigo-500/30">{item.step}</span>
              <h4 className="text-base font-bold text-white mt-2 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION HERO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-[#101728] to-purple-900/40 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Developer Journey?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of developers using DevAtlas to structure their skills, solve DSA problems, and master technical interviews with autonomous AI agents.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Open DevAtlas Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/help"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Have Questions? Visit Help Center</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
