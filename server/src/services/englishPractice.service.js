import {
  analyzeGrammarAndVocabulary,
  callExternalLLM,
  generateAaraviAutonomousResponse,
} from "./aiAgent.service.js";

/**
 * Chat with AI Agent Aaravi
 * Real conversational partner for spoken English practice, emulating a live phone call.
 */
export const chatWithAaravi = async (
  userId,
  userMessage,
  scenario = "general",
  conversationHistory = []
) => {
  const text = (userMessage || "").trim();

  // 1. Analyze grammar & vocabulary for targeted feedback
  const { grammarTip: autoGrammar, vocabularyUpgrade: autoVocab } =
    analyzeGrammarAndVocabulary(text);

  let reply = "";
  let grammarTip = autoGrammar;
  let vocabularyUpgrade = autoVocab;
  let confidenceScore = Math.min(
    98,
    Math.max(72, 75 + Math.min(23, Math.floor(text.length / 5)))
  );

  // 2. Try calling external LLM (Gemini, OpenAI, Groq, Ollama) if configured
  const systemPrompt = `You are Aaravi, a friendly, polite, and supportive AI English fluency coach and conversational companion with Indian cultural warmth.
You speak like a close friend and articulate mentor on a live phone call.
Rules:
1. Converse naturally and directly in response to whatever the user said or asked. Answer their custom query thoroughly and politely.
2. Maintain a warm, encouraging tone. Keep the speech concise (2 to 4 sentences) so it sounds natural on audio speech synthesis.
3. Always ask an engaging follow-up question related to what they said to keep the phone conversation flowing smoothly.
4. Output your response, followed by a valid JSON block on a new line:
{"grammarTip": "Constructive grammar tip for user input, or praise if clean", "vocabularyUpgrade": "Alternative elevated word/phrase", "confidenceScore": 85}`;

  const formattedMessages = [
    ...conversationHistory.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
    { role: "user", content: text || "Hello Aaravi!" },
  ];

  try {
    const llmResult = await callExternalLLM({
      systemPrompt,
      messages: formattedMessages,
      temperature: 0.7,
    });

    if (llmResult) {
      // Parse JSON payload if appended
      const jsonMatch = llmResult.match(/\{[\s\S]*"grammarTip"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          grammarTip = parsed.grammarTip || grammarTip;
          vocabularyUpgrade = parsed.vocabularyUpgrade || vocabularyUpgrade;
          confidenceScore = parsed.confidenceScore || confidenceScore;
          reply = llmResult.replace(jsonMatch[0], "").trim();
        } catch {
          reply = llmResult.trim();
        }
      } else {
        reply = llmResult.trim();
      }
    }
  } catch (err) {
    console.warn("LLM generation skipped, using autonomous engine:", err.message);
  }

  // 3. If LLM didn't produce a reply, use the Autonomous Agent Engine
  if (!reply) {
    reply = generateAaraviAutonomousResponse({
      message: text,
      scenario,
      conversationHistory,
    });
  }

  return {
    agentName: "Aaravi",
    agentRole: "Empathetic English Fluency Coach",
    voiceLanguage: "en-IN",
    voiceGender: "female",
    reply,
    grammarTip,
    vocabularyUpgrade,
    confidenceScore,
    timestamp: new Date(),
  };
};
