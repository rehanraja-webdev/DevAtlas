export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated profile request",
    user: req.user,
  });
};
