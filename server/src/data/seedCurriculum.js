export const blueprintCurriculum = [
  {
    topicKey: "javascript",
    slug: "javascript-async-internals",
    title: "JavaScript Async Runtime, Event Loop & Memory Architecture",
    category: "language",
    version: 1,
    estimatedMinutes: 20,
    learningObjectives: [
      "Analyze V8 Call Stack, Microtask queue, and Macrotask queue prioritization.",
      "Accurately predict output sequences involving Promises, async/await, and timer scheduling.",
      "Prevent microtask queue starvation and unhandled Promise rejections in server environments.",
    ],
    misconceptions: [
      {
        misconception: "setTimeout(fn, 0) runs immediately on the next tick.",
        explanation:
          "setTimeout schedules a task into the Macrotask queue. It will only execute after the synchronous Call Stack empties AND all queued Microtasks are completely drained.",
      },
      {
        misconception: "Async functions run on background worker threads in Node.js.",
        explanation:
          "JavaScript executes on a single main thread. Async functions compile down to Promises executed via the Microtask queue on that same single thread.",
      },
    ],
    sources: [
      {
        title: "MDN Web Docs: Concurrency model and the event loop",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
      },
      {
        title: "Node.js Event Loop, Timers and process.nextTick()",
        url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
      },
    ],
    content: `## 1. The Single-Threaded Call Stack & Memory Model
JavaScript engines (like V8) feature a single Call Stack and a Memory Heap. Because only one frame executes at any time, non-blocking asynchronous operations are delegated to runtime APIs (Browser Web APIs or Node's libuv).

\`\`\`
+-------------------+
|    Call Stack     |  <-- Executes functions synchronously
+-------------------+
          | (awaits or queues callbacks)
          v
+-------------------+
|  Microtask Queue  |  <-- Promise.then, queueMicrotask, process.nextTick (HIGHEST PRIORITY)
+-------------------+
          |
+-------------------+
|  Macrotask Queue  |  <-- setTimeout, setInterval, setImmediate, I/O
+-------------------+
\`\`\`

---

## 2. The Microtask Exhaustion Rule
When the Call Stack empties, the Event Loop **exhausts the entire Microtask Queue** before it ever retrieves the next task from the Macrotask Queue. If a microtask continuously schedules another microtask, the macrotask queue starves!

### Production Example:
\`\`\`javascript
console.log("A");

setTimeout(() => {
  console.log("B - Macrotask");
}, 0);

Promise.resolve().then(() => {
  console.log("C - Microtask 1");
}).then(() => {
  console.log("D - Microtask 2");
});

console.log("E");
\`\`\`
**Output Sequence:** \`A -> E -> C -> D -> B\`.

---

## 3. Production Hardening: Unhandled Rejections
Always attach rejection handlers or wrap \`await\` expressions in proper error boundaries. In modern Node.js runtimes, unhandled promise rejections terminate the process with a non-zero exit code.`,
    assessment: {
      title: "JavaScript Async & Runtime Mastery Assessment",
      slug: "javascript-async-mastery",
      passingScore: 80,
      skillTags: ["JavaScript", "Event Loop", "Promises"],
      questions: [
        {
          question:
            "Given the following code, in what exact sequence will the numbers be logged?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
          type: "mcq",
          options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "3, 1, 4, 2"],
          correctAnswer: "1, 4, 3, 2",
          explanation:
            "Synchronous code (1, 4) executes on the call stack first. When empty, the event loop drains the microtask queue (Promise -> 3). Finally, the macrotask queue (setTimeout -> 2) runs.",
          misconceptionKey: "setTimeout_timing",
          points: 25,
        },
        {
          question:
            "What happens if an asynchronous function throws an error without a try/catch block and the caller does not attach a .catch() handler?",
          type: "mcq",
          options: [
            "The error is silently ignored and execution proceeds normally",
            "Node.js logs an UnhandledPromiseRejection warning and terminates the process in modern versions",
            "The function automatically retries three times before failing",
            "The error is routed to console.log as a string",
          ],
          correctAnswer:
            "Node.js logs an UnhandledPromiseRejection warning and terminates the process in modern versions",
          explanation:
            "Uncaught rejections in Node.js emit an 'unhandledRejection' event and cause the process to exit with a non-zero code to avoid corrupted memory state.",
          misconceptionKey: "unhandled_rejections",
          points: 25,
        },
        {
          question:
            "Why does Promise.resolve().then(f1).then(f2) guarantee that f1 executes before any queued setTimeout(f3, 0)?",
          type: "mcq",
          options: [
            "Because setTimeout has a mandatory minimum 100ms penalty",
            "Because the Event Loop drains all pending microtasks before executing macrotasks",
            "Because Promises use multi-threading while setTimeout uses single-threading",
            "Because f1 executes synchronously on the main thread during creation",
          ],
          correctAnswer:
            "Because the Event Loop drains all pending microtasks before executing macrotasks",
          explanation:
            "Microtasks have absolute execution priority over macrotasks when the call stack becomes idle.",
          misconceptionKey: "microtask_priority",
          points: 25,
        },
        {
          question:
            "Which JavaScript feature causes variables declared with 'let' and 'const' to be inaccessible prior to declaration?",
          type: "mcq",
          options: [
            "Lexical scoping degradation",
            "Temporal Dead Zone (TDZ)",
            "Automatic garbage collection quarantine",
            "Closure boundary locking",
          ],
          correctAnswer: "Temporal Dead Zone (TDZ)",
          explanation:
            "'let' and 'const' variables are hoisted into memory during compilation, but remain uninitialized until execution reaches the declaration line.",
          misconceptionKey: "tdz",
          points: 25,
        },
      ],
    },
  },
  {
    topicKey: "async-flow",
    slug: "async-flow-concurrency",
    title: "Async/Await Control Flow, Error Boundaries & Concurrency",
    category: "core",
    version: 1,
    estimatedMinutes: 25,
    learningObjectives: [
      "Differentiate sequential execution (for...of) from parallel execution (Promise.all, Promise.allSettled).",
      "Avoid common async pitfalls such as using await inside Array.prototype.forEach.",
      "Implement robust batching and error resilient concurrency patterns.",
    ],
    misconceptions: [
      {
        misconception: "Array.prototype.forEach waits for promises when given an async callback.",
        explanation:
          "forEach does not await returned promises. It fires all iterations concurrently and returns undefined immediately.",
      },
      {
        misconception: "Promise.all always waits for all promises to finish.",
        explanation:
          "Promise.all immediately rejects ('fail-fast') as soon as any single promise rejects. Use Promise.allSettled when you need all outcomes.",
      },
    ],
    sources: [
      {
        title: "MDN: Promise.allSettled()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled",
      },
    ],
    content: `## 1. Concurrency Patterns in Node.js
When processing multiple asynchronous operations (such as database queries or API calls), choosing the correct control flow is essential for performance and reliability.

### Sequential Execution:
Use \`for...of\` when step $N$ requires the output of step $N-1$:
\`\`\`javascript
for (const item of items) {
  await processItem(item); // Runs one after another
}
\`\`\`

### Parallel Execution:
Use \`Promise.allSettled\` when tasks are independent and partial failures should not abort the entire batch:
\`\`\`javascript
const results = await Promise.allSettled([
  fetchUserData(userId),
  fetchUserAnalytics(userId),
  fetchNotifications(userId),
]);

results.forEach((res) => {
  if (res.status === "fulfilled") {
    // Process res.value
  } else {
    // Log res.reason without crashing
  }
});
\`\`\`

---

## 2. The forEach Async Trap
\`\`\`javascript
// BAD - DOES NOT AWAIT:
items.forEach(async (item) => {
  await saveToDb(item);
});
console.log("Done"); // Logs BEFORE database saves finish!

// GOOD:
await Promise.all(items.map((item) => saveToDb(item)));
console.log("Done"); // Logs AFTER all database saves finish!
\`\`\``,
    assessment: {
      title: "Async Control Flow & Concurrency Assessment",
      slug: "async-control-flow-mastery",
      passingScore: 80,
      skillTags: ["JavaScript", "Async/Await", "Concurrency"],
      questions: [
        {
          question:
            "Why is using 'await' inside an Array.prototype.forEach callback problematic?",
          type: "mcq",
          options: [
            "It throws a syntax error in modern JavaScript",
            "forEach does not await the returned promises, leading to unhandled concurrency and race conditions",
            "It locks the Event Loop permanently",
            "It automatically converts all promises into callbacks",
          ],
          correctAnswer:
            "forEach does not await the returned promises, leading to unhandled concurrency and race conditions",
          explanation:
            "Array.prototype.forEach simply invokes the callback for each item without awaiting the returned Promise.",
          misconceptionKey: "forEach_async",
          points: 25,
        },
        {
          question:
            "How does Promise.allSettled() differ from Promise.all() when one of the promises rejects?",
          type: "mcq",
          options: [
            "Promise.allSettled() retries the failed promise once",
            "Promise.allSettled() waits for all promises to settle regardless of rejection, while Promise.all() rejects immediately",
            "Promise.allSettled() ignores rejections and returns only fulfilled promises",
            "There is no difference; they are aliases",
          ],
          correctAnswer:
            "Promise.allSettled() waits for all promises to settle regardless of rejection, while Promise.all() rejects immediately",
          explanation:
            "Promise.allSettled waits for every promise to resolve or reject, returning an array of outcome objects ({ status: 'fulfilled' | 'rejected' }).",
          misconceptionKey: "promise_settled_vs_all",
          points: 25,
        },
        {
          question:
            "What is the return value of an async function that does not contain an explicit return statement?",
          type: "mcq",
          options: [
            "undefined",
            "A Promise that resolves to undefined",
            "null",
            "A rejected Promise",
          ],
          correctAnswer: "A Promise that resolves to undefined",
          explanation:
            "Async functions always wrap their return value in a Promise. An implicit return returns Promise.resolve(undefined).",
          misconceptionKey: "async_return_value",
          points: 25,
        },
        {
          question:
            "In Node.js, what is the best practice for limiting the number of simultaneous outbound HTTP requests in high-throughput workloads?",
          type: "mcq",
          options: [
            "Running a while(true) loop with Date.now() checks",
            "Using a concurrency limiter (like p-limit) or a worker queue to avoid socket and memory exhaustion",
            "Increasing the CPU frequency",
            "Disabling the V8 garbage collector",
          ],
          correctAnswer:
            "Using a concurrency limiter (like p-limit) or a worker queue to avoid socket and memory exhaustion",
          explanation:
            "Unbounded Promise.all over thousands of requests can exhaust memory and open sockets. Concurrency pools regulate the flight rate.",
          misconceptionKey: "concurrency_limits",
          points: 25,
        },
      ],
    },
  },
  {
    topicKey: "express-validation",
    slug: "express-request-validation",
    title: "Production Express Request Validation & Architectural Error Handling",
    category: "backend",
    version: 1,
    estimatedMinutes: 25,
    learningObjectives: [
      "Implement fail-fast request validation using Zod schemas at the route boundary.",
      "Construct standardized error payloads with proper HTTP status codes (400, 401, 403, 404, 500).",
      "Safeguard against prototype pollution and mass assignment through strict payload stripping.",
    ],
    misconceptions: [
      {
        misconception: "Validation checks should be performed inside service or database models.",
        explanation:
          "Input validation belongs at the HTTP controller/middleware boundary to reject invalid data before executing domain logic.",
      },
      {
        misconception: "Returning 500 Internal Server Error for invalid user input is acceptable.",
        explanation:
          "Client errors (invalid types, missing fields) must return 400 Bad Request with field-level guidance, never 500.",
      },
    ],
    sources: [
      {
        title: "Zod Documentation: Schema Validation",
        url: "https://zod.dev",
      },
    ],
    content: `## 1. Fail-Fast Validation Architecture
Never allow malformed payloads to reach domain services. In a production Express architecture:

\`\`\`
Request -> Auth Middleware -> Zod Validation Middleware -> Controller -> Service -> Model
\`\`\`

### Implementing Zod Middleware:
\`\`\`javascript
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Strips unknown fields, enforces types
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }
    next(err);
  }
};
\`\`\`

---

## 2. Production Scenario Lab: Debugging an Express API Route
### Scenario:
An Express route \`PATCH /api/v1/projects/:id\` crashes with a 500 error when given \`{ "title": "" }\` because the service performs \`project.title.trim()\` on an empty string and MongoDB rejects the schema.

### Root Cause & Remediation:
1. Define a strict Zod schema enforcing \`z.string().min(1, "Title cannot be empty")\`.
2. Reject with \`400 Bad Request\` before the service layer executes.`,
    assessment: {
      title: "Express Validation & Error Architecture Lab Assessment",
      slug: "express-validation-mastery",
      passingScore: 80,
      skillTags: ["Express.js", "Zod", "API Design", "Security"],
      questions: [
        {
          question:
            "Where in the request lifecycle should schema validation be executed in clean architecture?",
          type: "mcq",
          options: [
            "Inside the database migration script",
            "At the route/middleware boundary before controller logic runs",
            "Directly inside the view template",
            "In a background cron job after saving",
          ],
          correctAnswer: "At the route/middleware boundary before controller logic runs",
          explanation:
            "Validating at the route boundary ensures fail-fast rejection of invalid inputs before any domain logic executes.",
          misconceptionKey: "validation_layer",
          points: 25,
        },
        {
          question:
            "Which HTTP status code should be returned when a client submits an email address with invalid format?",
          type: "mcq",
          options: [
            "500 Internal Server Error",
            "400 Bad Request (or 422 Unprocessable Content)",
            "401 Unauthorized",
            "503 Service Unavailable",
          ],
          correctAnswer: "400 Bad Request (or 422 Unprocessable Content)",
          explanation:
            "Client syntax/semantic input errors belong in the 4xx range (400 Bad Request or 422 Unprocessable Content). 500 indicates a server-side bug.",
          misconceptionKey: "http_status_codes",
          points: 25,
        },
        {
          question:
            "Why is schema parsing (such as zodSchema.parse) superior to manual if(!req.body.name) checks?",
          type: "mcq",
          options: [
            "It runs on a separate GPU thread",
            "It strips undeclared injected properties (Mass Assignment protection) and guarantees TypeScript/runtime type safety",
            "It eliminates the need for database indexing",
            "It converts all JSON to XML automatically",
          ],
          correctAnswer:
            "It strips undeclared injected properties (Mass Assignment protection) and guarantees TypeScript/runtime type safety",
          explanation:
            "Zod validates types, strips unknown keys to prevent Mass Assignment vulnerabilities, and provides consistent error formatting.",
          misconceptionKey: "schema_parsing_benefits",
          points: 25,
        },
        {
          question:
            "In Express centralized error handling, why must the error middleware have four arguments: (err, req, res, next)?",
          type: "mcq",
          options: [
            "It is just a stylistic convention and three arguments work identically",
            "Express relies on Function.prototype.length === 4 to distinguish error handlers from standard middleware",
            "The fourth argument is required for Redis session clustering",
            "Because Node.js streams require four arguments",
          ],
          correctAnswer:
            "Express relies on Function.prototype.length === 4 to distinguish error handlers from standard middleware",
          explanation:
            "Express checks function arity (fn.length). A middleware with 4 arguments is treated as an error handler. Omitting 'next' causes Express to treat it as regular middleware.",
          misconceptionKey: "express_error_middleware_arity",
          points: 25,
        },
      ],
    },
  },
];
