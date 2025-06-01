export const generateAIAnalysis = async (yourTeamData, opponentTeamData) => {
    console.log('Using backend API for analysis');
      // Determine backend URL based on environment
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                       import.meta.env.PROD ? 
                       'https://pkmn-analyzer-backend.onrender.com' : 
                       'http://localhost:3001';
    
    const API_ENDPOINT = `${BACKEND_URL}/api/analyze`;

    try {        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                yourTeam: yourTeamData,
                opponentTeam: opponentTeamData
            })
        });

        const data = await response.json();

        // Extract rate limit information from headers
        const rateLimitInfo = {
            limit: response.headers.get('X-RateLimit-Limit'),
            remaining: response.headers.get('X-RateLimit-Remaining'),
            reset: response.headers.get('X-RateLimit-Reset')
        };

        if (!response.ok) {
            // Handle rate limiting specifically
            if (response.status === 429) {
                const error = new Error(data.error?.message || 'Rate limit exceeded. Please try again later.');
                error.rateLimitInfo = rateLimitInfo;
                error.retryAfter = data.error?.retryAfter;
                throw error;
            }
            
            throw new Error(data.error?.message || 'Failed to get analysis from backend');
        }

        // Return both analysis and rate limit info
        return {
            analysis: data.data?.analysis || 'No analysis received',
            rateLimitInfo,
            cached: data.data?.cached || false
        };
        
    } catch (error) {
        console.error('Backend Analysis Error:', error);
        
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to analysis service. Please check your connection and try again.');
        }
        
        throw new Error(error.message || 'Failed to get AI analysis');
    }
};
