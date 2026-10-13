import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  FolderGit2,
  Plus,
  Globe,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Layers,
  Calendar,
} from "lucide-react";
import { GithubIcon } from "../../components/common/BrandIcons.jsx";

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      setProjects(data?.data?.projects || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setStatus("in-progress");
    setTechnologies("");
    setGithubUrl("");
    setLiveUrl("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setStatus(proj.status || "in-progress");
    setTechnologies((proj.technologies || []).join(", "));
    setGithubUrl(proj.githubUrl || "");
    setLiveUrl(proj.liveUrl || "");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const techArray = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject) {
        const { data } = await api.patch(`/projects/${editingProject._id}`, {
          title,
          description,
          status,
          technologies: techArray,
          githubUrl: githubUrl || null,
          liveUrl: liveUrl || null,
        });
        setProjects((prev) =>
          prev.map((p) =>
            p._id === editingProject._id ? data?.data?.project || { ...p, title, description, status, technologies: techArray, githubUrl, liveUrl } : p,
          ),
        );
      } else {
        const { data } = await api.post("/projects", {
          title,
          description,
          status,
          technologies: techArray,
          githubUrl: githubUrl || null,
          liveUrl: liveUrl || null,
        });
        setProjects((prev) => [data?.data?.project, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "in-progress":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-blue-400" />
            <span>Project Portfolio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Showcase real-world implementations, production architectures, and tech stack proficiencies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {["all", "in-progress", "completed", "planned"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
              statusFilter === tab
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          Loading portfolio projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Add a project to showcase your architectural decisions and practical expertise.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-[#101728] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
                      project.status,
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#141d33] border border-slate-800 text-[10px] font-medium text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-slate-500">
                  {new Date(project.updatedAt || project.createdAt).toLocaleDateString([], {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">
                {editingProject ? "Edit Project" : "New Portfolio Project"}
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
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Scheduler"
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Description & Architecture
                </label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem solved, technical challenges, and architecture patterns..."
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="React, Node.js, Redis, MongoDB"
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  {submitting ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
