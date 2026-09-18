import { loginUser, me, registerUser } from "../services/auth.service.js";

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

    res.status(200).json({
      success: true,
      message: "Login Successful!",
      data: {
        user: result.user,
        accessToken: result.accessToken,
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

export default { Register, Login, Protected };
