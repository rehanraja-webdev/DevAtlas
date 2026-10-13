import { useState, useEffect } from "react";
import api from "../../api/client.js";
import { Bell, CheckCheck, Sparkles, Code2, Milestone, Info } from "lucide-react";

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/notifications");
      setNotifications(data?.data?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case "ai":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "dsa":
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case "milestone":
        return <Milestone className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-84 sm:w-96 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#141d30]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
          title="Mark all as read"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center px-4">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-slate-400 font-medium">All caught up!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              No new alerts or progress events.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                n.isRead
                  ? "bg-[#111827]/40 hover:bg-[#151f33]"
                  : "bg-indigo-950/20 hover:bg-indigo-950/35 border-l-2 border-indigo-500"
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800/60 shrink-0">
                {getTypeIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
