import express from 'express';
import { GeminiService } from '../services/geminiService.js';
import { analysisRateLimit } from '../middleware/rateLimit.js';
import { analysisCache } from '../services/cacheService.js';

const router = express.Router();
const geminiService = new GeminiService();

// Apply specific rate limiting to analysis endpoint
router.use('/analyze', analysisRateLimit);

router.post('/analyze', async (req, res) => {
  try {
    const { yourTeam, opponentTeam } = req.body;

    // Validate request data
    if (!yourTeam || !opponentTeam) {
      return res.status(400).json({
        error: {
          message: 'Both yourTeam and opponentTeam are required',
          status: 400
        }
      });
    }

    if (!Array.isArray(yourTeam) || !Array.isArray(opponentTeam)) {
      return res.status(400).json({
        error: {
          message: 'Team data must be arrays',
          status: 400
        }
      });
    }

    // Check cache first
    const cacheKey = analysisCache.generateKey(yourTeam, opponentTeam);
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult) {
      console.log(`Cache hit for IP: ${req.ip}`);
      return res.json({
        success: true,
        data: {
          analysis: cachedResult,
          cached: true,
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`Processing analysis request from IP: ${req.ip}`);
    
    // Get analysis from Gemini
    const analysis = await geminiService.generateAnalysis(yourTeam, opponentTeam);
    
    // Cache the result
    analysisCache.set(cacheKey, analysis);

    res.json({
      success: true,
      data: {
        analysis,
        cached: false,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    
    // Handle specific Gemini API errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: {
          message: 'Service configuration error',
          status: 500
        }
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('rate')) {
      return res.status(503).json({
        error: {
          message: 'Service temporarily unavailable due to high demand. Please try again later.',
          status: 503
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to generate analysis',
        status: 500
      }
    });
  }
});

// Cache statistics endpoint (for monitoring)
router.get('/cache-stats', (req, res) => {
  const stats = analysisCache.getStats();
  res.json({
    success: true,
    data: {
      cache: stats,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
