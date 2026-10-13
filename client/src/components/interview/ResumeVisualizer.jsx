import { User, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons.jsx";

export const ResumeVisualizer = ({ resume }) => {
  if (!resume) return null;

  return (
    <div className="bg-[#0f172a] text-slate-100 rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-10 font-sans max-w-4xl mx-auto space-y-8">
      {/* Resume Top Header */}
      <div className="border-b border-slate-700/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {resume.candidateName || "Candidate Name"}
          </h1>
          <p className="text-base font-semibold text-indigo-400 mt-1">
            {resume.targetRole || "Full Stack Developer"}
          </p>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs text-slate-300">
          {resume.contact?.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{resume.contact.email}</span>
            </span>
          )}
          {resume.contact?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{resume.contact.location}</span>
            </span>
          )}
          <div className="flex items-center gap-3 pt-1">
            {resume.contact?.github && (
              <span className="flex items-center gap-1 hover:text-indigo-300">
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </span>
            )}
            {resume.contact?.linkedin && (
              <span className="flex items-center gap-1 hover:text-blue-300">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {resume.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Executive Summary</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#141e33] p-4 rounded-xl border border-slate-800">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Technical Skills Section */}
      {resume.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Technical Skills & Proficiencies</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Experience Showcase */}
      {resume.projects?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Technical Projects & Architecture</span>
          </h2>
          <div className="space-y-4">
            {resume.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#141e33] border border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {proj.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {proj.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {proj.bullets?.length > 0 && (
                  <ul className="space-y-1 text-xs text-slate-400 pl-4 list-disc">
                    {proj.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Education & Qualifications</span>
          </h2>
          <div className="space-y-2">
            {resume.education.map((edu, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#141e33] border border-slate-800 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-200">{edu.degree}</p>
                  <p className="text-slate-400 mt-0.5">{edu.institution}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
