export const chatWithAaravi = async (userId, userMessage, scenario = "general") => {
  const text = (userMessage || "").trim();
  const lower = text.toLowerCase();

  // Conversational response generation tailored for polite, friendly communication
  let reply = "";
  let grammarTip = null;
  let vocabularyUpgrade = null;

  // Gentle grammar pattern checks
  if (/\bi am having\b/i.test(text)) {
    grammarTip = "In professional English, instead of saying 'I am having 2 years of experience', it is more natural to say 'I have 2 years of experience'.";
  } else if (/\bhe don'?t\b/i.test(text) || /\bshe don'?t\b/i.test(text)) {
    grammarTip = "Remember to use 'doesn't' with third-person singular: 'He doesn't' or 'She doesn't'.";
  } else if (/\bdid you went\b/i.test(text) || /\bdid you solved\b/i.test(text)) {
    grammarTip = "When using 'did', keep the main verb in base form: 'Did you go' or 'Did you solve'.";
  } else if (text.length > 20) {
    grammarTip = "Your sentence structure is very clear and understandable! Speaking smoothly with natural pauses helps your clarity shine.";
  }

  // Vocabulary enhancements based on context
  if (lower.includes("problem") || lower.includes("bug") || lower.includes("error")) {
    vocabularyUpgrade = "Instead of 'I solved a big problem', try 'I resolved a complex bottleneck' or 'I diagnosed and mitigated the issue'.";
  } else if (lower.includes("project") || lower.includes("work") || lower.includes("app")) {
    vocabularyUpgrade = "Consider using 'architected' or 'engineered' to describe your technical contributions with executive confidence.";
  } else {
    vocabularyUpgrade = "Use transitions like 'Furthermore', 'Consequently', or 'In addition' to link ideas smoothly during engineering discussions.";
  }

  // Scenario-based contextual responses
  if (scenario === "standup") {
    if (lower.includes("yesterday") || lower.includes("today") || lower.includes("blocker")) {
      reply = `Thank you for sharing that concise sprint update! You structured your points effectively. How do you plan to tackle the dependencies for today's tasks? I'd love to hear how you'll explain the next steps to your team.`;
    } else {
      reply = `Good day! For an agile standup, a great structure is: 1) What you completed yesterday, 2) What you are executing today, and 3) Any potential blockers. Give it a try, and I'll listen attentively!`;
    }
  } else if (scenario === "interview") {
    if (lower.includes("myself") || lower.includes("experience") || lower.includes("background")) {
      reply = `That was a very pleasant self-introduction! You highlighted your passion well. To make it even more impactful, what is one key engineering achievement or metric you are most proud of? Tell me about it!`;
    } else {
      reply = `Welcome! In an interview setting, speaking with calm pacing and positive inflection makes a wonderful impression. Could you tell me about yourself and your journey into software development?`;
    }
  } else if (scenario === "casual") {
    if (lower.includes("weekend") || lower.includes("weather") || lower.includes("how are you") || lower.includes("coffee")) {
      reply = `I am doing wonderfully, thank you so much for asking kindly! Casual conversations are such a lovely way to build rapport with your colleagues before meetings start. What hobbies or side interests do you enjoy outside of coding?`;
    } else {
      reply = `Hello! It is so nice to chat with you. How has your week been treating you so far? Are you working on anything exciting today?`;
    }
  } else {
    // General conversational English
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("hey")) {
      reply = `Namaste and hello! I am Aaravi, your AI English practice companion. I'm here to converse with you in a friendly, supportive environment. You can talk to me about anything—your day, your code, or your career goals. What is on your mind today?`;
    } else if (text.length > 0) {
      reply = `I really enjoyed reading your thought! You communicated your idea clearly. To build on what you just said: how do you feel your English communication has improved as you discuss these topics? Feel free to speak freely!`;
    } else {
      reply = `Namaste! Whenever you are ready, please share a sentence or question with me. I'm excited to practice English with you!`;
    }
  }

  return {
    agentName: "Aaravi",
    agentRole: "Empathetic English Fluency Coach",
    voiceLanguage: "en-IN",
    voiceGender: "female",
    reply,
    grammarTip,
    vocabularyUpgrade,
    confidenceScore: Math.min(98, Math.max(70, 75 + Math.min(25, Math.floor(text.length / 5)))),
    timestamp: new Date(),
  };
};
