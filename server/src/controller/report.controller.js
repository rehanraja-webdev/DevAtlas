import { createReportJob } from "../services/report.service.js";

export const requestReport = async (req, res) => {
  const job = await createReportJob(req.user.userId);

  return res.status(202).json({
    success: true,
    message: "Report generation started",
    data: {
      jobId: job.id,
    },
  });
};
