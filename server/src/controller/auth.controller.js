import {
  loginUser,
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
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await refToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
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

export default { Register, Login, Protected, refresh };
