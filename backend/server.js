import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.js';
import { corsOptions } from './middleware/cors.js';
import { globalRateLimit } from './middleware/rateLimit.js';

// Load environment variables first
dotenv.config();

// Debug environment loading
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- API Key present:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('- API Key length:', process.env.GOOGLE_GEMINI_API_KEY?.length || 0);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors(corsOptions));

// Rate limiting middleware
app.use(globalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Only log in production or if specifically enabled
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_REQUEST_LOGGING === 'true') {
      console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
    }
  });
  
  next();
});

// Health check endpoint with enhanced information
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Pokemon Analyzer Backend',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };
  
  res.status(200).json(healthInfo);
});

// API routes
app.use('/api', analysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

// Additional production optimizations
if (process.env.NODE_ENV === 'production') {
  // Trust proxy for accurate IP addresses behind load balancers
  app.set('trust proxy', 1);
  
  // Disable x-powered-by header for security
  app.disable('x-powered-by');
}

const server = app.listen(PORT, () => {
  console.log(`Pokemon Analyzer Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/analyze`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default app;
