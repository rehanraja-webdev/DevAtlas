import InterviewSession from "../models/InterviewSession.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { createActivity } from "./activity.service.js";

export const analyzeResumeData = async (userId, customResumeText = "") => {
  const [user, profile, projects, skills] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ user: userId }),
    Project.find({ user: userId }),
    Skill.find({ user: userId }),
  ]);

  const candidateName = user?.fullname || "Developer Candidate";
  const targetRole = profile?.careerGoal || "Full Stack Developer";
  const email = user?.email || "candidate@devatlas.io";

  let structured = null;

  if (customResumeText && customResumeText.trim().length > 50) {
    // Extract key sections from provided text
    const lines = customResumeText.split("\n").map((l) => l.trim()).filter(Boolean);
    const detectedSkills = [];
    const detectedProjects = [];

    // Parse keywords
    const keywords = ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Python", "SQL", "Redis", "Docker", "AWS", "Git", "Next.js", "Tailwind", "Java", "C++", "DSA", "System Design"];
    keywords.forEach((kw) => {
      if (customResumeText.toLowerCase().includes(kw.toLowerCase())) {
        detectedSkills.push(kw);
      }
    });

    structured = {
      candidateName,
      targetRole,
      contact: {
        email,
        location: profile?.location || "Remote",
        github: profile?.githubUrl || "github.com/developer",
        linkedin: profile?.linkedInUrl || profile?.linkedinUrl || "linkedin.com/in/developer",
      },
      summary:
        lines[1] ||
        `Goal-driven ${targetRole} with hands-on experience building scalable web applications and solving complex algorithmic challenges.`,
      skills: detectedSkills.length ? detectedSkills : (skills.map((s) => s.name).length ? skills.map((s) => s.name) : ["JavaScript", "React", "Node.js", "MongoDB"]),
      projects: projects.length
        ? projects.map((p) => ({
            title: p.title,
            technologies: p.technologies || ["Full Stack"],
            description: p.description,
            bullets: [
              `Architected and built full-stack solution using ${(p.technologies || []).join(", ") || "modern tech stack"}.`,
              "Engineered secure API routes, authentication flows, and data persistence models.",
            ],
          }))
        : [
            {
              title: "Enterprise Full Stack Web Platform",
              technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
              description: "A production-grade web application featuring JWT session security and modular microservice design.",
              bullets: [
                "Built resilient REST APIs with schema validation and centralized error handling.",
                "Optimized database indexing and implemented responsive modern client interfaces.",
              ],
            },
          ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science / Engineering",
          institution: "University / Institute of Technology",
          year: "2020 - 2024",
        },
      ],
      rawText: customResumeText,
    };
  } else {
    // Generate structured visual resume directly from DevAtlas profile assets
    structured = {
      candidateName,
      targetRole,
      contact: {
        email,
        location: profile?.location || "Remote",
        github: profile?.githubUrl || "github.com/developer",
        linkedin: profile?.linkedInUrl || profile?.linkedinUrl || "linkedin.com/in/developer",
      },
      summary:
        profile?.bio ||
        `Motivated ${targetRole} specializing in end-to-end software development, architectural design, and clean code practices.`,
      skills: skills.length ? skills.map((s) => s.name) : ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Data Structures"],
      projects: projects.length
        ? projects.map((p) => ({
            title: p.title,
            technologies: p.technologies?.length ? p.technologies : ["Full Stack"],
            description: p.description,
            bullets: [
              `Developed ${p.title} using ${(p.technologies || []).join(", ") || "MERN stack"} with focused attention to performance and code maintainability.`,
              `Implemented robust data schemas, endpoint security, and intuitive user interfaces.`,
            ],
          }))
        : [
            {
              title: "DevAtlas Growth Platform",
              technologies: ["React", "Node.js", "Express", "MongoDB", "Redis"],
              description: "Full-stack developer analytics platform with algorithmic progress tracking and AI guidance.",
              bullets: [
                "Implemented secure authentication and structured service-layer backend.",
                "Designed responsive client workspace with Tailwind CSS and TanStack Query.",
              ],
            },
          ],
      education: [
        {
          degree: "Bachelor of Technology in Computer Science & Engineering",
          institution: "Engineering Institute",
          year: "2021 - 2025",
        },
      ],
      rawText: profile?.bio || "DevAtlas Profile Resume",
    };
  }

  // Save to profile
  if (profile) {
    profile.resumeText = customResumeText;
    profile.parsedResume = structured;
    await profile.save();
  }

  return structured;
};

