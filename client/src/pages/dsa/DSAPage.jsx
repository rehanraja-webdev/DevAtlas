import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  Code2,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
} from "lucide-react";

export const DSAPage = () => {
  const [problems, setProblems] = useState([]);
  const [myProgress, setMyProgress] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [platform, setPlatform] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchProblemsAndProgress = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append("search", search);
      if (difficulty) params.append("difficulty", difficulty);
      if (platform) params.append("platform", platform);

      const [probRes, progRes, statsRes] = await Promise.allSettled([
        api.get(`/dsa/problems?${params.toString()}`),
        api.get("/dsa/my-progress"),
        api.get("/dsa/stats"),
      ]);

      if (probRes.status === "fulfilled") {
        setProblems(probRes.value.data?.data?.problems || []);
        setPagination(probRes.value.data?.data?.pagination || { totalPages: 1, total: 0 });
      }

      if (progRes.status === "fulfilled") {
        const progMap = {};
        (progRes.value.data?.data?.progress || []).forEach((item) => {
          if (item.problem?._id || item.problem) {
            const pId = item.problem?._id || item.problem;
            progMap[pId] = item.status;
          }
        });
        setMyProgress(progMap);
      }

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data?.data?.stats);
      }
    } catch (err) {
      console.error("Failed to load DSA page data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemsAndProgress();
  }, [page, difficulty, platform]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProblemsAndProgress();
  };

  const handleUpdateStatus = async (problemId, newStatus) => {
    // Optimistic update
    const previous = myProgress[problemId];
    setMyProgress((prev) => ({ ...prev, [problemId]: newStatus }));

    try {
      await api.post(`/dsa/problems/${problemId}/progress`, {
        status: newStatus,
      });
      // Refresh stats in background
      const statsRes = await api.get("/dsa/stats");
      setStats(statsRes.data?.data?.stats);
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert optimistic update
      setMyProgress((prev) => ({ ...prev, [problemId]: previous }));
    }
  };

  const filteredProblems = problems.filter((prob) => {
    if (!statusFilter) return true;
    const currentStatus = myProgress[prob._id];
    if (statusFilter === "solved") return currentStatus === "solved";
    if (statusFilter === "attempted") return currentStatus === "attempted";
    if (statusFilter === "unsolved") return !currentStatus;
    return true;
  });

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Code2 className="w-7 h-7 text-indigo-400" />
            <span>DSA Problem Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Systematically practice, log attempts, and monitor algorithm consistency.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Solved
          </span>
          <p className="text-2xl font-bold text-white mt-1">{stats?.solved ?? 0}</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
            Easy
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.easy ?? 0}</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
            Medium
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats?.medium ?? 0}</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
            Hard
          </span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{stats?.hard ?? 0}</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Accuracy Rate
          </span>
          <p className="text-2xl font-bold text-indigo-300 mt-1">
            {stats?.solvedRate ?? 0}%
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problem title or topic..."
            className="w-full bg-[#141d33] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setPage(1);
            }}
            className="bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="geeksforgeeks">GeeksforGeeks</option>
            <option value="codeforces">Codeforces</option>
            <option value="codechef">CodeChef</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Progress</option>
            <option value="solved">Solved Only</option>
            <option value="attempted">Attempted Only</option>
            <option value="unsolved">Unsolved Only</option>
          </select>
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141d33] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Problem Name</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Topics</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    Loading problem catalog...
                  </td>
                </tr>
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No problems matching your current search and filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const currentStatus = myProgress[prob._id];
                  return (
                    <tr
                      key={prob._id}
                      className="hover:bg-[#141d33]/50 transition-colors"
                    >
                      {/* Status Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                prob._id,
                                currentStatus === "solved" ? "attempted" : "solved",
                              )
                            }
                            className={`p-1.5 rounded-lg border transition-all ${
                              currentStatus === "solved"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : currentStatus === "attempted"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "text-slate-600 border-slate-800 hover:text-slate-400"
                            }`}
                            title={
                              currentStatus === "solved"
                                ? "Solved! Click to set attempted"
                                : "Click to mark as solved"
                            }
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <span className="capitalize font-medium text-[11px] text-slate-300">
                            {currentStatus || "Unsolved"}
                          </span>
                        </div>
                      </td>

                      {/* Title & Link */}
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-400 flex items-center gap-1.5 group"
                        >
                          <span>{prob.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </a>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getDifficultyBadge(
                            prob.difficulty,
                          )}`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Platform */}
                      <td className="py-3.5 px-4 whitespace-nowrap capitalize text-slate-400 font-medium">
                        {prob.platform}
                      </td>

                      {/* Topics */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {prob.topics?.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                prob._id,
                                currentStatus === "attempted" ? "solved" : "attempted",
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#141d33] hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800"
                          >
                            {currentStatus === "attempted" ? "Mark Solved" : "Log Attempt"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="px-4 py-3 bg-[#141d33] border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Page {page} of {pagination.totalPages || 1} ({pagination.total || 0} total problems)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
