import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Boxes,
  ArrowRight,
  BookOpen,
  Layers,
  Code2,
  Server,
  Cpu,
  Terminal,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";

export const RoadmapPage = () => {
  const [userRoadmap, setUserRoadmap] = useState(null);
  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTrackSwitcher, setShowTrackSwitcher] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const [myRes, allRes] = await Promise.allSettled([
        api.get("/roadmaps/my-roadmap"),
        api.get("/roadmaps"),
      ]);

      if (myRes.status === "fulfilled" && myRes.value.data?.data?.roadmap) {
        setUserRoadmap(myRes.value.data?.data?.roadmap);
      } else {
        setUserRoadmap(null);
      }

      if (allRes.status === "fulfilled") {
        setAllRoadmaps(allRes.value.data?.data?.roadmaps || []);
      }
    } catch (err) {
      console.error("Failed to load roadmap data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartRoadmap = async (roadmapId) => {
    try {
      setLoading(true);
      setErrorMessage("");
      await api.post(`/roadmaps/${roadmapId}/start`);
      setShowTrackSwitcher(false);
      await fetchData();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to start roadmap.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (itemKey, percent) => {
    try {
      setUpdatingKey(itemKey);
      setErrorMessage("");
      const { data } = await api.patch(`/roadmaps/my-roadmap/items/${itemKey}`, {
        progressPercent: percent,
      });

      const updatedProgress = data?.data?.userRoadmap?.progress;
      const updatedOverall = data?.data?.userRoadmap?.overallProgress;

      setUserRoadmap((prev) => ({
        ...prev,
        progress: updatedProgress || prev.progress,
        overallProgress: updatedOverall ?? prev.overallProgress,
      }));
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Could not update topic progress.",
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  if (loading && !userRoadmap && allRoadmaps.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading learning roadmaps...</p>
      </div>
    );
  }

  const roadmapItems = userRoadmap?.roadmap?.items || [];
  const progressMap = {};
  (userRoadmap?.progress || []).forEach((p) => {
    progressMap[p.itemKey] = p;
  });

  const getTrackIcon = (goal) => {
    switch (goal) {
      case "frontend-developer":
        return Code2;
      case "backend-developer":
        return Server;
      case "ai-engineer":
        return Cpu;
      case "software-engineer":
        return Terminal;
      default:
        return Compass;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Learning Roadmap</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured career milestones with prerequisite sequencing, topic mastery, and skill telemetry.
          </p>
        </div>

        {userRoadmap && allRoadmaps.length > 1 && (
          <button
            onClick={() => setShowTrackSwitcher(!showTrackSwitcher)}
            className="px-4 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{showTrackSwitcher ? "Close Tracks" : "Switch Career Track"}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              {allRoadmaps.length} Tracks
            </span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TRACK SWITCHER DRAWER / CATALOG */}
      {(showTrackSwitcher || !userRoadmap) && (
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Available Career Tracks</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switching tracks saves your current progress. You can return anytime.
              </p>
            </div>
            {userRoadmap && (
              <button
                onClick={() => setShowTrackSwitcher(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {allRoadmaps.map((rm) => {
              const TrackIcon = getTrackIcon(rm.careerGoal);
              const isActive = userRoadmap?.roadmap?._id === rm._id;
              const itemsCount = rm.items?.length || 0;

              return (
                <div
                  key={rm._id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? "bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-950/20 ring-1 ring-indigo-500/30"
                      : "bg-[#141d33] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <TrackIcon className="w-5 h-5" />
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{rm.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {rm.description}
                      </p>
                    </div>

                    {itemsCount > 0 && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>{itemsCount} Sequenced Milestones</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartRoadmap(rm._id)}
                    disabled={isActive}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-800 text-slate-400 cursor-default opacity-60"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                    }`}
                  >
                    <span>{isActive ? "Currently Active Track" : "Switch to this Track"}</span>
                    {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE ROADMAP VISUALIZER */}
      {userRoadmap && (
        <div className="space-y-6">
          {/* Active Roadmap Banner */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
                    Active Career Track
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-mono">
                    {userRoadmap.roadmap?.careerGoal}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">
                  {userRoadmap.roadmap?.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {userRoadmap.roadmap?.description}
                </p>
              </div>

              {/* Progress Gauge */}
              <div className="bg-[#141d33] border border-slate-800 rounded-xl p-4 flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Completion</span>
                  <p className="text-2xl font-extrabold text-white">
                    {userRoadmap.overallProgress ?? 0}%
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center text-xs font-bold text-indigo-300">
                  {userRoadmap.overallProgress ?? 0}%
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${userRoadmap.overallProgress ?? 0}%` }}
              />
            </div>
          </div>

          {/* Sequenced Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sequenced Milestones & Topics ({roadmapItems.length} Milestones)
              </h3>
              <span className="text-[11px] text-slate-500">
                Locked milestones automatically unlock when prerequisites reach 100%
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {roadmapItems.map((item, index) => {
                const prog = progressMap[item.key] || {
                  status: "not-started",
                  progressPercent: 0,
                };
                const isCompleted = prog.status === "completed" || prog.progressPercent === 100;
                const isInProgress =
                  prog.status === "in-progress" ||
                  (prog.progressPercent > 0 && prog.progressPercent < 100);
                const isLocked = prog.status === "locked";

                return (
                  <div
                    key={item.key}
                    className={`rounded-2xl border p-5 transition-all ${
                      isCompleted
                        ? "bg-[#101728]/80 border-emerald-500/30"
                        : isInProgress
                        ? "bg-[#121a30] border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                        : isLocked
                        ? "bg-[#0d1322] border-slate-800/80 opacity-70"
                        : "bg-[#101728] border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : isInProgress
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                              : isLocked
                              ? "bg-slate-800 text-slate-500"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white">
                              {item.title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : isInProgress
                                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                                  : isLocked
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {isCompleted
                                ? "Completed"
                                : isInProgress
                                ? "In Progress"
                                : isLocked
                                ? "Locked"
                                : "Not Started"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            {item.description}
                          </p>

                          {/* Prerequisites & Skills */}
                          <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-slate-500">
                            {item.dependencies?.length > 0 && (
                              <span className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                                <Lock className="w-3 h-3" />
                                Requires: {item.dependencies.join(", ")}
                              </span>
                            )}
                            {item.estimatedHours && (
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {item.estimatedHours} hrs est.
                              </span>
                            )}
                            {item.skills?.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Boxes className="w-3.5 h-3.5 text-slate-500" />
                                {item.skills.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-[#141d33] text-[10px] text-slate-300 font-medium border border-slate-800"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button
                          onClick={() => handleUpdateProgress(item.key, 0)}
                          disabled={updatingKey === item.key || prog.progressPercent === 0}
                          className="px-2.5 py-1.5 rounded-lg bg-[#141d33] hover:bg-slate-800 text-xs text-slate-400 border border-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Reset status"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(item.key, 50)}
                          disabled={updatingKey === item.key || isLocked}
                          className="px-3 py-1.5 rounded-lg bg-[#141d33] hover:bg-indigo-600/20 text-xs text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          In Progress (50%)
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(item.key, 100)}
                          disabled={updatingKey === item.key || isLocked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-600 text-white"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isCompleted ? "Completed" : "Mark 100%"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
