# Pokemon Analyzer Backend

A secure backend service for the Pokemon Analyzer application that handles AI analysis requests with rate limiting.

## Features

- 🔒 Rate limiting (10 requests per IP per day)
- 🛡️ Security middleware (Helmet, CORS)
- 🤖 Google Gemini AI integration
- 📊 Request logging and monitoring
- 🚀 Optimized for Render deployment

## Setup

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**
   - `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: Your frontend URL for CORS

4. **Start development server**
   ```bash
   npm run dev
   ```

### Production Deployment (Render)

1. **Connect your GitHub repository to Render**

2. **Set Environment Variables in Render Dashboard:**
   - `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: Your frontend URL (e.g., https://vaishvan.github.io)
   - `NODE_ENV`: production

3. **Deploy settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`

## API Endpoints

### POST /api/analyze
Analyzes Pokemon teams using AI.

**Request Body:**
```json
{
  "yourTeam": [
    {
      "name": "pikachu",
      "types": ["electric"],
      "abilities": ["static"]
    }
  ],
  "opponentTeam": [
    {
      "name": "charizard", 
      "types": ["fire", "flying"],
      "abilities": ["blaze"]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "• Pikachu has type advantage...",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

### GET /health
Health check endpoint.

## Rate Limiting

- **Global**: 10 requests per IP per 24 hours
- **Analysis**: 5 requests per IP per hour
- Headers include rate limit information

## Security Features

- Helmet.js for security headers
- CORS configuration for frontend domains
- Input validation and sanitization
- Error handling without sensitive data exposure

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment | No (default: development) |
