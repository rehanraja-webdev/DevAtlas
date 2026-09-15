import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", authRoutes);

app.use("/api/v1/test", testRoutes);
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevAtlas API is healthy",
  });
});

export default app;
