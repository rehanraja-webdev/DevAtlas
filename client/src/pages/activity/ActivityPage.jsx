import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  Activity as ActivityIcon,
  Code2,
  Boxes,
  FolderGit2,
  Compass,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/activities");
        setActivities(data?.data?.activities || []);
      } catch (err) {
        console.error("Failed to load activity logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getEntityIcon = (type) => {
    if (type?.startsWith("dsa")) {
      return <Code2 className="w-4 h-4 text-emerald-400" />;
    }
    if (type?.startsWith("skill")) {
      return <Boxes className="w-4 h-4 text-purple-400" />;
    }
    if (type?.startsWith("project")) {
      return <FolderGit2 className="w-4 h-4 text-blue-400" />;
    }
    if (type?.startsWith("roadmap")) {
      return <Compass className="w-4 h-4 text-indigo-400" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ActivityIcon className="w-7 h-7 text-indigo-400" />
          <span>Activity Log</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Auditable timeline of your learning actions, problem solutions, and project milestones.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-slate-500">
          Loading developer activity log...
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-12 text-center">
          <ActivityIcon className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No Activity Recorded Yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Activity events will appear here as you solve DSA challenges, track skills, and advance roadmaps.
          </p>
        </div>
      ) : (
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative">
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
            {activities.map((act) => (
              <div key={act._id} className="relative group">
                {/* Dot / Icon */}
                <div className="absolute -left-[35px] top-1 p-1.5 rounded-full bg-[#101728] border border-slate-700 shadow-md">
                  {getEntityIcon(act.type)}
                </div>

                <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80 group-hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {act.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(act.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {act.metadata?.title && (
                    <p className="text-xs text-indigo-300 font-semibold mt-1">
                      {act.metadata.title}
                    </p>
                  )}

                  {act.metadata?.completionPercentage !== undefined && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Milestone progress updated to: {act.metadata.completionPercentage}%
                    </p>
                  )}

                  {act.metadata?.difficulty && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
                      Difficulty: {act.metadata.difficulty}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
