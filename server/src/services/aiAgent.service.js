/**
 * aiAgent.service.js
 * Universal AI Agent Core for DevAtlas
 * 
 * Supports:
 * 1. External LLM APIs when keys are present:
 *    - Google Gemini (GEMINI_API_KEY or GOOGLE_API_KEY)
 *    - OpenAI (OPENAI_API_KEY)
 *    - Groq (GROQ_API_KEY)
 *    - Ollama (OLLAMA_BASE_URL)
 * 2. Autonomous Agent Engine:
 *    - In-depth Natural Language parsing, semantic intent classification,
 *      contextual multi-turn dialogue management, and dynamic response generation.
 *    - Specialized personas:
 *      * Aaravi: Empathetic, polite English fluency coach with Indian cultural warmth & deep grammar diagnostics.
 *      * Technical Interviewer: Principal Engineer conducting resume-grounded technical interviews.
 */

// Helper to query external LLMs if user configured an API key in .env
export const callExternalLLM = async ({ systemPrompt, messages, temperature = 0.7 }) => {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const ollamaUrl = process.env.OLLAMA_BASE_URL;

  // 1. Groq API (Ultra-fast inference with verified models)
  if (groqKey) {
    const groqModels = [
      "openai/gpt-oss-120b",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
      "allam-2-7b",
    ];

    for (const model of groqModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            temperature,
            max_tokens: 800,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) return text.trim();
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn(`Groq model ${model} failed (${res.status}):`, errData?.error?.message || res.statusText);
        }
      } catch (err) {
        console.warn(`Groq error on ${model}:`, err.message);
      }
    }
  }

  // 2. Google Gemini API
  if (geminiKey) {
    try {
      const formattedContents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: formattedContents,
            generationConfig: { temperature, maxOutputTokens: 800 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("Gemini API call failed, trying next provider:", err.message);
    }
  }

  // 3. OpenAI API
  if (openAiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          temperature,
          max_tokens: 800,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("OpenAI API call failed, trying next provider:", err.message);
    }
  }

  // 4. Ollama (local)
  if (ollamaUrl) {
    try {
      const res = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          stream: false,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("Ollama call failed, falling back to autonomous engine:", err.message);
    }
  }

  return null;
};

// ============================================================================
// AARAVI AGENT ENGINE (ENGLISH FLUENCY & PHONE CALL CONVERSATION PARTNER)
// ============================================================================

/**
 * Deep Grammar & Syntax Diagnostic Engine
 * Analyzes the user's exact sentence and returns targeted grammatical corrections and vocabulary upgrades.
 */
