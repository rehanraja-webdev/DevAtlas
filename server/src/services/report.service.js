import DeveloperReport from "../models/DeveloperReport.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import UserRoadmap from "../models/UserRoadmap.js";
import Profile from "../models/Profile.js";
import Activity from "../models/Activity.js";
import { fetchDSAStats } from "./dsa.service.js";
import { getPreviousWeekPeriod } from "../utils/reportPeriod.js";
import { reportQueue } from "../queues/report.queue.js";

export const generateReportData = async (userId) => {
  const { periodStart, periodEnd } = getPreviousWeekPeriod();

  const [dsaStats, skills, projects, roadmap, activities] = await Promise.all([
    fetchDSAStats(userId),
    Skill.find({ user: userId }),
    Project.find({ user: userId }),
    UserRoadmap.findOne({ user: userId }).populate("roadmap"),
    Activity.find({
      user: userId,
      createdAt: { $gte: periodStart, $lte: periodEnd },
    }),
  ]);

  const metrics = {
    totalActivities: activities.length,
    dsaSolved: activities.filter((a) => a.type === "dsa_solved").length,
    dsaAttempted: activities.filter((a) => a.type === "dsa_attempted").length,
    projectsCreated: activities.filter((a) => a.type === "project_created").length,
    projectsCompleted: activities.filter((a) => a.type === "project_completed").length,
    roadmapsStarted: activities.filter((a) => a.type === "roadmap_started").length,
    roadmapsCompleted: activities.filter((a) => a.type === "roadmap_completed").length,
    skillsAdded: activities.filter((a) => a.type === "skill_added").length,
    skillsUpdated: activities.filter((a) => a.type === "skill_updated").length,
  };

  const insights = [];
  if (metrics.dsaSolved > 0) {
    insights.push(`Strong algorithmic momentum: Solved ${metrics.dsaSolved} problems this past period.`);
  } else {
    insights.push("No DSA problems solved recently. Consider targeting 2-3 problems this week.");
  }

  if (roadmap) {
    insights.push(`Roadmap progress is currently at ${roadmap.overallProgress}%. Keep advancing milestone topics.`);
  } else {
    insights.push("You haven't selected an active career roadmap yet. Pick one to structure your learning.");
  }

  if (skills.length < 5) {
    insights.push("Log your core skills to help DevAtlas calibrate technical gap analysis.");
  }

  const report = await DeveloperReport.findOneAndUpdate(
    { user: userId, type: "weekly", periodStart },
    {
      $set: {
        periodEnd,
        status: "completed",
        metrics,
        insights,
        generatedAt: new Date(),
      },
    },
    { upsert: true, new: true },
  );

  return report;
};

export const createReportJob = async (userId) => {
  try {
    const job = await reportQueue.add(
      "generate-report",
      { userId },
      {
        attempts: 2,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      },
    );
    return { id: job.id, mode: "queued" };
  } catch (error) {
    // Graceful degradation when Redis is unavailable: compute directly
    console.warn("Redis Queue unavailable, generating report synchronously:", error.message);
    const report = await generateReportData(userId);
    return { id: report._id.toString(), mode: "direct", report };
  }
};

export const getLatestReportService = async (userId) => {
  let report = await DeveloperReport.findOne({ user: userId })
    .sort({ createdAt: -1 });

  if (!report) {
    report = await generateReportData(userId);
  }

  return report;
};

export const getReportHistoryService = async (userId) => {
  return DeveloperReport.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);
};

