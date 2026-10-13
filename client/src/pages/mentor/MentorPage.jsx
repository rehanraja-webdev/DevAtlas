import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import {
  Bot,
  Sparkles,
  ArrowRight,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  History,
  TrendingUp,
  Cpu,
} from "lucide-react";

export const MentorPage = () => {
  const [guidance, setGuidance] = useState(null);
  const [latestReport, setLatestReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState("");

  // Chat advisory state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const [guidanceRes, reportRes, historyRes] = await Promise.allSettled([
        api.get("/report/guidance"),
        api.get("/report/latest"),
        api.get("/report/history"),
      ]);

      if (guidanceRes.status === "fulfilled") {
        setGuidance(guidanceRes.value.data?.data?.guidance);
      }
      if (reportRes.status === "fulfilled") {
        setLatestReport(reportRes.value.data?.data?.report);
      }
      if (historyRes.status === "fulfilled") {
        setReportHistory(historyRes.value.data?.data?.history || []);
      }
    } catch (err) {
      console.error("Failed to load AI mentor data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      setReportSuccessMsg("");
      const { data } = await api.post("/report/generate");
      setReportSuccessMsg(data?.message || "Report generated successfully!");
      // Refresh report
      const repRes = await api.get("/report/latest");
      setLatestReport(repRes.data?.data?.report);
      const histRes = await api.get("/report/history");
      setReportHistory(histRes.data?.data?.history || []);
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const { data } = await api.post("/report/mentor-chat", {
        message: userMsg,
      });
      const reply = data?.data?.reply || "I analyzed your activity. Keep consistent!";
      setChatMessages((prev) => [...prev, { role: "mentor", text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "mentor",
          text: "I'm having trouble analyzing right now, but continue executing your current roadmap milestones.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Calibrating AI Mentor guidance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Context-Aware AI Guidance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Growth Mentor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Synthesizing your DSA velocity, skill gaps, and roadmap milestones into actionable counsel.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          {generatingReport ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{generatingReport ? "Synthesizing..." : "Generate Weekly Report"}</span>
        </button>
      </div>

      {reportSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reportSuccessMsg}</span>
        </div>
      )}

      {/* Structured Guidance Main Hero */}
      <div className="bg-[#101728] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Cpu className="w-64 h-64 text-purple-400" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Main Insight */}
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>Current Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              "{guidance?.insight}"
            </h2>
          </div>

          {/* Evidence / Why this was suggested */}
          <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Signal Evidence & Context
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {guidance?.evidence?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Actions */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Recommended Next Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {guidance?.nextActions?.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#141d33] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                      Action #{idx + 1}
                    </span>
                    <p className="text-xs font-semibold text-white mt-2 leading-relaxed">
                      {action.title}
                    </p>
                  </div>
                  <Link
                    to={action.link || "/dashboard"}
                    className="mt-4 text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 self-start"
                  >
                    <span>{action.actionText || "Get Started"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Weekly Report Summary + Interactive Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Weekly Report Card */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Latest Weekly Performance Report
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {latestReport?.generatedAt
                  ? new Date(latestReport.generatedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })
                  : "Generated"}
              </span>
            </div>

            {latestReport ? (
              <div className="space-y-4">
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-[#141d33] text-center border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">DSA Solved</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {latestReport.metrics?.dsaSolved ?? 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141d33] text-center border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Skills Added</span>
                    <span className="text-lg font-bold text-purple-400">
                      {latestReport.metrics?.skillsAdded ?? 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141d33] text-center border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Events</span>
                    <span className="text-lg font-bold text-indigo-400">
                      {latestReport.metrics?.totalActivities ?? 0}
                    </span>
                  </div>
                </div>

                {/* Key Insights List */}
                <div className="space-y-2 mt-4">
                  <span className="text-xs font-semibold text-slate-300">
                    Period Takeaways:
                  </span>
                  {latestReport.insights?.map((ins, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#141d33] border border-slate-800 text-xs text-slate-300 leading-relaxed"
                    >
                      {ins}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No reports compiled yet. Click "Generate Weekly Report" above to compile one.
              </div>
            )}
          </div>

          {/* History link */}
          {reportHistory.length > 1 && (
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                {reportHistory.length} reports archived
              </span>
            </div>
          )}
        </div>

        {/* Right: Interactive Mentor Query Chat */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 flex flex-col h-[460px] shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Consult AI Advisor
            </h3>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div className="p-3 rounded-xl bg-[#141d33] border border-slate-800 text-slate-300 leading-relaxed">
              <span className="text-[10px] font-bold text-purple-400 block mb-1">
                DEVATLAS MENTOR
              </span>
              I'm primed with your tracked skills, DSA problem history, and roadmap state. Ask me anything about engineering practices, interview preparation, or portfolio architecture!
            </div>

            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 ml-6"
                    : "bg-[#141d33] border border-slate-800 text-slate-300 mr-6"
                }`}
              >
                <span
                  className={`text-[10px] font-bold block mb-1 uppercase ${
                    msg.role === "user" ? "text-indigo-400" : "text-purple-400"
                  }`}
                >
                  {msg.role === "user" ? "You" : "DevAtlas Mentor"}
                </span>
                {msg.text}
              </div>
            ))}

            {chatLoading && (
              <div className="p-3 rounded-xl bg-[#141d33] border border-slate-800 text-slate-400 italic">
                Formulating contextual guidance...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g. How do I improve in DSA graphs?"
              className="flex-1 bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
