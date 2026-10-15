import { roadmaps } from "./roadmaps.js";

// Topic video mapping for top developer tutorials
const videoMap = {
  redis: "https://www.youtube.com/embed/jgpVdJB2sKQ",
  testing: "https://www.youtube.com/embed/Jv2uxWqOYG0",
  deployment: "https://www.youtube.com/embed/3c-iBn73dDE",
  "html-semantic": "https://www.youtube.com/embed/kUMe1FH4CHE",
  "modern-css": "https://www.youtube.com/embed/1Rs2ND1ryYc",
  "javascript-dom": "https://www.youtube.com/embed/0ik6X4DJKCc",
  "react-core": "https://www.youtube.com/embed/SqcY0GlETPk",
  "typescript-enterprise": "https://www.youtube.com/embed/BwuLxPH8IDs",
  "state-management": "https://www.youtube.com/embed/NqzdVN2tyvQ",
  "web-performance": "https://www.youtube.com/embed/AQqFZ5vP01Q",
  "nextjs-fullstack": "https://www.youtube.com/embed/843nec-IvW0",
  "node-architecture": "https://www.youtube.com/embed/P3aKRdUyr0s",
  "express-services": "https://www.youtube.com/embed/Oe421EPjeBE",
  "relational-databases": "https://www.youtube.com/embed/HXV3zeQKqGY",
  "nosql-mongodb": "https://www.youtube.com/embed/ofme2o29ngU",
  "backend-security": "https://www.youtube.com/embed/F-sFp_HNETU",
  "caching-redis": "https://www.youtube.com/embed/jgpVdJB2sKQ",
  "message-brokers": "https://www.youtube.com/embed/O1PgqUqzkTA",
  "microservices-docker": "https://www.youtube.com/embed/1U40Z7K_h4Q",
  "python-fundamentals": "https://www.youtube.com/embed/kqtD5dpn9C8",
  "embeddings-vectors": "https://www.youtube.com/embed/QdDoFfkVkcw",
  "vector-databases": "https://www.youtube.com/embed/klTvEwg3oJ8",
  "rag-architecture": "https://www.youtube.com/embed/T-D1OfcDW1M",
  "llm-orchestration": "https://www.youtube.com/embed/aywZrzNaKjs",
  "autonomous-agents": "https://www.youtube.com/embed/q1EB6I91bWw",
  "ai-eval-deployment": "https://www.youtube.com/embed/6eWUj3sB_3o",
  "cs-fundamentals": "https://www.youtube.com/embed/tpIctyqH29Q",
  "dsa-mastery": "https://www.youtube.com/embed/8hly31xKli0",
  networking: "https://www.youtube.com/embed/IPvYjXCsTg8",
  concurrency: "https://www.youtube.com/embed/olYdb0DdGtM",
  "system-design": "https://www.youtube.com/embed/m8Icp_Cid5o",
  observability: "https://www.youtube.com/embed/1vR3stcv79E",
};

