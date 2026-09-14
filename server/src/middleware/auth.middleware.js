import User from "../models/User.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error.message || "Error while authenticating user!");
  }
};

export default authMiddleware;
