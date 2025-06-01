# Deployment Guide for Pokemon Analyzer

## Overview
This guide covers deploying both the frontend (GitHub Pages) and backend (Render) components of the Pokemon Analyzer application.

## Backend Deployment (Render)

### Prerequisites
1. GitHub repository with the backend code
2. Render account (free tier available)
3. Google Gemini API key

### Step 1: Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `pkmn-analyzer-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### Step 2: Set Environment Variables
In the Render dashboard, add these environment variables:
```
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=production
FRONTEND_URL=https://your-username.github.io
```

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Note your service URL (e.g., `https://pkmn-analyzer-backend.onrender.com`)

## Frontend Deployment (GitHub Pages)

### Prerequisites
1. Backend deployed and running on Render
2. GitHub repository with Actions enabled

### Step 1: Update Configuration
1. Update `deploy.yml` with your backend URL:
```yaml
env:
  VITE_BACKEND_URL: https://your-backend-url.onrender.com
```

2. Update `src/components/services/aiService.js` with the same URL

### Step 2: Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages"
3. Source: "GitHub Actions"

### Step 3: Deploy
1. Push changes to the `deploy` branch
2. The GitHub Action will automatically build and deploy
3. Your site will be available at `https://your-username.github.io/pkmn_analyzer`

## Configuration Files

### Backend: `render.yaml`
```yaml
services:
  - type: web
    name: pkmn-analyzer-backend
    runtime: node
    plan: free
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://your-username.github.io
      - key: GOOGLE_GEMINI_API_KEY
        sync: false
```

### Frontend: GitHub Actions Workflow
```yaml
name: DEPLOY PKMN_ANALYZER
on:
  push:
    branches: [deploy]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
        env:
          VITE_BACKEND_URL: https://your-backend-url.onrender.com
      - uses: peaceiris/actions-gh-pages@v3
```

## API Rate Limiting

The backend implements strict rate limiting:
- **10 requests per IP address per 24 hours**
- Rate limit headers included in responses
- Cached responses don't count against limits
- Clear error messages when limits are exceeded

## Testing the Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "service": "Pokemon Analyzer Backend",
  "version": "1.0.0"
}
```

### Frontend Test
1. Visit your GitHub Pages URL
2. Add Pokemon to both teams
3. Click "Analyze Teams"
4. Verify the analysis appears

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly in Render
   - Check the allowed origins in `backend/middleware/cors.js`

2. **Rate Limit Issues**
   - Each IP gets 10 requests per day
   - Use different devices/networks for testing
   - Check rate limit headers in network tab

3. **Build Failures**
   - Verify all environment variables are set
   - Check GitHub Actions logs for specific errors
   - Ensure `package.json` scripts are correct

4. **API Connection Issues**
   - Verify backend URL in frontend configuration
   - Check that Render service is running
   - Test backend health endpoint directly

### Monitoring

- **Backend**: Monitor via Render dashboard
- **Frontend**: Check GitHub Pages deployment status
- **Rate Limits**: Use `/api/cache-stats` endpoint

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rate limiting protects against abuse
- CORS restricts unauthorized access
- Security headers prevent common attacks
