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
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("frontend");
  const [level, setLevel] = useState("intermediate");
  const [proficiency, setProficiency] = useState(70);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/skills");
      setSkills(data?.data?.skills || []);
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
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
          prev.map((s) => (s._id === editingSkill._id ? data?.data?.skill || { ...s, name, category, level, proficiency } : s)),
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
    if (!window.confirm("Are you sure you want to remove this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  // Group by category
  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category?.toLowerCase() === cat);
    return acc;
  }, {});

  const avgProficiency = skills.length
    ? Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 50), 0) / skills.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Boxes className="w-7 h-7 text-purple-400" />
            <span>Skill Inventory</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Map your competencies across frontend, backend, databases, and core concepts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Tracked Skills
          </span>
          <p className="text-3xl font-bold text-white mt-1">{skills.length}</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Average Proficiency
          </span>
          <p className="text-3xl font-bold text-purple-300 mt-1">{avgProficiency}%</p>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Mastered (80%+)
          </span>
          <p className="text-3xl font-bold text-indigo-300 mt-1">
            {skills.filter((s) => (s.proficiency || 0) >= 80).length}
          </p>
        </div>
      </div>

      {/* Categorized Sections */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">
          Loading skills inventory...
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No Skills Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Log your languages, frameworks, and tools to unlock personalized gap analysis.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Add Your First Skill
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
                      {cat} Skills
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">{list.length} skills</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((skill) => (
                    <div
                      key={skill._id}
                      className="p-4 rounded-xl bg-[#141d33] border border-slate-800 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {skill.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 mt-1 inline-block">
                            {skill.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit skill"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Proficiency bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Proficiency</span>
                          <span className="font-semibold text-slate-200">
                            {skill.proficiency ?? 60}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency ?? 60}%` }}
                          />
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React, MongoDB, System Design"
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l} className="capitalize">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  <span>Proficiency</span>
                  <span className="text-indigo-400 font-bold">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {submitting ? "Saving..." : editingSkill ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
