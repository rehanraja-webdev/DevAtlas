import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import {
  Compass,
  ArrowRight,
  Clock,
  Boxes,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  ChevronRight,
  Code2,
  Server,
  Cpu,
  Cloud,
} from "lucide-react";

export const PublicRoadmapsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [selectedTrack, setSelectedTrack] = useState("fullstack");

  const roadmapsData = {
    fullstack: {
      id: "fullstack",
      title: "Full Stack MERN Architect",
      icon: Compass,
      description: "A production-tested path from modern JavaScript fundamentals to scalable full-stack MERN engineering with secure JWT HttpOnly cookies, Docker, and caching.",
      totalHours: 190,
      milestonesCount: 9,
      difficulty: "Intermediate to Advanced",
      modules: [
        {
          key: "javascript",
          title: "JavaScript Fundamentals & ES6+ Async",
          hours: 25,
          skills: ["JavaScript", "Promises", "Event Loop", "Closures"],
          desc: "Master prototype chains, asynchronous operations, event loop internals, and modern ESNext syntax.",
        },
        {
          key: "react",
          title: "React 19 & Component Architecture",
          hours: 30,
          skills: ["React", "Custom Hooks", "Context API", "Virtual DOM"],
          desc: "Component lifecycle, custom hooks, performant rendering, and state management patterns.",
        },
        {
          key: "nodejs",
          title: "Node.js Runtime & Asynchronous I/O",
          hours: 20,
          skills: ["Node.js", "Streams", "Buffers", "Cluster Module"],
          desc: "Non-blocking event loop, file system streams, buffer operations, and server networking.",
        },
        {
          key: "express",
          title: "Express.js RESTful Clean Architecture",
          hours: 15,
          skills: ["Express.js", "Middleware", "Controllers", "Services"],
          desc: "Decouple routes, controllers, and services. Proper error handling, validators, and HTTP status standards.",
        },
        {
          key: "mongodb",
          title: "MongoDB & Mongoose Data Modeling",
          hours: 20,
          skills: ["MongoDB", "Mongoose", "Aggregation Pipeline", "Indexing"],
          desc: "Document schema design, compound indexing, aggregation pipelines, and ACID transactions.",
        },
        {
          key: "authentication",
          title: "Authentication & JWT HttpOnly Security",
          hours: 20,
          skills: ["JWT", "HttpOnly Cookies", "Refresh Token Rotation", "CSRF"],
          desc: "Industry-grade token rotation, secure cookie handling, role-based authorization (RBAC), and sanitization.",
        },
        {
          key: "redis",
          title: "Redis In-Memory Caching & Sessions",
          hours: 15,
          skills: ["Redis", "Cache Invalidation", "Rate Limiting"],
          desc: "Mitigate database bottlenecks with in-memory caching, TTL keys, and Redis distributed rate limiters.",
        },
        {
          key: "testing",
          title: "Automated Testing & Code Verification",
          hours: 15,
          skills: ["Jest", "Supertest", "Integration Tests", "TDD"],
          desc: "Write high-confidence unit tests, integration test suites, and mock database fixtures.",
        },
        {
          key: "deployment",
          title: "Docker Containerization & CI/CD Pipelines",
          hours: 20,
          skills: ["Docker", "Docker Compose", "GitHub Actions", "Nginx"],
          desc: "Containerize multi-container MERN setups, write automated build & lint workflows, and deploy securely.",
        },
      ],
    },
    frontend: {
      id: "frontend",
      title: "Frontend & UI Performance Architect",
      icon: Code2,
      description: "Deep dive into web vitals, Tailwind design systems, TypeScript, complex state machines, and Next.js / Vite pipelines.",
      totalHours: 160,
      milestonesCount: 7,
      difficulty: "Intermediate",
      modules: [
        {
          key: "css-systems",
          title: "Modern CSS, Tailwind v4 & Design Tokens",
          hours: 20,
          skills: ["Tailwind CSS", "CSS Variables", "Glassmorphism", "Responsive Layout"],
          desc: "Construct cohesive, fluid design systems with dark mode tokens and micro-interactions.",
        },
        {
          key: "typescript",
          title: "TypeScript for Enterprise React",
          hours: 25,
          skills: ["TypeScript", "Generics", "Type Narrowing", "Union Types"],
          desc: "Eliminate runtime errors with strict TypeScript generics, utility types, and component prop interfaces.",
        },
        {
          key: "state-mgmt",
          title: "State Architecture (Zustand & TanStack Query)",
          hours: 25,
          skills: ["Zustand", "TanStack React Query", "Cache Stale Times"],
          desc: "Separate client UI state from server data caches with automatic background refetching and retry queues.",
        },
        {
          key: "performance",
          title: "Core Web Vitals & Bundle Optimization",
          hours: 20,
          skills: ["Lighthouse", "Code Splitting", "Tree Shaking", "Lazy Loading"],
          desc: "Achieve sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS).",
        },
      ],
    },
    backend: {
      id: "backend",
      title: "Backend Microservices & Distributed Systems",
      icon: Server,
      description: "Design high-scale APIs, asynchronous message queues (RabbitMQ/BullMQ), distributed caching, and resilient database architectures.",
      totalHours: 200,
      milestonesCount: 8,
      difficulty: "Advanced",
      modules: [
        {
          key: "api-protocols",
          title: "REST, WebSockets & Real-Time RPC",
          hours: 25,
          skills: ["REST", "WebSocket", "Socket.io", "HTTP/2"],
          desc: "Build bidirectional live channels and high-throughput transactional APIs.",
        },
        {
          key: "distributed-db",
          title: "Relational vs NoSQL & Query Optimization",
          hours: 30,
          skills: ["PostgreSQL", "MongoDB", "Explain Plans", "Sharding"],
          desc: "Tune execution plans, database partition strategies, and connection pooling under heavy concurrent load.",
        },
        {
          key: "queues",
          title: "Message Queues & Background Workers",
          hours: 30,
          skills: ["BullMQ", "Redis Streams", "Job Retries", "Concurrency"],
          desc: "Offload long-running tasks, email pipelines, and AI inference jobs with distributed queues.",
        },
      ],
    },
  };

  const activeTrackData = roadmapsData[selectedTrack];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sequenced Engineering Curriculums</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Explore Our Production-Grade{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Career Roadmaps
          </span>
        </h1>
        <p className="text-base text-slate-300">
          Every track is modeled on actual hiring requirements at top technology companies. Sequence your study, avoid rabbit holes, and track your true completion telemetry.
        </p>

        {/* Track Switcher */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {Object.values(roadmapsData).map((track) => {
            const Icon = track.icon;
            const isSelected = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-[#141d33] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{track.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Track Overview Card */}
      <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
              Selected Track Details
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">
              {activeTrackData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {activeTrackData.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141d33] border border-slate-800 rounded-2xl p-4 shrink-0">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Effort</p>
              <p className="text-xl font-black text-white">{activeTrackData.totalHours} Hours</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Level</p>
              <p className="text-xs font-bold text-indigo-400">{activeTrackData.difficulty}</p>
            </div>
          </div>
        </div>

        {/* Milestones Curriculum */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sequenced Curriculum & Milestones
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {activeTrackData.modules.map((mod, idx) => (
              <div
                key={mod.key}
                className="p-5 rounded-2xl bg-[#141d33]/80 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">{mod.desc}</p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {mod.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-[#0b0f19] border border-slate-800 text-[10px] text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {mod.hours} hrs
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                    Step {idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner inside card */}
        <div className="mt-8 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Ready to start tracking this roadmap?</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Sign up for free to unlock prerequisite milestone tracking, completion sliders, and AI mentor progress analysis.
            </p>
          </div>
          {isAuthenticated ? (
            <Link
              to="/roadmap"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Open in My Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Start Free Track
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
