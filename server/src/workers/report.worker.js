import { Worker } from "bullmq";

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const reportWorker = new Worker(
  "developer-report",
  async (job) => {
    console.log(`Processing job ${job.id} for user ${job.data.userId}`);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(`Report generated for user ${job.data.userId}`);

    return {
      success: true,
    };
  },
  {
    connection,
  },
);

reportWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

reportWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

console.log("Report worker started");
