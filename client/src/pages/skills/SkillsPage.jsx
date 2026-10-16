import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  Boxes,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  BarChart3,
  Layers,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  Lock,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

const CATEGORIES = [
  "frontend",
  "backend",
  "database",
  "devops",
  "core",
  "tools",
];

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

export const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [verifiedMasteries, setVerifiedMasteries] = useState([]);
  const [skillPassport, setSkillPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for User Claims
  const [name, setName] = useState("");
  const [category, setCategory] = useState("frontend");
  const [level, setLevel] = useState("intermediate");
  const [proficiency, setProficiency] = useState(70);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsRes, masteryRes, passportRes] = await Promise.allSettled([
        api.get("/skills"),
        api.get("/learning/mastery/me"),
        api.get("/learning/skill-passport"),
      ]);

      if (skillsRes.status === "fulfilled") {
        setSkills(skillsRes.value.data?.data?.skills || []);
      }
      if (masteryRes.status === "fulfilled") {
        setVerifiedMasteries(masteryRes.value.data?.data?.masteries || []);
      }
      if (passportRes.status === "fulfilled") {
        setSkillPassport(passportRes.value.data?.data?.passport || null);
      }
    } catch (err) {
      console.error("Failed to load skills data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("frontend");
    setLevel("intermediate");
    setProficiency(70);
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category || "frontend");
    setLevel(skill.level || "intermediate");
    setProficiency(skill.proficiency ?? 70);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (editingSkill) {
        const { data } = await api.patch(`/skills/${editingSkill._id}`, {
          name,
          category,
          level,
          proficiency: Number(proficiency),
        });
        setSkills((prev) =>
          prev.map((s) =>
            s._id === editingSkill._id
              ? data?.data?.skill || { ...s, name, category, level, proficiency }
              : s,
          ),
        );
      } else {
        const { data } = await api.post("/skills", {
          name,
          category,
          level,
          proficiency: Number(proficiency),
        });
        setSkills((prev) => [data?.data?.skill, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this profile skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  const handleCopyPassportLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/roadmap");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Group user claims by category
  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category?.toLowerCase() === cat);
    return acc;
  }, {});

  const avgProficiency = skills.length
    ? Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 50), 0) / skills.length)
    : 0;

  const verifiedDemonstratedCount = verifiedMasteries.filter(
    (m) => m.state === "demonstrated" || m.state === "retained",
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Boxes className="w-7 h-7 text-purple-400" />
              <span>Skill Inventory & Passport</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Evidence Engine</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Verifiable competencies earned via server-graded assessments alongside your self-reported portfolio claims.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setPassportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#141d33] hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Skill Passport</span>
            {verifiedDemonstratedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {verifiedDemonstratedCount} Verified
              </span>
            )}
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Profile Claim</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Competencies</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Evidence-Backed
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">
            {verifiedDemonstratedCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Server-evaluated via ≥80% mastery checkpoints
          </p>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Total Tracked Profile Skills
          </span>
          <p className="text-3xl font-bold text-white mt-2">{skills.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Avg self-reported proficiency: {avgProficiency}%
          </p>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Retention Status
          </span>
          <p className="text-3xl font-bold text-indigo-300 mt-2">
            {verifiedMasteries.filter((m) => m.state === "retained").length} Retained
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Confirmed via spaced retrieval reviews
          </p>
        </div>
      </div>

      {/* SECTION 1: VERIFIED SKILL GRAPH & EVIDENCE */}
      <div className="bg-[#101728] border border-indigo-500/30 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Evidence-Backed Skill Graph</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These skill records cannot be forged. Each state maps to server-recorded attempt scores and dates.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 self-start sm:self-auto">
            {verifiedMasteries.length} Tracked Telemetries
          </span>
        </div>

        {verifiedMasteries.length === 0 ? (
          <div className="py-8 text-center bg-[#141d33]/50 border border-dashed border-slate-800 rounded-xl p-6 text-slate-400 text-xs">
            <p className="font-semibold text-slate-300">No verified evidence yet.</p>
            <p className="mt-1">
              Complete any roadmap lesson and pass the server-evaluated mastery quiz (≥80%) to generate your first verified skill card.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedMasteries.map((m) => {
              const isRetained = m.state === "retained";
              const isDemonstrated = m.state === "demonstrated";
              const isPractised = m.state === "practised";

              return (
                <div
                  key={m._id || m.skillKey}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isRetained
                      ? "bg-gradient-to-br from-[#121f2d] to-[#101728] border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                      : isDemonstrated
                      ? "bg-[#141d33] border-indigo-500/40"
                      : "bg-[#101728] border-slate-800"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white capitalize">
                        {m.skillName || m.skillKey}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isRetained
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : isDemonstrated
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                            : isPractised
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {isRetained ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Retained</span>
                          </>
                        ) : isDemonstrated ? (
                          <>
                            <Award className="w-3 h-3 text-indigo-400" />
                            <span>Demonstrated</span>
                          </>
                        ) : isPractised ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-amber-400" />
                            <span>Practised</span>
                          </>
                        ) : (
                          <span>Learning</span>
                        )}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0e1628] p-3 rounded-xl border border-slate-800/80">
                      {m.rationale}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                      {m.latestScore !== null && (
                        <div className="flex items-center justify-between">
                          <span>Latest Score:</span>
                          <span className="font-bold text-white">{m.latestScore}%</span>
                        </div>
                      )}
                      {m.lastAssessedAt && (
                        <div className="flex items-center justify-between">
                          <span>Verified On:</span>
                          <span className="text-slate-300">
                            {new Date(m.lastAssessedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {m.nextReviewAt && (
                        <div className="flex items-center justify-between">
                          <span>Next Spaced Review:</span>
                          <span className="text-indigo-300">
                            {new Date(m.nextReviewAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {m.evidence?.length || 1} Proof Record(s)
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tamper-Proof</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: SELF-REPORTED PROFILE CLAIMS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Self-Reported Profile Claims</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated by you for resume customization. Clearly separated from server-verified telemetry.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold self-start sm:self-auto"
          >
            + Add Another Claim
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Loading skills inventory...
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-[#101728] border border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto">
            <Boxes className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-white">No Profile Claims Added</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Add your familiar languages and frameworks.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
            >
              Add First Claim
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const list = skillsByCategory[cat] || [];
              if (list.length === 0) return null;

              return (
                <div
                  key={cat}
                  className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider capitalize">
                        {cat}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">{list.length} claims</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((skill) => (
                      <div
                        key={skill._id}
                        className="p-4 rounded-xl bg-[#141d33] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {skill.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                  {skill.level}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/60">
                                  Self-Reported Claim
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditModal(skill)}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit claim"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete claim"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Declared Proficiency</span>
                              <span className="font-semibold text-white">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SKILL PASSPORT PREVIEW MODAL */}
      {passportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101728] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  Verifiable Skill Passport
                </h3>
              </div>
              <button
                onClick={() => setPassportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#141d33] border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Cryptographic Evidence Status
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {verifiedDemonstratedCount} Demonstrated / Retained Competencies
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified through server-authoritative milestones.
                  </p>
                </div>
                <button
                  onClick={handleCopyPassportLink}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Link Copied!" : "Share Passport"}</span>
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Verified Skills Record
                </h4>
                {verifiedMasteries.filter(
                  (m) => m.state === "demonstrated" || m.state === "retained",
                ).length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No verified milestones completed yet. Pass a verified assessment on your roadmap to populate this passport.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {verifiedMasteries
                      .filter(
                        (m) => m.state === "demonstrated" || m.state === "retained",
                      )
                      .map((m) => (
                        <div
                          key={m._id}
                          className="p-3.5 rounded-xl bg-[#141d33] border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white capitalize">
                                {m.skillName || m.skillKey}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                {m.state}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {m.rationale}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {m.latestScore}%
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#0e1628] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Private by default • Tamper-proof telemetry</span>
              </span>
              <button
                onClick={() => setPassportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLAIM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101728] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? "Edit Profile Claim" : "Add Profile Claim"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., TypeScript, Docker, Redis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 capitalize"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Claimed Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 capitalize"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Self-Assessed Proficiency</span>
                  <span className="font-bold text-indigo-400">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingSkill ? "Update" : "Save Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
