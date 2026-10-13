import { chatWithAaravi } from "../services/englishPractice.service.js";

export const talkToAaravi = async (req, res) => {
  try {
    const { message, scenario } = req.body;
    const response = await chatWithAaravi(req.user.userId, message, scenario);

    return res.status(200).json({
      success: true,
      message: "Aaravi responded successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
