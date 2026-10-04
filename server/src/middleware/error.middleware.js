export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.name === ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(409).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    errors: err.errors || [],
  });
};
