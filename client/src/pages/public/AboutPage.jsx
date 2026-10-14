import { Link } from "react-router-dom";
import {
  Compass,
  Code2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Heart,
  Cpu,
  Layers,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { GithubIcon } from "../../components/common/BrandIcons.jsx";

export const AboutPage = () => {
  const principles = [
    {
      num: "01",
      title: "Concept Before Code",
      desc: "Never write or copy-paste code without understanding the underlying protocol, memory model, or algorithmic complexity.",
    },
    {
      num: "02",
      title: "Small Practical Increments",
      desc: "Deconstruct complex distributed systems into small, testable architectural units rather than monolithic leaps.",
    },
    {
      num: "03",
      title: "Production Patterns Over Toys",
      desc: "Implement genuine industry practices: JWT HttpOnly cookies, decoupled service layers, database indexing, and defensive error middleware.",
    },
    {
      num: "04",
      title: "Active Telemetry Over Guesswork",
      desc: "Track real metrics: DSA solve rates, roadmap milestones, and interview rubric evaluations to eliminate engineering blind spots.",
    },
    {
      num: "05",
      title: "AI as an Accelerant, Not a Crutch",
      desc: "Use AI agents (Aaravi & the Tech Interviewer) to simulate high-stakes evaluation and sharpen your independent critical thinking.",
    },
    {
      num: "06",
      title: "Global Communication Readiness",
      desc: "Pair technical mastery with verbal articulation so you can excel in international engineering syncs and daily standups.",
    },
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Our Engineering Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Built to Bridge the Gap Between{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tutorial Hell & Senior Engineering
          </span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          DevAtlas was designed from the ground up as both a production-oriented developer workspace and a masterclass in clean full-stack MERN architecture.
        </p>
      </div>

      {/* 2. The Mission Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-[#101728] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">The DevAtlas Mission</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why We Built DevAtlas
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              In modern software development, aspiring engineers face an overwhelming paradox: there is more free educational content than ever before, yet landing a high-impact engineering role has never been more competitive.
            </p>
            <p>
              Tutorials teach coders how to assemble cookie-cutter apps, but they don't teach architectural trade-offs, defensive error handling, token rotation security, or how to explain complex systems during high-stakes technical interviews.
            </p>
            <p>
              DevAtlas was engineered to fix this. By unifying career roadmaps, algorithm tracking, autonomous AI voice interview simulations, and spoken English practice with Agent Aaravi, DevAtlas provides a single disciplined workspace where developers transform into confident engineering professionals.
            </p>
          </div>
        </div>

        <div className="space-y-4 bg-[#141d33] border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">The DevAtlas Guarantee</p>
              <p className="text-[11px] text-slate-400">Industry-standard engineering rigor</p>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>100% Free & Open Developer Access:</strong> No hidden subscriptions or artificial feature locks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Clean Architecture:</strong> Layered controllers, services, middleware, and models.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Sub-Second AI Agent Pipeline:</strong> Real-time Groq LLM inference and Web Speech synthesis.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. The 6 Engineering Principles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Guiding Standards</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            The DevAtlas Learning Method
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p) => (
            <div key={p.num} className="p-6 rounded-2xl bg-[#101728] border border-slate-800 hover:border-indigo-500/30 transition-all">
              <span className="text-2xl font-black text-indigo-500/30">{p.num}</span>
              <h4 className="text-base font-bold text-white mt-2 mb-2">{p.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tech Stack Architecture Showcase */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Technical Foundation</span>
          <h3 className="text-2xl font-bold text-white">Modern Full-Stack Architecture</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80">
            <Code2 className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">React 19 & Vite</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Ultra-fast HMR & modern hooks</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80">
            <Terminal className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Express.js & Node</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Clean service-controller pattern</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80">
            <Layers className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">MongoDB & Mongoose</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Aggregations & index optimizations</p>
          </div>
          <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80">
            <Cpu className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Groq & Web Speech</p>
            <p className="text-[10px] text-slate-400 mt-0.5">High-speed voice & LLM reasoning</p>
          </div>
        </div>
      </div>

      {/* 5. Help & Support CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#101728] to-purple-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white">Need guidance or have a suggestion?</h4>
          <p className="text-xs text-slate-300 mt-1">
            Our comprehensive Help Center includes browser diagnostics, FAQs, and a direct ticket submission form.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/help"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Open Help Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
