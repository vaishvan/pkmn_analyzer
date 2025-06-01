import { GeminiService } from './services/geminiService.js';

console.log('=== Testing GeminiService ===');
try {
    const geminiService = new GeminiService();
    console.log('✅ GeminiService created successfully!');
    console.log('API Key loaded:', !!geminiService.apiKey);
} catch (error) {
    console.log('❌ Error creating GeminiService:');
    console.log(error.message);
}
