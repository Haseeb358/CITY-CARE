import rateLimit from "express-rate-limit";

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // default 15 min
  max = 5, // default 5 requests
  message = "Too many requests, please try again later",
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
      status: 429,
      message,
      success: false,
    },
  });
};