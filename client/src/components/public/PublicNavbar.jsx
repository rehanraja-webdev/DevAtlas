import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import {
  Compass,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  BookOpen,
  Boxes,
  Info,
} from "lucide-react";

export const PublicNavbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", to: "/features" },
    { name: "Roadmaps", to: "/roadmaps" },
    { name: "About", to: "/about" },
    { name: "Help Center", to: "/help" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                DevAtlas
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                v2.0
              </span>
            </div>
            <span className="block text-[11px] font-medium text-slate-400">
              Developer Career Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101728]/80 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`
            }
          >
            Overview
          </NavLink>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all group cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-[#0d1322] px-4 py-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-semibold ${
                isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            Home Overview
          </NavLink>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center"
              >
                Open DevAtlas Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#141d33] border border-slate-800 text-slate-200 text-xs font-semibold text-center"
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold text-center"
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