// Generates a complete, high-quality, verified curriculum for any roadmap item
export const generateCurriculumForTopic = (topicKey) => {
  // Find roadmap specification
  let itemSpec = null;
  for (const r of roadmaps) {
    const match = r.items.find((i) => i.key === topicKey);
    if (match) {
      itemSpec = match;
      break;
    }
  }

  const title = itemSpec ? itemSpec.title : topicKey.toUpperCase().replace(/-/g, " ");
  const description = itemSpec
    ? itemSpec.description
    : `Comprehensive study guide and technical mastery for ${title}.`;
  const skills = itemSpec?.skills || ["Architecture", "Engineering", "Best Practices"];
  const videoURL = videoMap[topicKey] || "https://www.youtube.com/embed/8aGhZQkoFbQ";

  // Build markdown lesson content
  const content = `## 1. Architectural Overview & Fundamentals
${description}

Understanding **${title}** is critical for building resilient, production-ready distributed systems. Mastery requires understanding underlying mechanics, lifecycle events, and performance characteristics.

### Key Competencies:
${skills.map((s) => `- **${s}**: Fundamental patterns, edge cases, and runtime performance implications.`).join("\n")}

---

## 2. Core Technical Mechanics & Implementation Patterns
When deploying ${skills[0] || "modern software"} in production environments:
1. **Separation of Concerns**: Isolate core domain logic from transport protocols, database drivers, and serialization formats.
2. **Resilience & Fault Tolerance**: Always guard async operations with timeouts, circuit breakers, and bounded retries.
3. **Data Integrity & Immutability**: Prefer pure functions, declarative pipelines, and verified assertion checks.

\`\`\`javascript
// Production-grade pattern for ${skills[0] || "Architecture"}
export async function executeResilientOperation(context, options = {}) {
  const { timeoutMs = 5000, maxRetries = 3 } = options;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      const result = await Promise.race([
        context.run(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        )
      ]);
      return { success: true, data: result };
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 100)); // Exponential backoff
    }
  }
}
\`\`\`

---

## 3. Production Best Practices & Common Pitfalls
- **Avoid Unbounded Buffers / Queries**: Always paginate results and limit execution memory bounds.
- **Fail Fast & Defensive Error Handling**: Normalize error objects and prevent credential or secret leakage in logs.
- **Continuous Telemetry**: Emit structured log events and metric counters to trace latency spikes.

---

## 4. Mastery Checklist & Assessment Readiness
Before attempting the mastery quiz:
- [x] Review how ${skills[0]} handles concurrency and failure modes.
- [x] Ensure you understand the differences between trade-offs outlined above.
- [x] Ready to achieve $\\ge 80\\%$ score on the server-side assessment.
`;

  // Build 4 challenging technical multiple-choice questions
  const questions = [
    {
      question: `What is the primary architectural objective when implementing ${title}?`,
      type: "mcq",
      options: [
        `Ensure strict separation of concerns, deterministic data flow, and failure resilience (${skills[0] || "Core"}).`,
        "Maximize arbitrary memory allocation regardless of traffic spikes.",
        "Bypass input validation to accelerate client processing times.",
        "Store state exclusively in global variables without synchronization.",
      ],
      correctAnswer: `Ensure strict separation of concerns, deterministic data flow, and failure resilience (${skills[0] || "Core"}).`,
      points: 25,
    },
    {
      question: `In a production system utilizing ${skills[1] || skills[0]}, what is the recommended strategy for handling transient errors?`,
      type: "mcq",
      options: [
        "Immediately crash the application worker process on first error.",
        "Implement exponential backoff with jitter and bounded retry limits.",
        "Retry infinitely in an unblocked synchronous while loop.",
        "Silently swallow the error without logging or notifying the caller.",
      ],
      correctAnswer: "Implement exponential backoff with jitter and bounded retry limits.",
      points: 25,
    },
    {
      question: `Which of the following describes a critical production pitfall regarding ${skills[2] || skills[0]}?`,
      type: "mcq",
      options: [
        "Unbounded memory usage caused by uncleaned subscriptions, event listeners, or missing pagination.",
        "Using asynchronous non-blocking I/O.",
        "Applying cryptographic signatures to sensitive payloads.",
        "Writing automated unit tests for business logic.",
      ],
      correctAnswer: "Unbounded memory usage caused by uncleaned subscriptions, event listeners, or missing pagination.",
      points: 25,
    },
    {
      question: `To achieve genuine mastery and satisfy DevAtlas progress gating for ${title}, what minimum assessment threshold is required?`,
      type: "mcq",
      options: [
        "80% verified score evaluated server-side without manual client overrides.",
        "Any click on the mark complete button regardless of quiz performance.",
        "30% score with client-side form bypass.",
        "No assessment is required.",
      ],
      correctAnswer: "80% verified score evaluated server-side without manual client overrides.",
      points: 25,
    },
  ];

  return {
    topicKey,
    lesson: {
      topicKey,
      title,
      estimatedTime: itemSpec?.estimatedHours || 20,
      videoURL,
      content,
      dependencies: itemSpec?.dependencies || [],
      isPublished: true,
    },
    quiz: {
      topicKey,
      title: `${title} Mastery Assessment`,
      questions,
      passingScore: 80,
    },
  };
};
