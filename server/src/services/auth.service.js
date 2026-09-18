import Session from "../models/Session.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

import crypto from "crypto";
import {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

export const registerUser = async ({ fullname, email, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All fields are required!");
  }

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });

  await Profile.create({ user: user._id });

  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (email, password, req) => {
  if (!email || !password) {
    throw new Error("All fields are required!");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const metadata = {
    ipAddress: req.ip,
    userAgent: req.get("User-Agent"),
  };
  const session = await createSession(user, metadata);

  return {
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
    ...session,
  };
};

export const me = async (decoded) => {
  const user = await User.findById(decoded._id);
  return { user };
};

export const createSession = async (user, metadata) => {
  const refreshToken = generateRefreshToken();

  const tokenHash = hashToken(refreshToken);

  const familyId = crypto.randomUUID();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    user: user._id,
    tokenHash,
    familyId,
    expiresAt,
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  const sessionId = session._id.toString();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    sessionId,
  });

  return {
    accessToken,
    refreshToken,
    session,
  };
};

export const refToken = async (refreshToken) => {
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required!",
    });
  }

  const tokenHash = hashToken(refreshToken);

  const session = await Session.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).populate("user");

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  const accessToken = generateAccessToken({
    userId: session.user._id.toString(),
    role: session.user.role,
    sessionId: session._id.toString(),
  });

  return accessToken;
};