export const getAiGuidanceService = async (userId) => {
  const [profile, skills, dsaStats, roadmap, projects] = await Promise.all([
    Profile.findOne({ user: userId }),
    Skill.find({ user: userId }),
    fetchDSAStats(userId),
    UserRoadmap.findOne({ user: userId }).populate("roadmap"),
    Project.find({ user: userId }),
  ]);

  const careerGoal = profile?.careerGoal || "Full Stack Developer";
  const avgProficiency = skills.length
    ? Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 50), 0) / skills.length)
    : 40;

  // Identify weak areas and calculate signals
  const weakSkills = skills.filter((s) => s.proficiency < 60).map((s) => s.name);
  const nextActions = [];
  const evidence = [
    `Skill Inventory: ${skills.length} tracked skills (Average proficiency: ${avgProficiency}%)`,
    `DSA Practice: ${dsaStats.solved} solved out of ${dsaStats.total} tracked (Success rate: ${dsaStats.solvedRate}%)`,
    `Project Portfolio: ${projects.length} recorded projects`,
  ];

  if (roadmap) {
    evidence.push(`Current Roadmap: "${roadmap.roadmap?.title}" (${roadmap.overallProgress}% complete)`);
    const nextTopic = roadmap.progress?.find((p) => p.status === "in-progress" || p.status === "not-started");
    if (nextTopic) {
      nextActions.push({
        id: "action-roadmap",
        title: `Advance Roadmap: Complete milestone "${nextTopic.itemKey.replace(/-/g, " ")}"`,
        type: "roadmap",
        actionText: "Open Roadmap",
        link: "/roadmap",
      });
    }
  } else {
    nextActions.push({
      id: "action-start-roadmap",
      title: `Select a Career Roadmap aligned with ${careerGoal}`,
      type: "roadmap",
      actionText: "Choose Roadmap",
      link: "/roadmap",
    });
  }

  if (dsaStats.solved < 10) {
    nextActions.push({
      id: "action-dsa-solve",
      title: "Solve 3 fundamental Easy/Medium DSA problems to establish daily consistency",
      type: "dsa",
      actionText: "Solve Problems",
      link: "/dsa",
    });
  } else if (dsaStats.hard === 0 && dsaStats.medium > 10) {
    nextActions.push({
      id: "action-dsa-hard",
      title: "Attempt 2 Hard algorithm challenges to test advanced problem-solving depth",
      type: "dsa",
      actionText: "View Challenges",
      link: "/dsa",
    });
  } else {
    nextActions.push({
      id: "action-dsa-topic",
      title: "Practice Dynamic Programming & Graph traversal patterns",
      type: "dsa",
      actionText: "Explore DSA",
      link: "/dsa",
    });
  }

  if (projects.length === 0) {
    nextActions.push({
      id: "action-project-create",
      title: "Add your flagship full-stack project to demonstrate production-grade architecture",
      type: "project",
      actionText: "Add Project",
      link: "/projects",
    });
  } else if (weakSkills.length > 0) {
    nextActions.push({
      id: "action-skill-improve",
      title: `Focus on leveling up: ${weakSkills.slice(0, 2).join(", ")}`,
      type: "skill",
      actionText: "Update Skills",
      link: "/skills",
    });
  } else {
    nextActions.push({
      id: "action-project-ship",
      title: "Deploy live preview and document production caching or CI/CD for your project",
      type: "project",
      actionText: "View Projects",
      link: "/projects",
    });
  }

  let insight = "Your developer growth profile is progressing well.";
  if (skills.length > 3 && dsaStats.solved > 5) {
    insight = `You are building balanced momentum toward ${careerGoal}. Your technical foundation is solid; focusing on deeper algorithmic edge cases and architectural project depth will give you an unfair advantage.`;
  } else if (skills.length > 0) {
    insight = `You have begun establishing baseline competencies for ${careerGoal}. Increasing your weekly coding activity and structured DSA problem solving will rapidly elevate your readiness.`;
  } else {
    insight = `Welcome to DevAtlas! Start by logging your current skill inventory and selecting a career roadmap to unlock personalized recommendations.`;
  }

  return {
    careerGoal,
    readinessScore: Math.min(100, Math.round((avgProficiency * 0.4) + (Math.min(dsaStats.solved, 50) * 0.6) + ((roadmap?.overallProgress || 0) * 0.3))),
    insight,
    evidence,
    nextActions: nextActions.slice(0, 3),
    weakAreas: weakSkills.slice(0, 3),
  };
};

export const chatWithMentorService = async (userId, userMessage) => {
  const guidance = await getAiGuidanceService(userId);
  const msgLower = (userMessage || "").toLowerCase();

  let response = "";
  if (msgLower.includes("dsa") || msgLower.includes("algorithm") || msgLower.includes("leetcode")) {
    response = `Based on your DSA stats (${guidance.evidence[1]}), I recommend focusing on pattern recognition rather than memorizing solutions. Start with two-pointer techniques and hash tables, then advance to DFS/BFS and dynamic programming. Aim for 3 problems per week with intentional attempt logs.`;
  } else if (msgLower.includes("project") || msgLower.includes("portfolio")) {
    response = `Reviewing your current portfolio: ensure your projects demonstrate real engineering depth rather than simple CRUD. Implement authentication cookies, query caching with Redis, index optimization, and background workers where appropriate. Interviewers value architectural trade-offs over cosmetic features.`;
  } else if (msgLower.includes("roadmap") || msgLower.includes("career") || msgLower.includes("goal")) {
    response = `For your goal as a ${guidance.careerGoal}, follow your current roadmap milestones systematically. Don't skip foundational topics. Make sure each milestone is backed up by hands-on code in a repository.`;
  } else {
    response = `Based on your profile and recent activity: ${guidance.insight} My top recommendation right now is: ${guidance.nextActions[0]?.title || "Keep practicing consistently"}. Let me know if you want specific study resources or problem recommendations!`;
  }

  return {
    reply: response,
    suggestedActions: guidance.nextActions,
    timestamp: new Date(),
  };
};