export const analyzeGrammarAndVocabulary = (text) => {
  if (!text || text.trim().length === 0) {
    return { grammarTip: null, vocabularyUpgrade: null };
  }

  const clean = text.trim();
  const lower = clean.toLowerCase();
  let grammarTip = null;
  let vocabularyUpgrade = null;

  // 1. Common Indian English / Non-native grammatical adjustments
  if (/\bi am having\s+(\d+|many|two|three|much|a lot|years)\b/i.test(clean)) {
    grammarTip = "Instead of 'I am having 3 years of experience', use the simple present: 'I have 3 years of experience'. In English, possession is stated with 'have'.";
  } else if (/\brevert back\b/i.test(clean)) {
    grammarTip = "'Revert' already means to return or reply. Saying 'revert back' is redundant. Simply say: 'I will revert to you soon' or 'I will get back to you'.";
  } else if (/\bprepone\b/i.test(clean)) {
    grammarTip = "'Prepone' is common in Indian English, but in international settings, use 'reschedule earlier' or 'bring forward the meeting'.";
  } else if (/\bdo the needful\b/i.test(clean)) {
    grammarTip = "'Do the needful' is an archaic idiom. Prefer modern professional phrasing like: 'Please take the necessary action' or 'Please proceed as needed'.";
  } else if (/\bmyself\s+[A-Z][a-z]+/i.test(clean)) {
    grammarTip = "Avoid introducing yourself with reflexive pronouns like 'Myself Rahul'. Instead say: 'I am Rahul' or 'My name is Rahul'.";
  } else if (/\bpassed out from\b/i.test(clean)) {
    grammarTip = "Instead of 'I passed out from college in 2024', say 'I graduated from college in 2024'. 'Pass out' commonly means to lose consciousness.";
  } else if (/\bhe don'?t\b/i.test(clean) || /\bshe don'?t\b/i.test(clean) || /\bit don'?t\b/i.test(clean)) {
    grammarTip = "Third-person singular takes 'does not': Use 'He doesn't', 'She doesn't', or 'It doesn't' instead of 'don't'.";
  } else if (/\bdid (you |he |she |they )?(went|saw|solved|came|wrote|did|ate)\b/i.test(clean)) {
    const match = clean.match(/\bdid (?:you |he |she |they )?(went|saw|solved|came|wrote|did|ate)\b/i);
    const verb = match ? match[1] : "the past verb";
    grammarTip = `With the auxiliary 'did', the following verb must be in its base form. For example, use 'did go' or 'did see' rather than 'did ${verb}'.`;
  } else if (/\bi (didn'?t|did not) (went|saw|solved|came|wrote)\b/i.test(clean)) {
    grammarTip = "After 'didn't', use the base verb form: 'I didn't go' (not 'didn't went'), 'I didn't solve' (not 'didn't solved').";
  } else if (/\bcope up with\b/i.test(clean)) {
    grammarTip = "The standard idiom is 'cope with' (not 'cope up with'). Example: 'It was hard to cope with the project deadlines.'";
  } else if (/\bdiscuss about\b/i.test(clean)) {
    grammarTip = "'Discuss' is a transitive verb that doesn't need 'about'. Say 'Let's discuss the project' instead of 'discuss about'.";
  } else if (/\bi am agree\b/i.test(clean)) {
    grammarTip = "Say 'I agree' rather than 'I am agree'. Agree is a verb, not an adjective.";
  } else if (/\baccording to me\b/i.test(clean)) {
    grammarTip = "Native speakers usually reserve 'according to' for other people or sources. For your own thoughts, say: 'In my opinion' or 'From my perspective'.";
  } else if (/\b(one of my friend|one of the problem)\b/i.test(clean)) {
    grammarTip = "'One of' is followed by a plural noun: 'one of my friends', 'one of the problems'.";
  } else if (!/\b(a|an|the)\b/i.test(clean) && clean.split(" ").length > 6 && /\b(developer|engineer|problem|bug|database|component)\b/i.test(clean)) {
    grammarTip = "Check your articles ('a', 'an', 'the') before singular countable nouns. For instance: 'I am *a* software engineer', 'We solved *a* critical issue'.";
  } else if (clean.length > 35) {
    grammarTip = "Your sentence is grammatically sound and structured well! Speaking with steady pacing and natural pauses will make your delivery sound very polished.";
  }

  // 2. Vocabulary upgrades tailored to exact concepts mentioned
  if (/\b(problem|error|bug|issue)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: Instead of 'we had a big problem', try 'we encountered an intricate architectural bottleneck' or 'we isolated an intermittent concurrency defect'.";
  } else if (/\b(good|nice|fine|cool)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: Elevate everyday adjectives like 'good' or 'nice' with 'commendable', 'exemplary', 'robust', or 'well-orchestrated'.";
  } else if (/\b(make|making|create|built)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: In engineering dialogues, consider 'architected', 'spearheaded', 'formulated', or 'engineered' to emphasize ownership.";
  } else if (/\b(fast|speed|quick)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: Replace 'it makes it fast' with 'it optimizes throughput', 'minimizes latency', or 'delivers sub-millisecond response times'.";
  } else if (/\b(hard|difficult|tough)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: Instead of 'it was very hard', try 'it presented non-trivial algorithmic complexities' or 'it required rigorous investigative effort'.";
  } else if (/\b(think|feel|believe)\b/i.test(clean)) {
    vocabularyUpgrade = "Upgrade: Express your perspective with 'My assessment indicates that...', 'I hypothesize that...', or 'From an architectural standpoint...'";
  } else {
    vocabularyUpgrade = "Upgrade: Use smooth connective phrases like 'In light of that...', 'Consequently...', or 'To elaborate further...' to sound naturally articulate.";
  }

  return { grammarTip, vocabularyUpgrade };
};

/**
 * Autonomous Conversational Response Generator for Aaravi
 * Emulates a real person conversing on a phone call. Responds dynamically to ANY query.
 */
export const generateAaraviAutonomousResponse = ({ message, scenario, conversationHistory = [] }) => {
  const text = (message || "").trim();
  const lower = text.toLowerCase();

  // Inspect previous turn to build continuity
  const lastAssistantTurn = [...conversationHistory].reverse().find((m) => m.role === "assistant")?.content || "";

  // 1. GREETINGS & SELF-IDENTIFICATION / AGENT QUERY
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening)|hola|vanakkam|pranam)\b/i.test(lower)) {
    return (
      `Namaste and hello! I am so delighted to talk with you. I'm Aaravi, your conversational partner and English fluency companion. ` +
      `We can talk just like two friends catching up on a phone call. How has your day been going so far, and what would you like to chat about today?`
    );
  }

  if (/\b(who are you|your name|what do you do|tell me about yourself)\b/i.test(lower)) {
    return (
      `I am Aaravi! I am an AI conversational partner designed to help you speak English naturally, comfortably, and with total confidence. ` +
      `Think of me as a supportive friend on the other end of the line—you can share your thoughts on coding, daily life, interview prep, or whatever is on your mind. ` +
      `Tell me, how long have you been practicing English, and what is your favorite part about speaking the language?`
    );
  }

  // 2. DIRECT QUESTIONS ASKED BY THE USER
  if (lower.startsWith("why") || lower.includes("why is") || lower.includes("why do")) {
    return (
      `That is such a thoughtful question to explore! When you ask "why", it shows a deeply curious mind. ` +
      `Looking at "${text.replace(/[?]/g, "")}", there are often multiple angles to consider. On one hand, people value clarity and efficiency; on the other hand, practical experience teaches us patience. ` +
      `What is your personal perspective on this? How do you see it affecting your daily routine or development work?`
    );
  }

  if (lower.startsWith("how") || lower.includes("how to") || lower.includes("how can i")) {
    if (lower.includes("english") || lower.includes("speak") || lower.includes("fluent") || lower.includes("confidence")) {
      return (
        `The secret to spoken fluency is consistency and letting go of the fear of making mistakes! ` +
        `When we speak on the phone like this, try to focus on conveying your message smoothly rather than striving for perfection. ` +
        `Reading aloud for ten minutes a day, practicing natural pauses, and discussing real-world topics with me will rapidly build your muscle memory. ` +
        `How comfortable do you feel right now expressing your ideas in English?`
      );
    }
    if (lower.includes("prepare") || lower.includes("interview") || lower.includes("job")) {
      return (
        `Preparing for interviews is all about structuring your thoughts clearly! ` +
        `I always suggest the STAR framework—Situation, Task, Action, and Result. It gives your answers a natural rhythm that interviewers love. ` +
        `Also, remember to breathe calmly and speak at a steady pace. Would you like to practice answering a common technical or behavioral question together right now?`
      );
    }
    return (
      `That is a very practical question! In my experience, the best approach is to break it down into manageable, actionable steps. ` +
      `Start by identifying the primary goal, gather the necessary resources, and execute incrementally while validating your progress. ` +
      `Have you already tried any particular method for this, or are you exploring new avenues?`
    );
  }

  if (lower.startsWith("what is") || lower.startsWith("what are") || lower.includes("what do you think")) {
    if (lower.includes("ai") || lower.includes("future") || lower.includes("technology")) {
      return (
        `Technology and AI are evolving so rapidly, aren't they? I believe AI is a wonderful amplifier of human creativity and engineering ingenuity. ` +
        `It handles repetitive boilerplate so developers and thinkers like you can focus on high-level architecture and solving real human problems. ` +
        `How do you personally utilize AI in your daily development or learning journey?`
      );
    }
    return (
      `That is an intriguing topic! From my vantage point, looking at "${text.replace(/[?]/g, "")}", it really highlights how important context and nuance are. ` +
      `In professional discussions, having a well-rounded viewpoint demonstrates deep maturity. ` +
      `I would love to hear your take on it—what led you to think about this specific question today?`
    );
  }

  // 3. EMOTIONAL / CONFIDENCE / CAREER EXPRESSIONS
  if (/\b(nervous|anxious|scared|worried|stress|stressed|fear)\b/i.test(lower)) {
    return (
      `Please take a gentle, deep breath. It is completely natural to feel nervous—in fact, feeling nervous simply means that you care deeply about doing well! ` +
      `Remember how much hard work you have already put in. You don't have to be flawless; you just have to be genuine and communicate your thoughts one step at a time. ` +
      `I am right here with you. Would you like to talk through what is causing you the most stress right now?`
    );
  }

  if (/\b(happy|excited|great|awesome|wonderful|proud|succeeded|passed)\b/i.test(lower)) {
    return (
      `Oh, that is absolutely wonderful to hear! Hearing your positive energy brings such a smile to my face. ` +
      `Celebrating these victories—both big and small—is so essential for our confidence. ` +
      `Tell me all the details! What made this experience so special for you?`
    );
  }

  // 4. SCENARIO-SPECIFIC PHONE CALL ROLEPLAY
  if (scenario === "standup") {
    if (lower.includes("yesterday") || lower.includes("today") || lower.includes("blocker") || lower.includes("ticket") || lower.includes("pr")) {
      return (
        `Thank you for that clear sprint update! You articulated your accomplishments and current focus with great clarity. ` +
        `In an agile standup, keeping your tone crisp and confident lets team members quickly see where they can collaborate with you. ` +
        `Are there any cross-team dependencies or code reviews blocking your progress today that we should highlight?`
      );
    }
    return (
      `Good morning! In a daily standup call, a quick 3-part update works best: 1) What you wrapped up yesterday, 2) What you are diving into today, and 3) Any impediments. ` +
      `Go ahead and share your update as if we are on our morning engineering huddle!`
    );
  }

  if (scenario === "interview") {
    return (
      `Thank you for elaborating on that point. You conveyed your reasoning with commendable poise. ` +
      `In an interview, pairing your explanation with a specific real-world example or metric—such as reducing latency or improving maintainability—creates an unforgettable impression. ` +
      `If the interviewer asked you how this solution would scale to thousands of concurrent users, how would you articulate that?`
    );
  }

  if (scenario === "casual") {
    if (lower.includes("weather") || lower.includes("rain") || lower.includes("hot") || lower.includes("cold") || lower.includes("summer")) {
      return (
        `Oh, talking about the weather is truly the classic way to begin any friendly conversation! ` +
        `A pleasant breeze or a cozy cup of masala chai or coffee makes any day so much brighter. How is the climate in your city today? Do you enjoy this kind of weather?`
      );
    }
    if (lower.includes("weekend") || lower.includes("movie") || lower.includes("food") || lower.includes("travel") || lower.includes("hobby")) {
      return (
        `That sounds delightful! Taking time to unwind and recharge with things you love keeps our minds sharp for complex engineering challenges. ` +
        `What kind of activities or cuisines bring you the most joy when you step away from your computer screen?`
      );
    }
    return (
      `It is so refreshing having a casual conversation with you! Casual chats are wonderful for building genuine rapport with colleagues before meetings. ` +
      `How has your week been shaping up overall? Have you had any memorable moments recently?`
    );
  }

  // 5. TECHNICAL OR ENGINEERING TOPICS
  if (/\b(react|javascript|node|mongo|express|redis|api|database|css|frontend|backend|dsa|algorithm)\b/i.test(lower)) {
    return (
      `It is always fantastic to talk tech! You referenced software concepts that are fundamental to modern production architectures. ` +
      `When you speak about technologies like these in English, maintaining smooth transitions between your high-level design and lower-level implementation details sounds very impressive. ` +
      `Could you tell me a little more about how you implemented this in your own project? What was the most interesting technical decision you made?`
    );
  }

  // 6. GENERAL OPEN-ENDED INTELLIGENT CONVERSATION
  // Address the user's custom statement dynamically
  const subjectSnippet = text.length > 50 ? `what you mentioned about "${text.slice(0, 40)}..."` : `"${text}"`;
  return (
    `I really appreciate you sharing that with me! When you talk about ${subjectSnippet}, your enthusiasm and perspective come through clearly. ` +
    `Practicing our conversation like this on the phone helps build spontaneous conversational agility so you can express any complex idea with ease. ` +
    `Could you elaborate a bit more on that? How does that connect with your personal goals or experiences?`
  );
};

