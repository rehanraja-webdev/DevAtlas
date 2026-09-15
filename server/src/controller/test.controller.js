import { getHelloMessage } from "../services/test.service";

export const hello = (req, res) => {
  const message = getHelloMessage();

  res.status(200).json({
    success: true,
    message,
  });
};
