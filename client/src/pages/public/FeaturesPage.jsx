import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import {
  Compass,
  Binary,
  UserCheck,
  Languages,
  Boxes,
  FolderGit2,
  Bot,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Mic,
  Cpu,
  Layers,
  Database,
  BarChart3,
  HelpCircle,
} from "lucide-react";

export const FeaturesPage = () => {
  const { isAuthenticated } = useAuthStore();

  const comparisonData = [
    {
      feature: "Structured Milestone Sequence & Prerequisites",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "Dynamic DSA Tracker with Difficulty Ratios",
      devatlas: true,
      spreadsheets: "Partial",
      videoCourses: false,
      genericLeetcode: true,
    },
    {
      feature: "Autonomous Voice AI Mock Technical Interviews",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "Resume Visualizer & Stack-Specific Interrogation",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "Spoken English Voice Coach with Indian Accent (Aaravi)",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "Real-time Grammar & Standup Fluency Diagnostics",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "Automated Weekly AI Mentor Guidance & Signal Reports",
      devatlas: true,
      spreadsheets: false,
      videoCourses: false,
      genericLeetcode: false,
    },
    {
      feature: "100% Free Without Paywalled Tiers",
      devatlas: true,
      spreadsheets: true,
      videoCourses: false,
      genericLeetcode: "Partial",
    },
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Complete Feature Breakdown</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Everything You Need to Become an{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Elite Full-Stack Engineer
          </span>
        </h1>
        <p className="text-base text-slate-300">
          DevAtlas replaces fragmented learning tools with a deeply integrated, production-level career operating system.
        </p>
      </div>

      {/* 2. Deep Dive Modules */}
      <div className="space-y-16">
        {/* Module 1: Roadmaps */}
        <div id="roadmaps" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#101728] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Engine 01</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Sequenced Career Roadmaps with Prerequisite Locking
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional roadmaps are static images that quickly get forgotten. DevAtlas turns roadmaps into an interactive state machine. Each milestone has documented dependencies, estimated mastery hours, and direct skill linkages.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict dependency graph prevents skipping fundamentals (e.g. JS Async before React state).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic percentage completion metrics calibrated to total study hours.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click status toggling with instant database persistence.</span>
              </li>
            </ul>
            <div className="pt-3">
              <Link
                to="/roadmaps"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                <span>Browse Curated Roadmap Curriculums</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-[#141d33] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">Roadmap Graph State</span>
              <span className="text-xs text-indigo-400 font-bold">MERN Architecture</span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-emerald-300">JavaScript ES6+ & Async Runtime</p>
                  <p className="text-[11px] text-slate-400">25 hrs • Event loop, Promises, Closures</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">100% DONE</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-600/15 border border-indigo-500/40 flex items-center justify-between text-xs ring-1 ring-indigo-500/30">
                <div>
                  <p className="font-bold text-indigo-200">React 19 & Component Architecture</p>
                  <p className="text-[11px] text-slate-400">30 hrs • Hooks, Virtual DOM, Render cycles</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">IN PROGRESS</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center justify-between text-xs opacity-60">
                <div>
                  <p className="font-bold text-slate-400">Node.js & Express RESTful API Design</p>
                  <p className="text-[11px] text-slate-500">20 hrs • Prerequisite: React 19</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-[10px]">LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: DSA Tracker */}
        <div id="dsa" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#101728] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="order-2 lg:order-1 bg-[#141d33] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">DSA Telemetry Breakdown</span>
              <span className="text-xs text-purple-400 font-bold">Blind 75 & LeetCode</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Easy</span>
                <p className="text-lg font-black text-white mt-1">42 / 50</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Medium</span>
                <p className="text-lg font-black text-white mt-1">28 / 40</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-400 font-bold uppercase">Hard</span>
                <p className="text-lg font-black text-white mt-1">8 / 15</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Top Solved Category</span>
                <span className="text-white font-semibold">Arrays & HashMaps (94%)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Recommended Focus Area</span>
                <span className="text-amber-400 font-semibold">Dynamic Programming & Graphs</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Binary className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Core Engine 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Algorithmic Problem Matrix & Difficulty Analytics
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track your LeetCode and GeeksforGeeks solutions without tedious spreadsheet formatting. DevAtlas automatically categorizes problems by algorithm paradigm, tracks solve counts across Easy, Medium, and Hard tiers, and flags problem patterns where you need more practice.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct external deep links to the original LeetCode / GFG problem statements.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Filter by topic (Two Pointer, Trees, Sliding Window, Backtracking, DP).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Data directly informs your AI Mentor's weekly recommended practice action.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Module 3: AI Interviewer */}
        <div id="interview" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#101728] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Core Engine 03</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Autonomous AI Technical Interviewer & Visual Resume
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generic interview prep asks generic questions. DevAtlas parses your exact projects, tech stack, and experience into a Visual Resume, then conducts live multi-turn technical interviews with voice synthesis and speech recognition.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Asks deep architectural trade-off questions based on the projects in your portfolio.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hands-free microphone input with continuous speech-to-text transcript generation.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Generates an instant hiring rubric scorecard: strengths, weak points, and hiring verdict.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#141d33] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400">Interview Scorecard Result</span>
              <span className="text-emerald-400 font-bold">VERDICT: STRONG HIRE</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">System Architecture</span>
                <span className="font-bold text-white">9 / 10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[90%]" />
              </div>

              <div className="flex justify-between items-center py-1 mt-2">
                <span className="text-slate-400">Data Modeling & Scale</span>
                <span className="font-bold text-white">8.5 / 10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[85%]" />
              </div>

              <div className="flex justify-between items-center py-1 mt-2">
                <span className="text-slate-400">Communication & Clarity</span>
                <span className="font-bold text-white">9.5 / 10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full w-[95%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: Agent Aaravi */}
        <div id="english" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#101728] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="order-2 lg:order-1 bg-[#141d33] border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-xl flex items-center justify-center animate-orb-breathe">
                <Languages className="w-9 h-9 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Agent Aaravi Voice Stream</p>
              <p className="text-xs text-pink-400 font-medium">Native Indian Female Synthesis (en-IN)</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-slate-300 text-left italic">
              "You communicated your system design clearly! Try using 'resilient to network partitions' instead of 'it does not fail'. That sounds much more senior during engineering syncs."
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Languages className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Core Engine 04</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Agent Aaravi: Spoken English & Standup Fluency
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Technical capability is only half the battle. Many engineers miss out on top global roles due to hesitation in spoken English. Agent Aaravi is a conversational AI designed specifically for developers, providing a safe, judgment-free environment to practice everyday engineering communication.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Scenarios for Daily Scrum Standups, Salary Negotiations, and Team Architectural Debates.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant grammar corrections and professional vocabulary upgrades.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hands-free voice orb UI modeled after modern frontier AI assistants.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. COMPARISON TABLE */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Architectural Comparison</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why DevAtlas Outperforms Fragmented Tools
          </h3>
        </div>

        <div className="overflow-x-auto bg-[#101728] border border-slate-800 rounded-2xl shadow-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-[#0d1322]">
                <th className="py-4 px-5">Capability / Engine</th>
                <th className="py-4 px-4 text-center text-indigo-400 font-bold bg-indigo-500/10">DevAtlas</th>
                <th className="py-4 px-4 text-center">Spreadsheets</th>
                <th className="py-4 px-4 text-center">Video Courses</th>
                <th className="py-4 px-4 text-center">Isolated LeetCode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-white">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center bg-indigo-500/5">
                    {row.devatlas === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-amber-400 font-bold">{row.devatlas}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.spreadsheets === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : row.spreadsheets === false ? (
                      <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                    ) : (
                      <span className="text-amber-400 font-semibold">{row.spreadsheets}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.videoCourses === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : row.videoCourses === false ? (
                      <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                    ) : (
                      <span className="text-amber-400 font-semibold">{row.videoCourses}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.genericLeetcode === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : row.genericLeetcode === false ? (
                      <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                    ) : (
                      <span className="text-amber-400 font-semibold">{row.genericLeetcode}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bottom CTA */}
      <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-[#101728] to-purple-900/40 border border-indigo-500/30 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">Experience the Difference Yourself</h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Start your structured roadmap, run your first mock technical interview, or practice spoken English in under two minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Create Your Free Account
          </Link>
          <Link
            to="/help"
            className="px-6 py-3 rounded-xl bg-[#141d33] hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Visit Help Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