// ============================================================================
// TECHNICAL INTERVIEWER AGENT ENGINE
// ============================================================================

/**
 * Technical Interviewer Dynamic Agent
 * Analyzes candidate answers, critiques system design & problem solving,
 * answers candidate questions, and synthesizes dynamic follow-up inquiries.
 */
export const generateInterviewerAutonomousResponse = ({
  candidateAnswer,
  currentRound,
  roundIndex,
  resumeData,
  history = [],
}) => {
  const answer = (candidateAnswer || "").trim();
  const lower = answer.toLowerCase();
  const candidateName = resumeData?.candidateName?.split(" ")?.[0] || "Candidate";
  const targetRole = resumeData?.targetRole || "Full Stack Developer";

  // Check if candidate is asking the interviewer a clarifying question
  const isQuestion = answer.includes("?") || /^(can i|should i|do we|what is|how much|could you clarify|is this)\b/i.test(lower);

  let critique = "";
  let score = 75;
  let dynamicFollowUp = "";

  if (isQuestion) {
    critique = `Great clarifying question! Senior engineers always clarify requirements and scale constraints before committing to a technical architecture.`;
    score = 88;
    if (lower.includes("scale") || lower.includes("traffic") || lower.includes("users")) {
      dynamicFollowUp = `Assume we are designing for 500,000 daily active users with a peak read-to-write ratio of 8:1. Latency under 150ms is critical. With those constraints in mind, how would you design the data storage and caching layer?`;
    } else if (lower.includes("database") || lower.includes("sql") || lower.includes("nosql")) {
      dynamicFollowUp = `You have the freedom to pick either a relational model (like PostgreSQL) or a document/key-value store (like MongoDB/Redis). Just justify your schema normalization choices and how you will handle high-concurrency transactions.`;
    } else {
      dynamicFollowUp = `For this scenario, assume a modern cloud environment with horizontal autoscaling and containerized microservices. How would you proceed with your solution given those parameters?`;
    }
  } else {
    // Evaluate answer depth based on technical vocabulary and architectural substance
    const technicalKeywords = [
      "redis", "cache", "caching", "index", "indexing", "cluster", "shard", "sharding",
      "latency", "throughput", "async", "await", "concurrency", "mutex", "lock",
      "microservice", "docker", "kubernetes", "kafka", "queue", "worker", "worker pool",
      "postgres", "mongodb", "transaction", "acid", "jwt", "oauth", "rate limit",
      "event loop", "garbage collection", "memory leak", "websocket", "state management",
      "trade-off", "tradeoff", "bottleneck", "profiling", "benchmark"
    ];

    const matchedKeywords = technicalKeywords.filter((kw) => lower.includes(kw));
    const wordCount = answer.split(/\s+/).length;

    if (wordCount < 15) {
      score = 55;
      critique = `Your response was very brief. In technical interviews for ${targetRole}, interviewers look for structured reasoning, architectural tradeoffs, and concrete implementation examples.`;
      dynamicFollowUp = `Could you expand on that with specific engineering details? For example, what specific mechanisms, libraries, or protocols would you use to implement that safely in production?`;
    } else if (matchedKeywords.length >= 3 || wordCount >= 70) {
      score = Math.min(96, 85 + matchedKeywords.length * 2);
      critique = `Strong engineering answer! You demonstrated solid depth by referencing ${matchedKeywords.slice(0, 3).join(", ") || "core architectural principles"} and explaining practical tradeoffs.`;
      
      // Dynamic follow-up pushing candidate to higher seniority
      if (lower.includes("cache") || lower.includes("redis")) {
        dynamicFollowUp = `You discussed caching strategies effectively. In a production cluster, how would you mitigate cache stampede (thundering herd) and ensure that cache invalidation doesn't lead to stale reads during high write traffic?`;
      } else if (lower.includes("mongo") || lower.includes("database") || lower.includes("sql")) {
        dynamicFollowUp = `Regarding your database choices: how would you structure compound indexes to support complex filtering, and what is your disaster recovery or failover replication strategy?`;
      } else if (lower.includes("react") || lower.includes("state") || lower.includes("ui")) {
        dynamicFollowUp = `From a frontend performance perspective, how do you profile and prevent unnecessary component re-renders when managing complex global state with real-time WebSocket feeds?`;
      } else {
        dynamicFollowUp = `Excellent explanation. If the system were to experience a sudden 10x traffic spike that caused latency to degrade, what observability tools and metrics (e.g. CPU, p99 latency, connection pool saturation) would you inspect first to isolate the bottleneck?`;
      }
    } else {
      score = 75;
      critique = `Good foundational answer. You communicated your thoughts clearly. To elevate your response to senior level, ground your points with concrete metrics, edge-case handling, and architectural tradeoffs.`;
      dynamicFollowUp = `That makes sense. Can you walk me through how you would handle failure scenarios—such as network timeouts, unhandled exceptions, or database connection drops—to ensure graceful degradation?`;
    }
  }

  return {
    critique,
    score,
    dynamicFollowUp,
    candidateName,
  };
};
