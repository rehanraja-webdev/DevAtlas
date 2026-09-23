import { getAllProblems } from "../services/dsa.service.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await getAllProblems();

    return res.status(200).json({
      success: true,
      message: "All problems fetched!",
      data: {
        problems,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
