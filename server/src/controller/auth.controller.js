import {
  loginUser,
  logout,
  logoutAll,
  me,
  refToken,
  registerUser,
} from "../services/auth.service.js";

const Register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User Registered!",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password, req);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    await logout(req.cookies.refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout Successful!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to logout!",
    });
  }
};

const LogoutAll = async (req, res) => {
  try {
    await logoutAll(req.user.userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to logout all",
    });
  }
};

const Protected = async (req, res) => {
  const user = await me(req.user);

  return res.status(200).json({
    success: true,
    message: "User data fetched!",
    data: { user },
  });
};

const refresh = async (req, res) => {
  try {
    const tokens = await refToken(req.cookies.refreshToken, res);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 160 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to refresh session",
    });
  }
};

export default { Register, Login, Logout, LogoutAll, Protected, refresh };
