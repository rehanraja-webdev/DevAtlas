import { reportQueue } from "../queues/report.queue.js";

export const createReportJob = async (userId) => {
  const job = await reportQueue.add(
    "generate-report",
    { userId },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  );
  return job;
};
