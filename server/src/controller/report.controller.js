import {
  chatWithMentorService,
  createReportJob,
  getAiGuidanceService,
  getLatestReportService,
  getReportHistoryService,
} from "../services/report.service.js";

export const requestReport = async (req, res) => {
  try {
    const jobResult = await createReportJob(req.user.userId);

    return res.status(202).json({
      success: true,
      message: jobResult.mode === "direct" ? "Report generated successfully" : "Report generation started",
      data: jobResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLatestReport = async (req, res) => {
  try {
    const report = await getLatestReportService(req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Latest report retrieved",
      data: { report },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReportHistory = async (req, res) => {
  try {
    const history = await getReportHistoryService(req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Report history retrieved",
      data: { history },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAiGuidance = async (req, res) => {
  try {
    const guidance = await getAiGuidanceService(req.user.userId);
    return res.status(200).json({
      success: true,
      message: "AI Guidance retrieved",
      data: { guidance },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const askAiMentor = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chatWithMentorService(req.user.userId, message);
    return res.status(200).json({
      success: true,
      message: "Mentor response generated",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
