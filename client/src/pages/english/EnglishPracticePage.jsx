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
  Phone,
  PhoneOff,
  PhoneCall,
  Headphones,
  Radio,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const SCENARIOS = [
  { id: "general", label: "🌟 Free Conversation", desc: "Open-ended chat about any topic, question, or daily life" },
  { id: "standup", label: "🎙️ Daily Standup", desc: "Practice agile sprint updates, blockers, and dependencies" },
  { id: "interview", label: "💼 Job Interview Prep", desc: "Practice behavioral and technical self-introductions" },
  { id: "casual", label: "☕ Office Banter", desc: "Friendly watercooler chats, hobbies, and polite small talk" },
];

export const EnglishPracticePage = () => {
  // View mode: "call" (cellphone call simulation) or "chat" (transcript feed)
  const [activeMode, setActiveMode] = useState("call");
  
  const [messages, setMessages] = useState([
    {
      role: "aaravi",
      text: "Namaste! I am Aaravi, your AI English conversation companion. You can talk to me about anything—your day, code, interview worries, or any custom question you have. How are you feeling today?",
      grammarTip: "Speaking at a steady, relaxed pace helps your clarity and confidence shine.",
      vocabularyUpgrade: "Instead of 'I feel good', try 'I feel energetic and focused'.",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [scenario, setScenario] = useState("general");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Cell phone call state
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const callTimerRef = useRef(null);

  // Call duration ticker
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive]);

  // Format call duration MM:SS
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Auto-scroll in chat mode
  useEffect(() => {
    if (activeMode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeMode]);

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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.15; // Gentle, empathetic female pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    // Locate Indian English female voice
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
      voices.find((v) => v.lang.startsWith("en") && !v.name.includes("David") && !v.name.includes("Male"));

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
    } else {
      setLiveTranscript("");
      setInputText("");
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        // already started
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
    
    // Add user message to history
    const updatedMessages = [...messages, { role: "user", text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Send message along with entire conversation history so Aaravi has full context
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
      const aaraviReply = responseData?.reply || "I hear you clearly! Please go ahead and share more.";

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

      if (isCallActive) {
        speakWithIndianAccent(aaraviReply);
      }
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

  const handleEndCall = () => {
    setIsCallActive(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setActiveMode("chat");
  };

  const handleRestartCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setActiveMode("call");
    const welcome = `Namaste! I'm back on the call with you. What custom topic or question shall we explore now?`;
    speakWithIndianAccent(welcome);
  };

  const latestAaraviMessage = [...messages].reverse().find((m) => m.role === "aaravi");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header & Mode Switcher */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI English Speaking Coach • Indian Female Accent (en-IN)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Conversational Agent Aaravi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Live Phone Call Ready
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Communicate naturally with Aaravi about any topic. Ask custom questions, practice daily scenarios, and receive instant grammar & vocabulary feedback.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#0b0f19] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMode("call")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === "call"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Cell Phone Call</span>
          </button>
          <button
            onClick={() => setActiveMode("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === "chat"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Transcript Feed ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setScenario(sc.id)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              scenario === sc.id
                ? "bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40 text-white"
                : "bg-[#101728]/70 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="text-sm font-semibold text-white mb-0.5">{sc.label}</div>
            <div className="text-xs text-slate-400 line-clamp-1">{sc.desc}</div>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: CELL PHONE CALL INTERFACE                                         */}
      {/* ========================================================================= */}
      {activeMode === "call" && (
        <div className="relative mx-auto max-w-md w-full bg-[#0a0e17] rounded-[2.5rem] border-4 border-slate-800 p-6 shadow-2xl shadow-purple-950/30 flex flex-col items-center justify-between min-h-[620px] overflow-hidden">
          {/* Smartphone Speaker Ear Piece & Status Header */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-6 px-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>5G • HD Voice</span>
            </div>
            <div className="w-20 h-1.5 rounded-full bg-slate-800" />
            <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatCallTime(callDuration)}</span>
            </div>
          </div>

          {/* Caller Profile & Animated Voice Ring */}
          <div className="flex flex-col items-center text-center space-y-4 my-auto">
            <div className="relative flex items-center justify-center">
              {/* Voice Waves when Aaravi is speaking */}
              {isSpeaking && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-pink-500/20 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full bg-purple-500/30 animate-pulse" />
                </>
              )}
              {/* Mic pulse when user is speaking */}
              {isListening && (
                <div className="absolute w-40 h-40 rounded-full bg-emerald-500/25 animate-ping" />
              )}

              {/* Avatar circle */}
              <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-1 shadow-2xl shadow-purple-500/40 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0d121f] flex flex-col items-center justify-center">
                  <Bot className="w-12 h-12 text-pink-400" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Aaravi</h2>
              <p className="text-xs text-pink-400 font-medium mt-0.5">
                {isSpeaking ? "Speaking in Indian English..." : isListening ? "Listening to your voice..." : "On Call • Connected"}
              </p>
            </div>

            {/* Live Subtitle Card */}
            <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 text-left shadow-lg">
              <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center justify-between mb-1.5">
                <span>{isListening ? "Your Speech" : "Aaravi Speaking"}</span>
                {isSpeaking && <span className="text-pink-400 animate-pulse">● Audio Active</span>}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[50px]">
                {isListening
                  ? liveTranscript || "Listening... speak into your microphone!"
                  : latestAaraviMessage?.text || "Hello! Feel free to talk to me about anything."}
              </p>
            </div>

            {/* Live Coaching Toast (Grammar & Vocabulary) */}
            {latestAaraviMessage?.grammarTip && (
              <div className="w-full max-w-sm bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 text-left">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px] mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Gentle Grammar Tip</span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-tight">
                  {latestAaraviMessage.grammarTip}
                </p>
              </div>
            )}
          </div>

          {/* Quick Custom Query Input within Cell Phone */}
          <form onSubmit={handleFormSubmit} className="w-full mt-4 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type any custom query..."
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Phone Call Tactile Action Buttons */}
          <div className="w-full grid grid-cols-4 gap-3 pt-5 border-t border-slate-900 mt-4">
            {/* 1. Mute/Unmute Mic (Push to Talk / Voice Call) */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                isListening
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 animate-pulse"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="text-[10px] font-medium">{isListening ? "Talking" : "Mic"}</span>
            </button>

            {/* 2. Speaker Audio Output Toggle */}
            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) {
                  window.speechSynthesis?.cancel();
                }
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                voiceEnabled
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                  : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-medium">{voiceEnabled ? "Speaker" : "Muted"}</span>
            </button>

            {/* 3. Replay Last Audio */}
            <button
              type="button"
              onClick={() => {
                if (latestAaraviMessage?.text) speakWithIndianAccent(latestAaraviMessage.text);
              }}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-[10px] font-medium">Replay</span>
            </button>

            {/* 4. End Call Button */}
            <button
              type="button"
              onClick={isCallActive ? handleEndCall : handleRestartCall}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                isCallActive
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
              }`}
            >
              {isCallActive ? <PhoneOff className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
              <span className="text-[10px] font-medium">{isCallActive ? "End" : "Call"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CHAT TRANSCRIPT FEED VIEW                                         */}
      {/* ========================================================================= */}
      {activeMode === "chat" && (
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
          {/* Transcript Control Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d121f]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-semibold text-white">Conversation Transcript with Aaravi</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {messages.length} messages
              </span>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: "aaravi",
                    text: "Namaste! What new topic shall we discuss today?",
                  },
                ]);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "aaravi" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4.5 space-y-3 ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-600/15"
                      : "bg-[#161f36] border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{m.text}</div>

                  {/* Audio Replay for Aaravi's Turn */}
                  {m.role === "aaravi" && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => speakWithIndianAccent(m.text)}
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Voice</span>
                      </button>
                    </div>
                  )}

                  {/* Grammar & Vocabulary Cards */}
                  {m.grammarTip && (
                    <div className="bg-purple-950/50 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 space-y-1">
                      <div className="font-semibold text-purple-300 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Grammar Guidance</span>
                      </div>
                      <p>{m.grammarTip}</p>
                    </div>
                  )}

                  {m.vocabularyUpgrade && (
                    <div className="bg-pink-950/40 border border-pink-500/30 rounded-xl p-3 text-xs text-pink-200 space-y-1">
                      <div className="font-semibold text-pink-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>Vocabulary Upgrade</span>
                      </div>
                      <p>{m.vocabularyUpgrade}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="p-4 bg-[#0d121f] border-t border-slate-800 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? "bg-emerald-600 text-white animate-pulse shadow-lg shadow-emerald-600/30"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
              title="Speak via microphone"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Aaravi any custom question or respond..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm disabled:opacity-50 transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
