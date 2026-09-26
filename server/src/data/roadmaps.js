export const roadmaps = [
  {
    title: "Full Stack Developer Roadmap",

    careerGoal: "fullstack-developer",

    description:
      "A structured path from JavaScript fundamentals to production-ready full-stack development.",

    items: [
      {
        key: "javascript",
        title: "JavaScript Fundamentals",
        description: "Variables, functions, arrays, objects, async JavaScript.",
        order: 1,
        estimatedHours: 25,
        skills: ["JavaScript"],
        dependencies: [],
      },
      {
        key: "react",
        title: "React",
        description: "Components, hooks, state, routing and API integration.",
        order: 2,
        estimatedHours: 30,
        skills: ["React"],
        dependencies: ["javascript"],
      },
      {
        key: "nodejs",
        title: "Node.js",
        description:
          "Runtime, modules, asynchronous programming and backend fundamentals.",
        order: 3,
        estimatedHours: 20,
        skills: ["Node.js"],
        dependencies: ["javascript"],
      },
      {
        key: "express",
        title: "Express.js",
        description: "REST APIs, middleware, controllers and services.",
        order: 4,
        estimatedHours: 15,
        skills: ["Express.js"],
        dependencies: ["nodejs"],
      },
      {
        key: "mongodb",
        title: "MongoDB",
        description: "Documents, indexes, aggregation and Mongoose.",
        order: 5,
        estimatedHours: 20,
        skills: ["MongoDB", "Mongoose"],
        dependencies: ["nodejs"],
      },
      {
        key: "authentication",
        title: "Authentication & Authorization",
        description: "JWT, cookies, sessions, RBAC and security fundamentals.",
        order: 6,
        estimatedHours: 20,
        skills: ["JWT", "Security"],
        dependencies: ["express", "mongodb"],
      },
      {
        key: "redis",
        title: "Redis & Caching",
        description: "Caching, sessions and performance optimization.",
        order: 7,
        estimatedHours: 15,
        skills: ["Redis"],
        dependencies: ["authentication"],
      },
      {
        key: "testing",
        title: "Testing",
        description: "Unit testing, integration testing and API testing.",
        order: 8,
        estimatedHours: 15,
        skills: ["Testing"],
        dependencies: ["express"],
      },
      {
        key: "deployment",
        title: "Deployment & DevOps",
        description:
          "Docker, CI/CD, environment variables and production deployment.",
        order: 9,
        estimatedHours: 20,
        skills: ["Docker", "CI/CD"],
        dependencies: ["authentication", "testing"],
      },
    ],
  },
];
