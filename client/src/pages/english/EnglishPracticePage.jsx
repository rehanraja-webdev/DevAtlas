import { useState, useEffect, useRef } from "react";
import api from "../../api/client.js";
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  RotateCcw,
  Bot,
  Lightbulb,
  Radio,
  Clock,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Flame,
  ArrowRight,
  X,
} from "lucide-react";

const SCENARIOS = [
  { id: "general", label: "🌟 Free Conversation", desc: "Open-ended chat about any topic, coding, or daily life" },
  { id: "standup", label: "🎙️ Daily Standup", desc: "Practice agile sprint updates, blockers, and dependencies" },
  { id: "interview", label: "💼 Job Interview Prep", desc: "Practice behavioral and technical self-introductions" },
  { id: "casual", label: "☕ Office Banter", desc: "Friendly watercooler chats, hobbies, and polite small talk" },
];

export const EnglishPracticePage = () => {
  const [messages, setMessages] = useState([
    {
      role: "aaravi",
      text: "Namaste! I am Aaravi, your AI English practice companion. You can ask me any question or speak about any topic—from tech and career goals to your daily routine. How can I help you practice today?",
      grammarTip: "Speaking at a steady, relaxed pace helps your clarity and confidence shine.",
      vocabularyUpgrade: "Instead of 'I want to say', try 'I would like to share'.",
      confidenceScore: 92,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [scenario, setScenario] = useState("general");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const recognitionRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Auto-scroll transcript drawer
  useEffect(() => {
    if (showTranscript) {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showTranscript]);

  // Speech Recognition setup (English - India)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = "en-IN";

      recognizer.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveTranscript(currentTranscript);
        setInputText(currentTranscript);
      };

      recognizer.onerror = () => {
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }
  }, []);

  // Indian Female Voice Speech Synthesis
  const speakWithIndianAccent = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean text of markdown, tables, and bracketed notes for speech
    const cleanForSpeech = text
      .replace(/\|[\s\S]*?\|/g, "")
      .replace(/[#*_`~]/g, "")
      .replace(/\{[\s\S]*?\}/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanForSpeech);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.15; // Warm, gentle female pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
      voices.find(
        (v) =>
          (v.lang === "en-IN" || v.lang === "en_IN") &&
          (v.name.toLowerCase().includes("neerja") ||
            v.name.toLowerCase().includes("heera") ||
            v.name.toLowerCase().includes("priya") ||
            v.name.toLowerCase().includes("raveena") ||
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("india")),
      ) ||
      voices.find((v) => v.lang === "en-IN" || v.lang === "en_IN") ||
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          !v.name.includes("David") &&
          !v.name.includes("Male"),
      );

    if (indianVoice) utterance.voice = indianVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Microphone
  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (inputText.trim()) {
        handleSendMessage(inputText);
      }
    } else {
      setLiveTranscript("");
      setInputText("");
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        // already active
      }
    }
  };

  // Send message to Aaravi
  const handleSendMessage = async (textToSend) => {
    const userText = (textToSend || inputText).trim();
    if (!userText || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setInputText("");
    setLiveTranscript("");

    const updatedMessages = [...messages, { role: "user", text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role === "aaravi" ? "assistant" : "user",
        content: m.text,
      }));

      const { data } = await api.post("/english-practice/chat", {
        message: userText,
        scenario,
        conversationHistory,
      });

      const responseData = data?.data;
      const aaraviReply =
        responseData?.reply ||
        "I understand you clearly! Please continue sharing your thoughts.";

      setMessages((prev) => [
        ...prev,
        {
          role: "aaravi",
          text: aaraviReply,
          grammarTip: responseData?.grammarTip,
          vocabularyUpgrade: responseData?.vocabularyUpgrade,
          confidenceScore: responseData?.confidenceScore || 85,
        },
      ]);

      speakWithIndianAccent(aaraviReply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "aaravi",
          text: "I am listening closely, but my connection momentarily dropped. Please ask me again, I'm right here with you!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const latestAaravi = [...messages].reverse().find((m) => m.role === "aaravi");

  // Determine current active state for the Orb animation
  const orbState = isSpeaking
    ? "speaking"
    : isListening
    ? "listening"
    : loading
    ? "thinking"
    : "idle";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI English Fluency Agent • Indian Female Voice (en-IN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Agent Aaravi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Real Voice AI
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Converse freely about any topic. Aaravi responds dynamically to whatever you say and provides real-time grammar coaching.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showTranscript
                ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30"
                : "bg-[#141d33] text-slate-300 border-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Transcript ({messages.length})</span>
          </button>

          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setMessages([
                {
                  role: "aaravi",
                  text: "Namaste! What fresh topic shall we explore together?",
                },
              ]);
            }}
            className="p-2.5 rounded-xl bg-[#141d33] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setScenario(sc.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
              scenario === sc.id
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/50 shadow-md shadow-purple-900/30"
                : "bg-[#101728] border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODERN AI AGENT VOICE ORB STAGE                                           */}
      {/* ========================================================================= */}
      <div className="relative bg-gradient-to-b from-[#0e1424] via-[#0b0f19] to-[#0a0e17] border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between min-h-[580px] overflow-hidden">
        {/* Ambient Cosmic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Status Badge */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-medium text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              orbState === "speaking"
                ? "bg-pink-400 animate-ping"
                : orbState === "listening"
                ? "bg-emerald-400 animate-ping"
                : orbState === "thinking"
                ? "bg-amber-400 animate-spin"
                : "bg-purple-400"
            }`}
          />
          <span>
            {orbState === "speaking"
              ? "Aaravi Speaking (Indian Voice Output)..."
              : orbState === "listening"
              ? "Listening to your voice..."
              : orbState === "thinking"
              ? "Formulating dynamic response..."
              : "Ready • Speak or type any query"}
          </span>
        </div>

        {/* Central Glowing AI Voice Orb Animation */}
        <div className="relative my-auto flex items-center justify-center py-8">
          {/* Outer Pulsing Soundwave Rings (When Speaking or Listening) */}
          {(orbState === "speaking" || orbState === "listening") && (
            <>
              <div
                className={`absolute w-72 h-72 rounded-full border border-purple-500/30 ${
                  orbState === "speaking"
                    ? "animate-orb-wave-1 bg-pink-500/10"
                    : "animate-orb-wave-1 bg-emerald-500/10 border-emerald-500/30"
                }`}
              />
              <div
                className={`absolute w-88 h-88 rounded-full border border-pink-500/20 ${
                  orbState === "speaking"
                    ? "animate-orb-wave-2 bg-purple-500/10"
                    : "animate-orb-wave-2 bg-teal-500/10 border-teal-500/20"
                }`}
              />
            </>
          )}

          {/* Celestial Orbital Rings */}
          <div className="absolute w-64 h-64 rounded-full border border-purple-500/20 border-dashed animate-spin-slow pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full border border-indigo-400/20 pointer-events-none" />

          {/* The Core Fluid Morphing Sphere */}
          <div
            className={`relative z-10 w-44 h-44 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl ${
              orbState === "speaking"
                ? "bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-500 shadow-pink-500/50 scale-105"
                : orbState === "listening"
                ? "bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 shadow-emerald-500/50 scale-105"
                : orbState === "thinking"
                ? "bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-600 shadow-purple-500/50 scale-95"
                : "bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600 shadow-purple-600/40 animate-orb-breathe"
            }`}
          >
            {/* Inner Glass Core with Sound Wave Bars */}
            <div className="w-36 h-36 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 flex items-center justify-center gap-1.5 shadow-inner">
              {orbState === "speaking" ? (
                // Oscillating audio frequency bars
                <div className="flex items-center gap-1.5 h-12">
                  <div className="w-1.5 bg-pink-400 rounded-full animate-equalizer-bar" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 bg-purple-400 rounded-full animate-equalizer-bar" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 bg-indigo-300 rounded-full animate-equalizer-bar" style={{ animationDelay: "300ms" }} />
                  <div className="w-1.5 bg-pink-300 rounded-full animate-equalizer-bar" style={{ animationDelay: "450ms" }} />
                  <div className="w-1.5 bg-purple-400 rounded-full animate-equalizer-bar" style={{ animationDelay: "200ms" }} />
                </div>
              ) : orbState === "listening" ? (
                // Emerald mic wave bars
                <div className="flex items-center gap-1.5 h-12">
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-equalizer-bar" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 bg-teal-400 rounded-full animate-equalizer-bar" style={{ animationDelay: "200ms" }} />
                  <div className="w-1.5 bg-emerald-300 rounded-full animate-equalizer-bar" style={{ animationDelay: "400ms" }} />
                </div>
              ) : orbState === "thinking" ? (
                <div className="w-8 h-8 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Live Dynamic Subtitles & Coaching Display */}
        <div className="relative z-10 w-full max-w-2xl space-y-3">
          {/* Spoken Text Bubble */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center justify-between">
              <span>{isListening ? "You (Speaking)" : "Aaravi's Response"}</span>
              {latestAaravi?.confidenceScore && (
                <span className="text-emerald-400 font-semibold">
                  Fluency Confidence: {latestAaravi.confidenceScore}%
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed min-h-[44px]">
              {isListening
                ? liveTranscript || "Listening... speak freely into your microphone!"
                : latestAaravi?.text || "Hello! Ask me any question or discuss anything on your mind."}
            </p>
          </div>

          {/* Coaching Badges (Grammar & Vocabulary) */}
          {(latestAaravi?.grammarTip || latestAaravi?.vocabularyUpgrade) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestAaravi.grammarTip && (
                <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 text-left">
                  <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-xs mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Grammar Insight</span>
                  </div>
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    {latestAaravi.grammarTip}
                  </p>
                </div>
              )}

              {latestAaravi.vocabularyUpgrade && (
                <div className="bg-pink-950/30 border border-pink-500/30 rounded-xl p-3 text-left">
                  <div className="flex items-center gap-1.5 text-pink-300 font-semibold text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>Vocabulary Upgrade</span>
                  </div>
                  <p className="text-xs text-pink-200/90 leading-relaxed">
                    {latestAaravi.vocabularyUpgrade}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tactile Voice & Text Input Dock */}
        <div className="relative z-10 w-full max-w-2xl mt-6 pt-4 border-t border-slate-900/90 flex flex-col gap-3">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            {/* Push-to-Talk Mic Toggle */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-3.5 rounded-2xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 animate-pulse"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
              }`}
              title={isListening ? "Stop Listening & Send" : "Click to Speak via Microphone"}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Custom Query Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type any custom statement or question..."
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm disabled:opacity-40 transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>

            {/* Voice Audio Speaker Toggle */}
            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) window.speechSynthesis?.cancel();
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`p-3.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                voiceEnabled
                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  : "bg-amber-950/40 text-amber-400 border-amber-500/30"
              }`}
              title={voiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Audio Replay */}
            <button
              type="button"
              onClick={() => {
                if (latestAaravi?.text) speakWithIndianAccent(latestAaravi.text);
              }}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer shrink-0"
              title="Replay Voice Audio"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TRANSCRIPT SLIDE-OVER DRAWER (HISTORY)                                     */}
      {/* ========================================================================= */}
      {showTranscript && (
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-pink-400" />
              <h3 className="text-base font-bold text-white">Full Conversation History</h3>
            </div>
            <button
              onClick={() => setShowTranscript(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "aaravi" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 space-y-2 ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                      : "bg-[#161f36] border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md"
                  }`}
                >
                  <div className="text-xs sm:text-sm leading-relaxed">{m.text}</div>

                  {m.role === "aaravi" && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => speakWithIndianAccent(m.text)}
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors font-medium cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Voice</span>
                      </button>
                    </div>
                  )}

                  {m.grammarTip && (
                    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-2.5 text-xs text-purple-200">
                      <div className="font-semibold text-purple-300 flex items-center gap-1 mb-0.5">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>Grammar Note</span>
                      </div>
                      <p>{m.grammarTip}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};
