import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export class GeminiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
    
    // Debug logging
    console.log('GeminiService constructor - API Key check:');
    console.log('- Current directory:', __dirname);
    console.log('- .env path:', path.join(__dirname, '..', '.env'));
    console.log('- API Key present:', !!this.apiKey);
    console.log('- API Key length:', this.apiKey?.length || 0);
    console.log('- API Key starts with AIza:', this.apiKey?.startsWith('AIza'));
    
    if (!this.apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY environment variable is required');
    }
  }

  async generateAnalysis(yourTeamData, opponentTeamData) {
    try {
      // Validate input data
      if (!yourTeamData || !opponentTeamData) {
        throw new Error('Both team data parameters are required');
      }

      // Filter out null/undefined pokemon
      const filteredYourTeam = yourTeamData.filter(pokemon => pokemon && pokemon.name);
      const filteredOpponentTeam = opponentTeamData.filter(pokemon => pokemon && pokemon.name);

      if (filteredYourTeam.length === 0 || filteredOpponentTeam.length === 0) {
        throw new Error('Both teams must have at least one Pokemon');
      }

      // Construct the prompt
      const prompt = `As a Pokémon battle expert, analyze these two teams, your response should be based on previous pokemon showdown data,
        and should account for the best level ranges. Remove all sorts of bold stuff and italics and headings. There should only be bullet points.
        Your response should also include the optimal strategy on when to switch pokemon, which moves to choose based on the level ranges
        and previous pokemon showdown data, what the best strategy for each pokemon is, everything that a user might need should be given:
          My team: ${filteredYourTeam.map(p => p?.name || '').join(', ')}
          My team types: ${filteredYourTeam.map(p => p?.types?.join('/')).join(', ')}
          My team abilities: ${filteredYourTeam.map(p => p?.abilities?.join('/')).join(', ')}
          
          Opponent's team: ${filteredOpponentTeam.map(p => p?.name || '').join(', ')}
          Opponent's team types: ${filteredOpponentTeam.map(p => p?.types?.join('/')).join(', ')}
          Opponent's team abilities: ${filteredOpponentTeam.map(p => p?.abilities?.join('/')).join(', ')}`;

      const requestBody = {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }]
      };

      console.log('Making request to Gemini API...');
      
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysisText) {
        throw new Error('No analysis text received from Gemini API');
      }

      console.log('Successfully generated analysis');
      return analysisText;

    } catch (error) {
      console.error('Gemini Service Error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
        requestData: {
          yourTeamCount: filteredYourTeam.length,
          opponentTeamCount: filteredOpponentTeam.length
        }
      });

      // Provide more specific error messages
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing API key configuration');
      }
      
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      if (error.message.includes('rate')) {
        throw new Error('API rate limit exceeded. Please try again in a moment.');
      }

      // Generic fallback
      throw new Error(`Analysis service error: ${error.message}`);
    }
  }
}

export default new GeminiService();
