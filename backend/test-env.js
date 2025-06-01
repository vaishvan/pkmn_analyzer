import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Environment Test ===');
console.log('Current working directory:', process.cwd());
console.log('API Key present:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('API Key value:', process.env.GOOGLE_GEMINI_API_KEY ? 
    process.env.GOOGLE_GEMINI_API_KEY.substring(0, 10) + '...' : 
    'NOT FOUND');
console.log('API Key length:', process.env.GOOGLE_GEMINI_API_KEY?.length || 0);

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.error('API key not found in environment variables!');
    console.log('Please check your .env file contains:');
    console.log('GOOGLE_GEMINI_API_KEY=your_actual_api_key_here');
} else if (process.env.GOOGLE_GEMINI_API_KEY === 'your_actual_api_key_here') {
    console.error('Please replace the placeholder with your real API key!');
} else {
    console.log('API key found and looks valid!');
}
