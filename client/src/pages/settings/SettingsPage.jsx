import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore.js";
import api from "../../api/client.js";
import {
  Settings,
  User,
  Target,
  Globe,
  MapPin,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../components/common/BrandIcons.jsx";

export const SettingsPage = () => {
  const { user, profile, refreshProfile, logout, checkAuth } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
  const [location, setLocation] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  useEffect(() => {
    if (user?.fullname) {
      setFullname(user.fullname);
    }
    if (profile) {
      setBio(profile.bio || "");
      setCareerGoal(profile.careerGoal || "Full Stack Developer");
      setLocation(profile.location || "");
      setGithubUrl(profile.githubUrl || "");
      setLinkedInUrl(profile.linkedInUrl || profile.linkedinUrl || "");
      setPortfolioUrl(profile.portfolioUrl || "");
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await api.patch("/profile", {
        fullname: fullname || undefined,
        bio,
        careerGoal,
        location,
        githubUrl: githubUrl || null,
        linkedInUrl: linkedInUrl || null,
        portfolioUrl: portfolioUrl || null,
      });
      await refreshProfile();
      await checkAuth();
      setSuccessMsg("Profile settings updated successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out from all devices?")) return;
    try {
      setLoggingOutAll(true);
      await api.post("/auth/logout-all");
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Failed to logout all", err);
    } finally {
      setLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-indigo-400" />
          <span>Profile & Account Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your developer profile, target role, portfolio links, and session security.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "D"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.fullname}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Role: {user?.role || "Developer"}
            </span>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Target Career Goal</span>
              </label>
              <input
                type="text"
                required
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI Engineer"
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / Remote"
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Developer Bio
            </label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your background, learning journey, and current engineering interests..."
              className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portfolio URL</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://portfolio.dev"
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Profile Details"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Sessions */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 text-slate-200">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Session & Security Controls
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          DevAtlas sessions use secure HttpOnly cookie tokens with automatic refresh rotation and family reuse detection. If you suspect unauthorized access, you can terminate all other active sessions immediately.
        </p>

        <button
          onClick={handleLogoutAll}
          disabled={loggingOutAll}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOutAll ? "Terminating..." : "Logout From All Other Devices"}</span>
        </button>
      </div>
    </div>
  );
};
