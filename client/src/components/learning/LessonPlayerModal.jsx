import { useState, useEffect } from "react";
import api from "../../api/client.js";
import {
  X,
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Lock,
  Clock,
  Award,
  AlertCircle,
  RotateCcw,
  Send,
  Terminal,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const LessonPlayerModal = ({
  topicKey,
  milestoneTitle,
  isOpen,
  onClose,
  onMasteryAchieved,
}) => {
  const [activeTab, setActiveTab] = useState("lesson"); // "lesson" | "quiz" | "exercise" | "history"
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Quiz submission state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Exercise code submission state
  const [exerciseCode, setExerciseCode] = useState("");
  const [exerciseSubmitting, setExerciseSubmitting] = useState(false);
  const [exerciseResult, setExerciseResult] = useState(null);

  useEffect(() => {
    if (!isOpen || !topicKey) return;

    const loadLessonData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setQuizResult(null);
        setExerciseResult(null);
        setQuizAnswers({});

        const [lessonRes, quizRes, attemptsRes] = await Promise.allSettled([
          api.get(`/learning/lessons/${topicKey}`),
          api.get(`/learning/quizzes/${topicKey}`),
          api.get(`/learning/attempts?topicKey=${topicKey}`),
        ]);

        if (lessonRes.status === "fulfilled" && lessonRes.value.data?.data?.lesson) {
          const lData = lessonRes.value.data.data.lesson;
          setLesson(lData);
          if (lData.exerciseId) {
            setExercise(lData.exerciseId);
            setExerciseCode(lData.exerciseId.templateCode || "");
          }
        } else {
          setLesson(null);
        }

        if (quizRes.status === "fulfilled" && quizRes.value.data?.data?.quiz) {
          setQuiz(quizRes.value.data.data.quiz);
        } else {
          setQuiz(null);
        }

        if (attemptsRes.status === "fulfilled" && attemptsRes.value.data?.data?.attempts) {
          setAttempts(attemptsRes.value.data.data.attempts);
        }
      } catch (err) {
        console.error("Failed to fetch lesson content", err);
        setErrorMessage("Could not load lesson materials.");
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [isOpen, topicKey]);

  if (!isOpen) return null;

  const handleQuizOptionSelect = (questionId, option) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    try {
      setQuizSubmitting(true);
      setErrorMessage("");

      const { data } = await api.post(`/learning/quizzes/${quiz._id}/attempts`, {
        answers: quizAnswers,
        durationSec: 60,
      });

      const resData = data?.data;
      setQuizResult(resData);

      // Refresh attempts history
      const { data: attData } = await api.get(`/learning/attempts?topicKey=${topicKey}`);
      if (attData?.data?.attempts) {
        setAttempts(attData.data.attempts);
      }

      if (resData?.passed && onMasteryAchieved) {
        onMasteryAchieved(topicKey, resData.score);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to grade quiz.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleExerciseSubmit = async () => {
    if (!exercise) return;

    try {
      setExerciseSubmitting(true);
      setErrorMessage("");

      const { data } = await api.post(`/learning/exercises/${exercise._id}/submissions`, {
        code: exerciseCode,
        durationSec: 90,
      });

      setExerciseResult(data?.data);

      const { data: attData } = await api.get(`/learning/attempts?topicKey=${topicKey}`);
      if (attData?.data?.attempts) {
        setAttempts(attData.data.attempts);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to execute code tests.");
    } finally {
      setExerciseSubmitting(false);
    }
  };

  const bestScoreAttempt = attempts.find((a) => a.type === "quiz" && a.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#0d1322] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#101728] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Verified Learning Hub
                </span>
                {bestScoreAttempt && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Mastered ({bestScoreAttempt.score}%)</span>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 truncate max-w-md sm:max-w-xl">
                {milestoneTitle || lesson?.title || topicKey}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#0e1628] border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("lesson")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "lesson"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Lesson</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mastery Quiz (Gate)</span>
              {quiz && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200">
                  {quiz.passingScore}% pass
                </span>
              )}
            </button>

            {exercise && (
              <button
                onClick={() => setActiveTab("exercise")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "exercise"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Challenge</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Audit History ({attempts.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Anti-Cheat Server Graded</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading verified lesson & quiz...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: INTERACTIVE LESSON */}
              {activeTab === "lesson" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Video Embed if available */}
                  {lesson?.videoURL && (
                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video shadow-xl">
                      <iframe
                        src={lesson.videoURL}
                        title={lesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Learning Objectives */}
                  {lesson?.learningObjectives?.length > 0 && (
                    <div className="p-5 rounded-2xl bg-[#101728] border border-indigo-500/30 space-y-2.5">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Measurable Learning Objectives</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {lesson.learningObjectives.map((obj, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Misconceptions Callout */}
                  {lesson?.misconceptions?.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>Common Developer Misconceptions & Gotchas</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {lesson.misconceptions.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 rounded-xl bg-[#0e1628] border border-amber-500/20 text-xs space-y-1"
                          >
                            <p className="font-semibold text-rose-300">
                              ✕ Misconception: "{m.misconception}"
                            </p>
                            <p className="text-slate-300">→ Reality: {m.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formatted Text Content */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#101728] border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
                      {lesson?.title || milestoneTitle}
                    </h3>
                    <div className="prose prose-invert prose-indigo max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                      {lesson?.content || "No lesson content available yet for this milestone."}
                    </div>
                  </div>

                  {/* CTA to Take Quiz Gate */}
                  <div className="p-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white">Finished reviewing the concepts?</h4>
                      <p className="text-xs text-slate-300">
                        Take the 4-question mastery quiz (≥80% required) to unlock the next milestone.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("quiz")}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Take Mastery Quiz</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: MASTERY QUIZ GATE */}
              {activeTab === "quiz" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {!quiz ? (
                    <div className="p-8 text-center bg-[#101728] border border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No quiz found for this milestone.
                    </div>
                  ) : (
                    <>
                      {/* Quiz Header Banner */}
                      <div className="p-5 rounded-2xl bg-[#101728] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            Assessment Gate
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1">{quiz.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Minimum {quiz.passingScore}% score required to master and unblock downstream topics.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#141d33] px-3.5 py-2 rounded-xl border border-slate-800 shrink-0 text-xs">
                          <Award className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold text-white">{quiz.questions.length} Questions</span>
                        </div>
                      </div>

                      {/* Result Banner if already evaluated */}
                      {quizResult && (
                        <div
                          className={`p-6 rounded-2xl border ${
                            quizResult.passed
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                          } space-y-3`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {quizResult.passed ? (
                                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                              ) : (
                                <XCircle className="w-7 h-7 text-rose-400" />
                              )}
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {quizResult.passed ? "Mastery Verified!" : "Passing Score Not Reached"}
                                </h4>
                                <p className="text-xs text-slate-300">
                                  Your Score: <strong>{quizResult.score}%</strong> (Required: {quizResult.passingScore}%)
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-white">{quizResult.score}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 italic">{quizResult.feedback}</p>
                        </div>
                      )}

                      {/* Question Form */}
                      <form onSubmit={handleQuizSubmit} className="space-y-6">
                        {quiz.questions.map((q, idx) => {
                          const qKey = q._id || String(idx);
                          const selectedOption = quizAnswers[qKey];
                          const breakdownItem = quizResult?.breakdown?.find(
                            (b) => b.questionId === q._id || b.question === q.question,
                          );

                          return (
                            <div
                              key={qKey}
                              className={`p-5 rounded-2xl border transition-all ${
                                breakdownItem
                                  ? breakdownItem.isCorrect
                                    ? "bg-emerald-950/20 border-emerald-500/30"
                                    : "bg-rose-950/20 border-rose-500/30"
                                  : "bg-[#101728] border-slate-800"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="flex-1 space-y-3">
                                  <p className="text-xs sm:text-sm font-semibold text-white whitespace-pre-wrap leading-relaxed">
                                    {q.question}
                                  </p>

                                  <div className="space-y-2 pt-1">
                                    {q.options?.map((opt, oIdx) => {
                                      const isSelected = selectedOption === opt;
                                      const isCorrectOpt = breakdownItem && opt === breakdownItem.correctAnswer;
                                      const isWrongOpt = breakdownItem && isSelected && !breakdownItem.isCorrect;

                                      return (
                                        <button
                                          type="button"
                                          key={oIdx}
                                          disabled={quizSubmitting}
                                          onClick={() => handleQuizOptionSelect(qKey, opt)}
                                          className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                                            isCorrectOpt
                                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-semibold"
                                              : isWrongOpt
                                              ? "bg-rose-500/20 border-rose-500/50 text-rose-200 line-through"
                                              : isSelected
                                              ? "bg-indigo-600/20 border-indigo-500/60 text-white font-medium shadow-sm"
                                              : "bg-[#141d33] border-slate-800 text-slate-300 hover:bg-slate-800/60"
                                          }`}
                                        >
                                          <span>{opt}</span>
                                          {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                          {isWrongOpt && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation revealed after grading */}
                                  {breakdownItem && (
                                    <div className="mt-3 p-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-xs text-slate-300 space-y-1">
                                      <p className="font-bold text-indigo-400">Concept Explanation:</p>
                                      <p>{breakdownItem.explanation}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex items-center justify-between pt-2">
                          {quizResult && !quizResult.passed ? (
                            <button
                              type="button"
                              onClick={() => {
                                setQuizResult(null);
                                setQuizAnswers({});
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#141d33] hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Retry Quiz</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          <button
                            type="submit"
                            disabled={quizSubmitting || Object.keys(quizAnswers).length === 0}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {quizSubmitting ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Submit for Server-Side Grading</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: CODE CHALLENGE & TEST RUNNER */}
              {activeTab === "exercise" && exercise && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="p-5 rounded-2xl bg-[#101728] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        In-Browser Programming Challenge
                      </span>
                      <span className="text-xs uppercase font-mono text-slate-500">{exercise.language}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{exercise.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{exercise.description}</p>
                  </div>

                  {/* Code Editor */}
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-2xl">
                    <div className="px-4 py-2.5 bg-[#0e1424] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <span className="font-mono text-[11px]">solution.js</span>
                      </div>
                      <span className="text-[10px]">Node.js Sandboxed VM</span>
                    </div>

                    <textarea
                      rows={12}
                      value={exerciseCode}
                      onChange={(e) => setExerciseCode(e.target.value)}
                      className="w-full p-4 bg-transparent text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />

                    <div className="p-3 bg-[#0e1424] border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{exercise.tests?.length || 0} Test Cases Ready</span>
                      <button
                        onClick={handleExerciseSubmit}
                        disabled={exerciseSubmitting || !exerciseCode.trim()}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {exerciseSubmitting ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Run Tests & Submit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Test Results Output */}
                  {exerciseResult && (
                    <div className="p-5 rounded-2xl bg-[#101728] border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-white">Execution Test Suite Output</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            exerciseResult.passed
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {exerciseResult.passed ? "ALL TESTS PASSED" : "FAILED TESTS"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {exerciseResult.testResults?.map((t, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                              t.passed
                                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                            }`}
                          >
                            <div>
                              <p className="font-semibold">{t.description || `Test Case #${idx + 1}`}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Input: {t.input} | Expected: {t.expectedOutput} | Actual: {t.actualOutput}
                              </p>
                            </div>
                            <span className="font-bold shrink-0">{t.passed ? "PASS" : "FAIL"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: AUDIT ATTEMPT HISTORY */}
              {activeTab === "history" && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Assessment Attempt Records</h3>
                    <span className="text-[11px] text-slate-400">Stored on server for verification</span>
                  </div>

                  {attempts.length === 0 ? (
                    <div className="p-8 text-center bg-[#101728] border border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No attempts recorded yet for this topic.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {attempts.map((att) => (
                        <div
                          key={att._id}
                          className="p-4 rounded-xl bg-[#101728] border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            {att.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            )}
                            <div>
                              <p className="font-bold text-white capitalize">
                                {att.type} Assessment • Score: {att.score}%
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(att.createdAt).toLocaleString()} • Duration: {att.durationSec}s
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              att.passed
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {att.passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
