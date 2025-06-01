import rateLimit from 'express-rate-limit';

// Rate limiting configuration - different for development vs production
const isDevelopment = process.env.NODE_ENV === 'development';

export const globalRateLimit = rateLimit({
  windowMs: isDevelopment ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000, // 15 min in dev, 24 hours in prod
  max: isDevelopment ? 1000 : 10, // 1000 requests in dev, 10 in prod
  message: {
    error: {
      message: isDevelopment 
        ? 'Too many requests from this IP. Please wait a moment before trying again.'
        : 'Too many requests from this IP. You have exceeded the daily limit of 10 requests. Please try again tomorrow.',
      status: 429,
      retryAfter: isDevelopment ? '15 minutes' : '24 hours'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip} (${isDevelopment ? 'DEV' : 'PROD'} mode)`);
    res.status(429).json({
      error: {
        message: isDevelopment 
          ? 'Too many requests from this IP. Please wait a moment before trying again.'
          : 'Too many requests from this IP. You have exceeded the daily limit of 10 requests. Please try again tomorrow.',
        status: 429,
        retryAfter: isDevelopment ? '15 minutes' : '24 hours',
        limit: isDevelopment ? 1000 : 10,
        window: isDevelopment ? '15 minutes' : '24 hours'
      }
    });
  }
});

// Analysis-specific rate limiting (stricter)
export const analysisRateLimit = rateLimit({
  windowMs: isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 min in dev, 1 hour in prod
  max: isDevelopment ? 100 : 5, // 100 requests in dev, 5 in prod
  message: {
    error: {
      message: isDevelopment 
        ? 'Too many analysis requests. Please wait a moment before requesting another analysis.'
        : 'Too many analysis requests. Please wait before requesting another analysis.',
      status: 429,
      retryAfter: isDevelopment ? '5 minutes' : '1 hour'
    }
  }
});
