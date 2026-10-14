import { Link } from "react-router-dom";
import { Compass, Sparkles, Heart, Shield, Terminal, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons.jsx";

export const PublicFooter = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080c14] text-slate-400 text-xs">
      {/* Top Banner / Value Callout */}
      <div className="border-b border-slate-800/60 py-8 bg-gradient-to-b from-[#0b0f19] to-[#080c14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">DevAtlas Platform Live & Operational</p>
              <p className="text-slate-400 text-xs">Serving developers preparing for top-tier full-stack engineering roles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/roadmaps"
              className="px-3.5 py-1.5 rounded-lg bg-[#141d33] hover:bg-[#1a2542] border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Roadmaps</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/help"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Get Support & Docs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DevAtlas
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              DevAtlas is an industry-grade developer career OS built on the MERN stack. Designed to transform aspiring coders into senior-calibre full-stack architects through structured roadmaps, algorithm tracking, and autonomous voice AI interview systems.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#131b2e] border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#131b2e] border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/features#roadmaps" className="hover:text-indigo-400 transition-colors">Career Roadmaps</Link>
              </li>
              <li>
                <Link to="/features#dsa" className="hover:text-indigo-400 transition-colors">DSA Problem Tracker</Link>
              </li>
              <li>
                <Link to="/features#interview" className="hover:text-indigo-400 transition-colors">AI Tech Interviewer</Link>
              </li>
              <li>
                <Link to="/features#english" className="hover:text-indigo-400 transition-colors">AI Coach Aaravi</Link>
              </li>
              <li>
                <Link to="/features#skills" className="hover:text-indigo-400 transition-colors">Skills Telemetry</Link>
              </li>
              <li>
                <Link to="/features#mentor" className="hover:text-indigo-400 transition-colors">AI Mentor Guidance</Link>
              </li>
            </ul>
          </div>

          {/* Roadmaps & Learning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tracks</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/roadmaps" className="hover:text-indigo-400 transition-colors">Full-Stack MERN</Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-indigo-400 transition-colors">Frontend Architecture</Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-indigo-400 transition-colors">Backend Microservices</Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-indigo-400 transition-colors">AI Systems Engineer</Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-indigo-400 transition-colors">DevOps & Cloud</Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Help & Docs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center & FAQ</Link>
              </li>
              <li>
                <Link to="/help#diagnostics" className="hover:text-indigo-400 transition-colors">Browser Diagnostics</Link>
              </li>
              <li>
                <Link to="/help#troubleshooting" className="hover:text-indigo-400 transition-colors">Troubleshooting</Link>
              </li>
              <li>
                <Link to="/help#contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About DevAtlas</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & badges */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} DevAtlas Platform. Designed for modern engineering mastery.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>React 19 • Express • MongoDB • Groq LLMs</span>
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <Link to="/help" className="hover:text-slate-300">Privacy & Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
