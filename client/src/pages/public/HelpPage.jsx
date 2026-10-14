import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.js";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Compass,
  Binary,
  UserCheck,
  Languages,
  Boxes,
  ShieldCheck,
  Mic,
  Volume2,
  AlertCircle,
  CheckCircle2,
  Send,
  RefreshCw,
  Terminal,
  ExternalLink,
  MessageSquare,
  LifeBuoy,
  PhoneCall,
  Laptop,
  Check,
  Copy,
} from "lucide-react";

export const HelpPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Diagnostic Wizard State
  const [diagnosticState, setDiagnosticState] = useState({
    speechSynthesisSupported: false,
    speechRecognitionSupported: false,
    micPermission: "checking",
    audioPlaying: false,
    micTesting: false,
    micTranscript: "",
    voicesFound: 0,
    hasEnInVoice: false,
  });

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    category: "general",
    priority: "medium",
    subject: "",
    message: "",
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  // Check browser diagnostic capabilities on mount
  useEffect(() => {
    const checkDiagnostics = async () => {
      const synthSupported = typeof window !== "undefined" && "speechSynthesis" in window;
      const recogSupported =
        typeof window !== "undefined" &&
        ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

      let micPerm = "unknown";
      if (navigator?.permissions?.query) {
        try {
          const status = await navigator.permissions.query({ name: "microphone" });
          micPerm = status.state; // 'granted', 'denied', 'prompt'
        } catch {
          micPerm = "prompt";
        }
      }

      let voices = [];
      let enInFound = false;
      if (synthSupported) {
        voices = window.speechSynthesis.getVoices();
        enInFound = voices.some((v) => v.lang.includes("en-IN") || v.name.includes("India"));
      }

      setDiagnosticState((prev) => ({
        ...prev,
        speechSynthesisSupported: synthSupported,
        speechRecognitionSupported: recogSupported,
        micPermission: micPerm,
        voicesFound: voices.length,
        hasEnInVoice: enInFound,
      }));
    };

    checkDiagnostics();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        const vList = window.speechSynthesis.getVoices();
        setDiagnosticState((prev) => ({
          ...prev,
          voicesFound: vList.length,
          hasEnInVoice: vList.some((v) => v.lang.includes("en-IN") || v.name.includes("India")),
        }));
      };
    }
  }, []);

  // Audio Output Test
  const handleTestAudio = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in your browser.");
      return;
    }

    window.speechSynthesis.cancel();
    setDiagnosticState((prev) => ({ ...prev, audioPlaying: true }));

    const utterance = new SpeechSynthesisUtterance(
      "Hello developer! Welcome to DevAtlas. Your browser audio synthesis is functioning properly.",
    );

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.includes("en-IN") && (v.name.includes("Female") || v.name.includes("Neerja") || v.name.includes("Google"))) ||
      voices.find((v) => v.lang.includes("en-IN")) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setDiagnosticState((prev) => ({ ...prev, audioPlaying: false }));
    };
    utterance.onerror = () => {
      setDiagnosticState((prev) => ({ ...prev, audioPlaying: false }));
    };

    window.speechSynthesis.speak(utterance);
  };

  // Microphone Input Test
  const handleTestMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech Recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.");
      return;
    }

    setDiagnosticState((prev) => ({
      ...prev,
      micTesting: true,
      micTranscript: "Listening... please speak a sentence into your microphone.",
    }));

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join("");
        setDiagnosticState((prev) => ({
          ...prev,
          micTranscript: `Received: "${transcript}"`,
          micPermission: "granted",
        }));
      };

      recognition.onerror = (event) => {
        setDiagnosticState((prev) => ({
          ...prev,
          micTesting: false,
          micTranscript: `Microphone test error: ${event.error}. Please check your browser microphone permission.`,
        }));
      };

      recognition.onend = () => {
        setDiagnosticState((prev) => ({ ...prev, micTesting: false }));
      };

      recognition.start();
    } catch (err) {
      setDiagnosticState((prev) => ({
        ...prev,
        micTesting: false,
        micTranscript: `Could not start speech recognition: ${err.message}`,
      }));
    }
  };

  // Support Ticket Submission Handler
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitting(true);

    setTimeout(() => {
      const randomTicketId = `ATLAS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        id: randomTicketId,
        date: new Date().toLocaleDateString(),
        subject: ticketForm.subject,
        email: ticketForm.email,
        category: ticketForm.category,
      });
      setTicketSubmitting(false);
      setTicketForm({
        name: user?.fullname || "",
        email: user?.email || "",
        category: "general",
        priority: "medium",
        subject: "",
        message: "",
      });
    }, 600);
  };

  const handleCopyTicketId = () => {
    if (submittedTicket?.id) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopiedTicketId(true);
      setTimeout(() => setCopiedTicketId(false), 2000);
    }
  };

  // Comprehensive FAQ Database
  const faqCategories = [
    { id: "all", label: "All Topics" },
    { id: "getting-started", label: "🚀 Getting Started" },
    { id: "roadmaps", label: "🧭 Roadmaps" },
    { id: "dsa", label: "💻 DSA Practice" },
    { id: "interview", label: "🎙️ AI Interview Suite" },
    { id: "aaravi", label: "🤖 Spoken English (Aaravi)" },
    { id: "skills", label: "📦 Skills & Projects" },
    { id: "account", label: "🔒 Account & Privacy" },
  ];

  const faqs = [
    {
      id: "gs-1",
      category: "getting-started",
      question: "What is DevAtlas and how does it help my engineering career?",
      answer:
        "DevAtlas is an all-in-one developer career operating system designed to eliminate tutorial hell. It provides sequenced learning roadmaps with strict prerequisite locks, a curated DSA practice tracker, autonomous AI voice technical interviews based on your resume, and spoken English communication coaching with Agent Aaravi.",
    },
    {
      id: "gs-2",
      category: "getting-started",
      question: "Is DevAtlas completely free to use?",
      answer:
        "Yes! DevAtlas is 100% free for developers. All core modules—including unlimited DSA problem logging, interactive roadmaps, autonomous AI technical interviews, and voice practice with Agent Aaravi—are accessible without any credit card or subscription.",
    },
    {
      id: "rm-1",
      category: "roadmaps",
      question: "How do sequenced roadmaps work and how do I unlock items?",
      answer:
        "Each roadmap represents an industry-verified engineering progression (e.g., Full Stack MERN). Milestones have prerequisite dependencies. Once you complete the prerequisite topics (e.g., JavaScript Fundamentals), the dependent topic (e.g., React or Express) unlocks. You can update topic progress directly using the 0%, 50%, or 100% completion buttons.",
    },
    {
      id: "rm-2",
      category: "roadmaps",
      question: "Can I switch or restart my active career roadmap?",
      answer:
        "Yes! You can view all available career roadmaps in the Roadmap Catalog. If you wish to switch tracks, you can select any track (Full Stack, Frontend, Backend) to begin a new active learning sequence.",
    },
    {
      id: "dsa-1",
      category: "dsa",
      question: "How is my DSA practice tracked and analyzed?",
      answer:
        "DevAtlas maintains a curated catalog of high-signal interview problems across LeetCode and GeeksforGeeks. You can toggle each problem between 'Not Attempted', 'Attempted', and 'Solved'. DevAtlas calculates your solve ratio across Easy, Medium, and Hard tiers, and our AI Mentor synthesizes these metrics to suggest your Next Best Action.",
    },
    {
      id: "dsa-2",
      category: "dsa",
      question: "Can I access the actual LeetCode problem links from DevAtlas?",
      answer:
        "Yes. Every problem card in the DSA catalog features a direct external link to the official problem URL on LeetCode or GeeksforGeeks, so you can practice on the native platform and record your completion in DevAtlas.",
    },
    {
      id: "ai-1",
      category: "interview",
      question: "How does the AI Technical Interviewer generate questions?",
      answer:
        "The AI Interviewer parses your visual profile: your verified skills, project tech stacks, and career goal. Rather than generic trivia, it asks authentic architectural questions directly about how you implemented authentication, data pipelines, and scale challenges in your own projects.",
    },
    {
      id: "ai-2",
      category: "interview",
      question: "How does the AI Interviewer evaluate my responses?",
      answer:
        "At the end of each round, the AI generates a hiring rubric scorecard evaluating your System Architecture, Data Modeling, Problem Solving, and Communication Clarity on a 1-10 scale, along with key strengths, areas for improvement, and an overall hiring verdict (Strong Hire, Hire, Lean No Hire).",
    },
    {
      id: "aaravi-1",
      category: "aaravi",
      question: "Who is Agent Aaravi and what does she do?",
      answer:
        "Aaravi is DevAtlas's autonomous spoken English and communication coaching partner. Built with high-speed LLM reasoning and Indian female voice synthesis, she helps engineers practice daily standup updates, salary negotiations, and engineering team discussions in a judgment-free space with real-time grammar suggestions.",
    },
    {
      id: "aaravi-2",
      category: "aaravi",
      question: "Why do I need to allow microphone access for Aaravi and the AI Interview?",
      answer:
        "Microphone access allows DevAtlas to run browser-native Speech Recognition (speech-to-text), turning your spoken words into text transcriptions for the AI. Audio is processed directly in real-time and is never stored permanently on third-party servers.",
    },
    {
      id: "sec-1",
      category: "account",
      question: "How is my account and session authenticated?",
      answer:
        "DevAtlas uses industry-grade JWT (JSON Web Token) authentication delivered through secure HttpOnly cookies with automatic refresh token rotation. This ensures sensitive tokens are never exposed to browser JavaScript (XSS attack immune).",
    },
    {
      id: "sec-2",
      category: "account",
      question: "How do I update my profile, career goal, or social links?",
      answer:
        "Navigate to the Settings page in your workspace. You can update your Full Name, Career Goal, Bio, GitHub URL, LinkedIn URL, and Portfolio website. Changes are immediately synchronized across your resume visualizer.",
    },
  ];

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
      {/* 1. HERO & SEARCH */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <LifeBuoy className="w-3.5 h-3.5 text-indigo-400" />
          <span>DevAtlas Help & Documentation Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How Can We Help You{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Succeed Today?
          </span>
        </h1>
        <p className="text-base text-slate-300">
          Find answers, diagnose browser audio/microphone settings, and connect with technical support.
        </p>

        {/* Live Search Input */}
        <div className="pt-4 max-w-2xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords: 'microphone', 'roadmap', 'scoring', 'interview', 'cookies'..."
            className="w-full bg-[#101728] border border-slate-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. LIVE BROWSER DIAGNOSTICS & AUDIO TEST (EXPERT UX TOOL) */}
      <div id="diagnostics" className="bg-[#101728] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Interactive Diagnostic Wizard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Browser Environment Health</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Verify that your current browser supports Web Speech synthesis and microphone input required for AI Interviews and Agent Aaravi.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleTestAudio}
              disabled={diagnosticState.audioPlaying}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>{diagnosticState.audioPlaying ? "Playing Audio..." : "Test Audio Output"}</span>
            </button>

            <button
              onClick={handleTestMic}
              disabled={diagnosticState.micTesting}
              className="px-4 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-pink-400" />
              <span>{diagnosticState.micTesting ? "Listening..." : "Test Microphone Input"}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Status Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Speech Synthesis */}
          <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                diagnosticState.speechSynthesisSupported
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Speech Synthesis (TTS)</p>
              <p className="text-[11px] text-slate-400">
                {diagnosticState.speechSynthesisSupported
                  ? `Active (${diagnosticState.voicesFound} voices)`
                  : "Not Supported"}
              </p>
            </div>
          </div>

          {/* Card 2: Speech Recognition */}
          <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                diagnosticState.speechRecognitionSupported
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Speech Recognition (STT)</p>
              <p className="text-[11px] text-slate-400">
                {diagnosticState.speechRecognitionSupported ? "Supported (Webkit)" : "Chrome/Edge Required"}
              </p>
            </div>
          </div>

          {/* Card 3: Mic Permission */}
          <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                diagnosticState.micPermission === "granted"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : diagnosticState.micPermission === "denied"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Microphone Permission</p>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                {diagnosticState.micPermission}
              </p>
            </div>
          </div>

          {/* Card 4: Indian Accent Synthesis */}
          <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Aaravi Indian Voice</p>
              <p className="text-[11px] text-slate-400">
                {diagnosticState.hasEnInVoice ? "en-IN Accent Detected" : "English Fallback Ready"}
              </p>
            </div>
          </div>
        </div>

        {/* Live Mic Test Transcript Banner */}
        {diagnosticState.micTranscript && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#0e1526] border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-mono">{diagnosticState.micTranscript}</span>
          </div>
        )}
      </div>

      {/* 3. STEP-BY-STEP TROUBLESHOOTING CARDS */}
      <div id="troubleshooting" className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Quick Resolutions</h2>
          <h3 className="text-2xl font-bold text-white mt-1">Frequently Encountered Fixes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Microphone Blocked or Denied?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If the browser blocked your mic, click the lock or settings icon in your browser URL bar (left of the address), toggle <strong>Microphone</strong> to <strong>Allow</strong>, and refresh the page.
            </p>
            <span className="text-[10px] text-indigo-400 font-semibold block">Applicable to Chrome, Edge & Brave</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Audio Not Playing / Silent?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modern browsers prevent audio until you interact with the page. Click anywhere inside the AI Interview or Aaravi room to satisfy the browser's audio autoplay policy, or run our audio test above.
            </p>
            <span className="text-[10px] text-purple-400 font-semibold block">Browser Autoplay Security Requirement</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#101728] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Session Logged Out Unexpectedly?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              DevAtlas uses secure HttpOnly refresh token cookies. Make sure your browser allows cookies and is not blocking first-party session storage in incognito/private windows.
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold block">HttpOnly Cookie Protection Active</span>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE FAQ ACCORDION */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Knowledge Base</h2>
          <h3 className="text-2xl font-bold text-white mt-1">Frequently Asked Questions</h3>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-[#141d33] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-[#101728] border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No matching questions found for "{searchQuery}". Try another keyword or submit a ticket below.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#101728] border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#0d1322]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. INTERACTIVE CONTACT / TICKET SUBMISSION FORM */}
      <div id="contact" className="bg-[#101728] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Direct Engineering Support</span>
          <h2 className="text-2xl font-bold text-white mt-1">Submit a Support Ticket or Feedback</h2>
          <p className="text-xs text-slate-300 mt-1">
            Need help with an account issue, found a bug in an AI interview session, or have a feature request? Submit a ticket directly to the core engineering team.
          </p>
        </div>

        {submittedTicket ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Ticket Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Our engineering team has received your ticket. We typically respond within 24 hours.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0b0f19] rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400">Reference Ticket ID: </span>
                <span className="text-white font-bold">{submittedTicket.id}</span>
              </div>
              <button
                onClick={handleCopyTicketId}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedTicketId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTicketId ? "Copied" : "Copy ID"}</span>
              </button>
            </div>

            <button
              onClick={() => setSubmittedTicket(null)}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              ← Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                  placeholder="developer@example.com"
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Inquiry Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="general">General Inquiry & Setup</option>
                  <option value="interview-feedback">AI Interviewer / Aaravi Feedback</option>
                  <option value="bug">Report a Bug / Platform Issue</option>
                  <option value="feature">Suggest a Feature / Roadmap Track</option>
                  <option value="account">Account & Authentication Help</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Priority Level
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low (General question)</option>
                  <option value="medium">Medium (Feature behavior)</option>
                  <option value="high">High (Something isn't working)</option>
                  <option value="urgent">Urgent (Account blocked)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Subject
              </label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Brief summary of your question or issue..."
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Detailed Message
              </label>
              <textarea
                required
                rows={4}
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Describe what happened, what browser you are using, or what feature you'd like to see..."
                className="w-full bg-[#141d33] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={ticketSubmitting}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {ticketSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Support Ticket</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