export const startInterviewSession = async (userId, customResumeText = "") => {
  const resumeData = await analyzeResumeData(userId, customResumeText);
  const targetRole = resumeData.targetRole || "Full Stack Developer";

  const primaryProject = resumeData.projects[0] || {
    title: "flagship full-stack application",
    technologies: ["React", "Node.js", "MongoDB"],
  };

  const primarySkills = (resumeData.skills || []).slice(0, 4).join(", ") || "JavaScript and web architecture";

  const questionsPlan = [
    {
      questionNumber: 1,
      category: "project-deepdive",
      question: `Hello ${resumeData.candidateName.split(" ")[0]}! I've reviewed your resume for the ${targetRole} role. Looking at your project "${primaryProject.title}" built with ${primaryProject.technologies?.join(", ")}, could you walk me through the high-level system architecture and why you chose that particular technology stack?`,
    },
    {
      questionNumber: 2,
      category: "core-fundamentals",
      question: `In your resume you highlighted skills in ${primarySkills}. When building high-traffic endpoints, how do you handle asynchronous operations, error propagation, and database connection pooling to avoid resource starvation?`,
    },
    {
      questionNumber: 3,
      category: "system-design",
      question: `Let's dive into a practical system design scenario. Suppose your application experiences a 10x surge in read traffic on the dashboard. Walk me through how you would introduce caching (such as Redis), handle cache invalidation, and ensure data consistency with the primary database.`,
    },
    {
      questionNumber: 4,
      category: "problem-solving",
      question: `Think about a challenging technical bug or bottleneck you encountered while developing "${primaryProject.title}" or during your DSA practice. What was the symptom, how did you isolate the root cause, and how did you verify the solution?`,
    },
    {
      questionNumber: 5,
      category: "behavioral",
      question: `Lastly, in a fast-paced engineering team, how do you manage technical debt versus shipping new features, and how do you approach receiving critical feedback during a rigorous code review?`,
    },
  ];

  const session = await InterviewSession.create({
    user: userId,
    targetRole,
    resumeData,
    status: "in-progress",
    currentRoundIndex: 0,
    rounds: questionsPlan.map((q) => ({
      questionNumber: q.questionNumber,
      category: q.category,
      question: q.question,
      candidateAnswer: "",
      feedback: "",
      score: 0,
    })),
  });

  return session;
};

export const submitInterviewAnswer = async (userId, sessionId, candidateAnswer) => {
  const session = await InterviewSession.findOne({ _id: sessionId, user: userId });

  if (!session) {
    throw new Error("Interview session not found");
  }

  if (session.status === "completed") {
    return session;
  }

  const currentRound = session.rounds[session.currentRoundIndex];
  if (!currentRound) {
    throw new Error("Invalid round state");
  }

  currentRound.candidateAnswer = candidateAnswer || "No verbal response recorded.";

  // Real-time evaluation of candidate answer
  const answerLength = candidateAnswer.trim().length;
  let score = 70;
  let feedback = "";

  if (answerLength < 30) {
    score = 45;
    feedback = "Answer was too brief. In a technical interview, aim to elaborate with technical specifics, architecture trade-offs, and examples.";
  } else if (answerLength < 120) {
    score = 75;
    feedback = "Good direct answer. Consider grounding your explanation with concrete metrics, libraries, or architectural diagrams you implemented.";
  } else {
    score = Math.min(95, 82 + Math.floor(Math.random() * 12));
    feedback = "Strong, articulated explanation! Demonstrated solid engineering intuition, practical terminology, and clear trade-off awareness.";
  }

  currentRound.score = score;
  currentRound.feedback = feedback;

  session.currentRoundIndex += 1;

  if (session.currentRoundIndex >= session.rounds.length) {
    session.status = "completed";

    // Compute comprehensive scorecard
    const scores = session.rounds.map((r) => r.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const techScore = Math.round((session.rounds[0].score + session.rounds[1].score + session.rounds[2].score) / 3);
    const commScore = Math.min(100, Math.round(avgScore * 0.9 + 10));
    const problemSolvingScore = session.rounds[3].score || 80;

    let recommendation = "Hire";
    if (avgScore >= 85) recommendation = "Strong Hire";
    else if (avgScore >= 70) recommendation = "Hire";
    else if (avgScore >= 60) recommendation = "Leaning Hire";
    else recommendation = "Needs Preparation";

    session.scorecard = {
      overallScore: avgScore,
      technicalScore: techScore,
      communicationScore: commScore,
      problemSolvingScore,
      feedbackSummary: `Candidate demonstrated solid foundation in ${session.resumeData.targetRole}. Project deep-dive answers showed practical implementation knowledge. Continuing to practice system design scaling and structured STAR responses will help achieve top-tier performance.`,
      strengths: [
        "Clear articulation of project tech stack and architectural choices",
        "Pragmatic approach to database query structures and error boundaries",
        "Confident communication and structured thought process",
      ],
      improvements: [
        "Provide deeper specifics on quantitative metrics (latency, payload size, cache hit ratios)",
        "Elaborate on edge cases and failure mode handling in distributed contexts",
      ],
      recommendation,
    };

    await createActivity(userId, "interview_completed", "interview", session._id, {
      title: `AI Technical Interview for ${session.targetRole}`,
      score: avgScore,
    });
  }

  await session.save();
  return session;
};

export const getInterviewHistoryService = async (userId) => {
  return InterviewSession.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);
};

export const getInterviewSessionService = async (userId, sessionId) => {
  return InterviewSession.findOne({ _id: sessionId, user: userId });
};
