import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = ({ userId, role, sessionId }) => {
  return jwt.sign(
    {
      userId,
      role,
      sessionId,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    },
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
