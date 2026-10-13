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
  Award,
  MessageSquare,
  Coffee,
  Briefcase,
  Users,
  Compass,
} from "lucide-react";

const SCENARIOS = [
  { id: "general", label: "🌟 Free Conversation", desc: "Casual practice to build daily confidence and flow" },
  { id: "standup", label: "🎙️ Daily Standup", desc: "Practice sprint updates, tasks completed, and blockers" },
  { id: "interview", label: "💼 Job Interview", desc: "Practice self-introductions, project explanations, and strengths" },
  { id: "casual", label: "☕ Office Banter", desc: "Friendly watercooler chats, hobbies, and polite small talk" },
];

export const EnglishPracticePage = () => {
  const [messages, setMessages] = useState([
    {
      role: "aaravi",
      text: "Namaste and warm greetings! I am Aaravi, your AI English practice companion. I'm here to converse with you in a gentle, supportive, and polite space. You can speak with me using your microphone or type your thoughts. What would you like to chat about today?",
      grammarTip: "Speaking naturally and with calm pauses is the secret to confident communication.",
      vocabularyUpgrade: "Instead of saying 'I want to say', try 'I would like to share'.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [scenario, setScenario] = useState("general");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = "en-IN"; // English (India) speech recognition

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);

      recognitionRef.current = recognizer;
    }
  }, []);

  // Indian Female Voice Speech Synthesis
  const speakWithIndianAccent = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.1; // Gentle, polite female pitch

    const voices = window.speechSynthesis.getVoices();
    // Prioritize Indian English female voices
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
      voices.find((v) => v.lang.startsWith("en") && !v.name.includes("David"));

    if (indianVoice) utterance.voice = indianVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const { data } = await api.post("/english-practice/chat", {
        message: userText,
        scenario,
      });

      const responseData = data?.data;
      const aaraviReply = responseData?.reply || "I understand you clearly. Please continue sharing!";

      setMessages((prev) => [
        ...prev,
        {
          role: "aaravi",
          text: aaraviReply,
          grammarTip: responseData?.grammarTip,
          vocabularyUpgrade: responseData?.vocabularyUpgrade,
          confidenceScore: responseData?.confidenceScore,
        },
      ]);

      speakWithIndianAccent(aaraviReply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "aaravi",
          text: "I am listening closely, but had a momentary connection slip. Please try saying that once again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        role: "aaravi",
        text: `Namaste! We are now practicing in the "${SCENARIOS.find((s) => s.id === scenario)?.label}" mode. Please feel free to begin whenever you are ready.`,
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Agent Branding Header */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Aaravi Avatar with Glowing Halo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 p-0.5 shadow-xl shadow-purple-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#101728] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Aaravi
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Indian Female Voice
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Your polite, friendly AI companion for fluent professional English communication.
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              voiceEnabled
                ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                : "bg-slate-800 text-slate-500 border-slate-700"
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{voiceEnabled ? "Voice Enabled" : "Voice Muted"}</span>
          </button>
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-[#141d33] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => {
              setScenario(sc.id);
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              scenario === sc.id
                ? "bg-[#141e38] border-purple-500/50 shadow-md shadow-purple-950/30"
                : "bg-[#101728] border-slate-800/80 hover:border-slate-700 text-slate-400"
            }`}
          >
            <p className="text-xs font-bold text-white">{sc.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{sc.desc}</p>
          </button>
        ))}
      </div>

      {/* Main Conversation Window */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col h-[540px]">
        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-[#141d33] border border-slate-800 text-slate-200"
                }`}
              >
                {msg.role === "aaravi" && (
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Aaravi (Coach)</span>
                    </span>
                    <button
                      onClick={() => speakWithIndianAccent(msg.text)}
                      className="text-slate-400 hover:text-purple-300 transition-colors"
                      title="Listen with Indian accent"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Aaravi's Politeness & Grammar Breakdown */}
                {msg.role === "aaravi" && (msg.grammarTip || msg.vocabularyUpgrade) && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
                    {msg.grammarTip && (
                      <div className="flex items-start gap-1.5 text-emerald-300 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{msg.grammarTip}</span>
                      </div>
                    )}
                    {msg.vocabularyUpgrade && (
                      <div className="flex items-start gap-1.5 text-purple-300 bg-purple-950/20 p-2 rounded-lg border border-purple-500/20">
                        <Award className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{msg.vocabularyUpgrade}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="bg-[#141d33] border border-slate-800 text-slate-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>Aaravi is preparing a polite response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Real-time Voice & Text Input */}
        <form
          onSubmit={handleSendMessage}
          className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                : "bg-[#141d33] text-purple-400 border-slate-800 hover:bg-slate-800 hover:text-purple-300"
            }`}
            title={isListening ? "Listening... Click to stop" : "Click to speak in English"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? "Listening to your voice... Speak clearly in English..."
                : "Speak via microphone or type in English here..."
            }
            className="flex-1 bg-[#141d33] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
