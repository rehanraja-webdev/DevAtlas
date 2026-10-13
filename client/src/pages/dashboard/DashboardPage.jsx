import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import api from "../../api/client.js";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Boxes,
  Compass,
  FolderGit2,
  TrendingUp,
  AlertTriangle,
  Clock,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const DashboardPage = () => {
  const { user, profile } = useAuthStore();
  const [overview, setOverview] = useState(null);
  const [activities, setActivities] = useState([]);
  const [guidance, setGuidance] = useState(null);
  const [activityTrend, setActivityTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overviewRes, activityRes, guidanceRes, trendRes] = await Promise.allSettled([
          api.get("/analytics/overview"),
          api.get("/activities"),
          api.get("/report/guidance"),
          api.get("/analytics/activity?days=7"),
        ]);

        if (overviewRes.status === "fulfilled") {
          setOverview(overviewRes.value.data?.data?.overview);
        }
        if (activityRes.status === "fulfilled") {
          setActivities(activityRes.value.data?.data?.activities || []);
        }
        if (guidanceRes.status === "fulfilled") {
          setGuidance(guidanceRes.value.data?.data?.guidance);
        }
        if (trendRes.status === "fulfilled") {
          setActivityTrend(trendRes.value.data?.data?.activity || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const careerGoal = profile?.careerGoal || "Full Stack Developer";
  const nextAction = guidance?.nextActions?.[0] || {
    title: "Continue your current roadmap topics to advance readiness",
    link: "/roadmap",
    actionText: "Open Roadmap",
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-[#101728] rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#101728] rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-[#101728] rounded-2xl border border-slate-800" />
          <div className="h-72 bg-[#101728] rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Focus Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Good day, {user?.fullname?.split(" ")[0] || "Developer"}
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            Target Focus: <span className="text-indigo-400 font-semibold">{careerGoal}</span>
          </p>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/dsa"
            className="px-3 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Log DSA</span>
          </Link>
          <Link
            to="/skills"
            className="px-3 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Skill</span>
          </Link>
          <Link
            to="/projects"
            className="px-3 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* NEXT BEST ACTION — Hero Priority Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/70 via-[#131b31] to-[#12192c] border border-indigo-500/30 rounded-2xl p-6 sm:p-7 shadow-xl shadow-indigo-950/20">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Next Best Action</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {nextAction.title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {guidance?.insight ||
                "Calibrated from your current skill proficiencies, algorithmic practice cadence, and roadmap milestones."}
            </p>
          </div>

          <Link
            to={nextAction.link || "/roadmap"}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>{nextAction.actionText || "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* DSA Card */}
        <Link
          to="/dsa"
          className="bg-[#101728] border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 transition-all group hover:bg-[#131d33]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">DSA Solved</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {overview?.dsa?.solved ?? 0}
            </span>
            <span className="text-xs text-slate-400">
              / {overview?.dsa?.total ?? 0} attempted
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Accuracy Rate</span>
            <span className="font-semibold text-indigo-300">
              {overview?.dsa?.solvedRate ?? 0}%
            </span>
          </div>
        </Link>

        {/* Skills Card */}
        <Link
          to="/skills"
          className="bg-[#101728] border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-5 transition-all group hover:bg-[#131d33]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Tracked Skills</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {overview?.skills ?? 0}
            </span>
            <span className="text-xs text-slate-400">skills listed</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Readiness Score</span>
            <span className="font-semibold text-purple-300">
              {guidance?.readinessScore ?? 65}/100
            </span>
          </div>
        </Link>

        {/* Roadmap Card */}
        <Link
          to="/roadmap"
          className="bg-[#101728] border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-5 transition-all group hover:bg-[#131d33]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Roadmap Completion</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {overview?.roadmapProgress ?? 0}%
            </span>
            <span className="text-xs text-slate-400">complete</span>
          </div>
          {/* Visual progress bar */}
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overview?.roadmapProgress ?? 0}%` }}
            />
          </div>
        </Link>

        {/* Projects Card */}
        <Link
          to="/projects"
          className="bg-[#101728] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all group hover:bg-[#131d33]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Projects</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {overview?.projects ?? 0}
            </span>
            <span className="text-xs text-slate-400">in portfolio</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Portfolio Status</span>
            <span className="font-semibold text-emerald-300">
              {overview?.projects > 0 ? "Active" : "Needs project"}
            </span>
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Activity Trends + Focus & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Trends & Weak Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Velocity / Cadence */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Weekly Activity Cadence
                </h3>
              </div>
              <span className="text-xs text-slate-500">Last 7 Days</span>
            </div>

            {/* Visual Bar Graph */}
            <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
              {activityTrend.length > 0 ? (
                activityTrend.map((item, idx) => {
                  const maxCount = Math.max(...activityTrend.map((t) => t.count), 1);
                  const heightPercent = Math.min(100, Math.max(15, (item.count / maxCount) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[11px] font-semibold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                      <div
                        className="w-full max-w-[40px] bg-indigo-600/30 group-hover:bg-indigo-500 border border-indigo-500/40 rounded-t-lg transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {item.date ? item.date.slice(5) : `D${idx + 1}`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
                  <TrendingUp className="w-8 h-8 opacity-40 mb-2" />
                  <span>Log your first DSA solve or skill update to populate trend metrics.</span>
                </div>
              )}
            </div>
          </div>

          {/* Weak / Focus Areas */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Priority Growth Opportunities
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Areas where your proficiency or practice frequency is below the recommended threshold for {careerGoal}:
            </p>
            <div className="flex flex-wrap gap-2">
              {guidance?.weakAreas?.length > 0 ? (
                guidance.weakAreas.map((area, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5"
                  >
                    <span>{area}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  No critical weak areas detected. Maintain your consistency!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>
            <Link to="/activity" className="text-xs text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-96 pr-1">
            {activities.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No recorded activity yet.
              </div>
            ) : (
              activities.slice(0, 6).map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl bg-[#131b2e] border border-slate-800/70 flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 capitalize truncate">
                      {act.type.replace(/_/g, " ")}
                    </p>
                    {act.metadata?.title && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {act.metadata.title}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(act.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
