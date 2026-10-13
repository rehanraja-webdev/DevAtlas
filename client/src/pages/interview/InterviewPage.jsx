import { useState, useEffect, useRef } from "react";
import api from "../../api/client.js";
import { ResumeVisualizer } from "../../components/interview/ResumeVisualizer.jsx";
import {
  UserCheck,
  Sparkles,
  Play,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  Bot,
  FileText,
  Clock,
  Briefcase,
  MessageSquare,
} from "lucide-react";

export const InterviewPage = () => {
  // Mode: "setup" | "interview" | "scorecard"
  const [viewMode, setViewMode] = useState("setup");
  const [resumeText, setResumeText] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingResume, setAnalyzingResume] = useState(false);

  // Active Session State
  const [session, setSession] = useState(null);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [discussingWithInterviewer, setDiscussingWithInterviewer] = useState(false);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Fetch initial resume from profile
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const { data } = await api.post("/interview/analyze-resume", {
          resumeText: "",
        });
        setResumeData(data?.data?.resume);
      } catch (err) {
        console.error("Failed to load resume", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // Initialize Speech Recognition for candidate answer
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = "en-US";

      recognizer.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) =>
          prev ? `${prev} ${transcript}` : transcript,
        );
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

  // Text to Speech for Interviewer Question
  const speakQuestion = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick good natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith("en") && !v.name.includes("whisper"),
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
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

  const handleAnalyzeResume = async () => {
    try {
      setAnalyzingResume(true);
      const { data } = await api.post("/interview/analyze-resume", {
        resumeText,
      });
      setResumeData(data?.data?.resume);
    } catch (err) {
      console.error("Failed to analyze resume", err);
    } finally {
      setAnalyzingResume(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/interview/start", {
        resumeText: resumeData?.rawText || "",
      });
      const activeSession = data?.data?.session;
      setSession(activeSession);
      setViewMode("interview");
      setCandidateAnswer("");

      // Automatically speak the first question
      const firstQ = activeSession?.rounds?.[0]?.question;
      if (firstQ) {
        speakQuestion(firstQ);
      }
    } catch (err) {
      console.error("Failed to start interview", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || submittingAnswer) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      setSubmittingAnswer(true);
      const { data } = await api.post("/interview/answer", {
        sessionId: session._id,
        answer: candidateAnswer,
      });

      const updatedSession = data?.data?.session;
      setSession(updatedSession);
      setCandidateAnswer("");

      if (updatedSession.status === "completed") {
        setViewMode("scorecard");
      } else {
        const nextQ =
          updatedSession.rounds[updatedSession.currentRoundIndex]?.question;
        if (nextQ) {
          speakQuestion(nextQ);
        }
      }
    } catch (err) {
      console.error("Failed to submit answer", err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleDiscussWithInterviewer = async () => {
    if (!candidateAnswer.trim() || discussingWithInterviewer) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      setDiscussingWithInterviewer(true);
      const { data } = await api.post("/interview/interact", {
        sessionId: session._id,
        message: candidateAnswer,
      });

      const updatedSession = data?.data?.session;
      const reply = data?.data?.reply;
      setSession(updatedSession);
      setCandidateAnswer("");

      if (reply) {
        speakQuestion(reply);
      }
    } catch (err) {
      console.error("Failed to interact with interviewer", err);
    } finally {
      setDiscussingWithInterviewer(false);
    }
  };

  const currentRound = session?.rounds?.[session?.currentRoundIndex];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>AI Real-World Technical Interviewer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Resume-Grounded AI Interview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visualizes your resume and conducts an in-depth engineering interview tailored directly to your projects and stack.
          </p>
        </div>

        {viewMode !== "setup" && (
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setViewMode("setup");
            }}
            className="px-4 py-2 rounded-xl bg-[#141d33] hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back to Resume</span>
          </button>
        )}
      </div>

      {/* VIEW 1: RESUME VISUALIZER & INTERVIEW SETUP */}
      {viewMode === "setup" && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Target Role: {resumeData?.targetRole || "Full Stack Developer"}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Visual Resume Ready for Technical Assessment
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                The AI interviewer will scrutinize your highlighted projects, architecture decisions, and skills during the 5-round simulation.
              </p>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Real AI Interview</span>
            </button>
          </div>

          {/* Interactive Visual Resume */}
          {loading ? (
            <div className="py-24 text-center text-xs text-slate-400">
              Generating visual resume...
            </div>
          ) : (
            <div className="space-y-6">
              <ResumeVisualizer resume={resumeData} />

              {/* Optional: Paste custom resume text */}
              <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 max-w-4xl mx-auto">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Want to use a custom or pasted resume?
                </h3>
                <textarea
                  rows="4"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste raw resume text, education, projects, or achievements here..."
                  className="w-full bg-[#141d33] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={analyzingResume || !resumeText.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {analyzingResume ? "Analyzing..." : "Update Visual Resume"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LIVE AI INTERVIEW ROOM */}
      {viewMode === "interview" && currentRound && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Interviewer Status Bar */}
          <div className="bg-[#101728] border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Lead Technical Interviewer (AI)
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-indigo-300 mt-0.5">
                  Assessing: {session?.targetRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300 bg-[#141d33] px-3 py-1.5 rounded-xl border border-slate-800">
                Round {currentRound.questionNumber} of {session?.rounds?.length}
              </span>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl border transition-colors ${
                  voiceEnabled
                    ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
                title={voiceEnabled ? "Voice Output Active" : "Voice Output Muted"}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Question Prompt Card */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                {currentRound.category?.replace(/-/g, " ")}
              </span>
              <button
                onClick={() => speakQuestion(currentRound.question)}
                className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{currentRound.question}"
            </p>
          </div>

          {/* Live Interactive Round Discussion Feed */}
          {currentRound.conversation && currentRound.conversation.length > 1 && (
            <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Live Round Discussion
              </span>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {currentRound.conversation.slice(1).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === "candidate"
                        ? "bg-purple-950/40 border border-purple-500/30 text-purple-200 ml-6"
                        : "bg-[#141d33] border border-indigo-500/30 text-slate-200 mr-6"
                    }`}
                  >
                    <div className="font-semibold text-[10px] text-slate-400 uppercase mb-1">
                      {msg.role === "candidate" ? "You (Candidate)" : "Interviewer"}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Response Section */}
          <form
            onSubmit={handleSubmitAnswer}
            className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Technical Response
              </span>
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30"
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Listening (Mic Active)...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Speak Answer (Voice-to-Text)</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows="5"
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak using your microphone or articulate your answer here with architecture details, decisions, and trade-offs..."
              className="w-full bg-[#141d33] border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                {candidateAnswer.length} characters entered
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDiscussWithInterviewer}
                  disabled={discussingWithInterviewer || !candidateAnswer.trim()}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
                  title="Ask a clarifying question or discuss approach before finalizing"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {discussingWithInterviewer ? "Interviewer replying..." : "Discuss / Ask Question"}
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={submittingAnswer || !candidateAnswer.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingAnswer ? (
                    <span>Evaluating answer...</span>
                  ) : (
                    <>
                      <span>Finalize & Next Round</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Previous Questions Transcript History */}
          {session.currentRoundIndex > 0 && (
            <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Interview Progress So Far
              </h3>
              <div className="space-y-3">
                {session.rounds
                  .slice(0, session.currentRoundIndex)
                  .map((r, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#141d33] border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">
                          Q{r.questionNumber}: {r.category}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          Score: {r.score}/100
                        </span>
                      </div>
                      <p className="text-slate-400 italic">"{r.candidateAnswer}"</p>
                      <p className="text-indigo-300 text-[11px] font-medium">
                        Critique: {r.feedback}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: COMPREHENSIVE SCORECARD */}
      {viewMode === "scorecard" && session?.scorecard && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Verdict Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-[#131b31] to-[#12192c] border border-indigo-500/40 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
                Evaluation Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Hiring Verdict: {session.scorecard.recommendation}
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                {session.scorecard.feedbackSummary}
              </p>
            </div>

            <div className="bg-[#141d33] border border-slate-800 rounded-2xl p-6 text-center shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Overall Score
              </span>
              <span className="text-4xl font-black text-indigo-300 mt-1 block">
                {session.scorecard.overallScore}/100
              </span>
            </div>
          </div>

          {/* Breakdown Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#101728] border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Technical Depth
              </span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {session.scorecard.technicalScore}/100
              </span>
            </div>
            <div className="bg-[#101728] border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                Communication Clarity
              </span>
              <span className="text-2xl font-bold text-purple-300 mt-1 block">
                {session.scorecard.communicationScore}/100
              </span>
            </div>
            <div className="bg-[#101728] border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Problem Solving
              </span>
              <span className="text-2xl font-bold text-emerald-300 mt-1 block">
                {session.scorecard.problemSolvingScore}/100
              </span>
            </div>
          </div>

          {/* Strengths and Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#101728] border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {session.scorecard.strengths?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#101728] border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Priority Preparation Areas</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {session.scorecard.improvements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Question-by-Question Transcript & Critiques
            </h3>
            <div className="space-y-4">
              {session.rounds.map((round) => (
                <div
                  key={round.questionNumber}
                  className="p-5 rounded-xl bg-[#141d33] border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Q{round.questionNumber}: {round.question}
                    </span>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {round.score}/100
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0f172a] text-xs text-slate-300">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Your Response:
                    </span>
                    {round.candidateAnswer}
                  </div>
                  <p className="text-xs text-indigo-300">
                    <span className="font-bold">Interviewer Critique:</span> {round.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setViewMode("setup")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
