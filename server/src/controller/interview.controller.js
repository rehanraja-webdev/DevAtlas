import {
  analyzeResumeData,
  getInterviewHistoryService,
  getInterviewSessionService,
  interactInInterviewRound,
  startInterviewSession,
  submitInterviewAnswer,
} from "../services/interview.service.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const structuredResume = await analyzeResumeData(req.user.userId, resumeText);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed and structured successfully",
      data: { resume: structuredResume },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const startInterview = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const session = await startInterviewSession(req.user.userId, resumeText);

    return res.status(201).json({
      success: true,
      message: "AI Interview session started",
      data: { session },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    const session = await submitInterviewAnswer(req.user.userId, sessionId, answer);

    return res.status(200).json({
      success: true,
      message: "Answer submitted and evaluated",
      data: { session },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const interactInRound = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const result = await interactInInterviewRound(req.user.userId, sessionId, message);

    return res.status(200).json({
      success: true,
      message: "Interviewer responded",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await getInterviewSessionService(req.user.userId, req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { session },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getInterviewHistoryService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: { history },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
