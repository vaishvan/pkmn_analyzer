

# Pokémon Analyzer | Best Pokémon Team Strategy & Battle Optimizer

![Pokémon Analyzer](https://github.com/user-attachments/assets/0f93d073-7cc7-4339-89a6-1202d7de5c4b)  
*A smart Pokémon battle analysis tool to optimize your strategy and team composition!*

## About Pokémon Analyzer
Pokémon Analyzer is an advanced **Pokémon battle strategy tool** that helps players analyze their team and their opponent's lineup. By evaluating **type matchups, team synergy, strengths, and weaknesses**, this web app offers expert recommendations for an **optimal battle strategy** in competitive or casual gameplay.

## Installation & Setup
### How to Install Pokémon Analyzer
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/pokemon-analyzer.git
   cd pokemon-analyzer
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your API keys:
   ```env
   VITE_GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```
   - If you're using a different model, change API_ENDPOINT in aiService.js accordingly
5. **Run the development server:**
   ```sh
   npm run dev
   ```

## Screenshots
![Image](https://github.com/user-attachments/assets/edd7d64a-bdee-4a72-93ab-aed726bc4567)
![Image](https://github.com/user-attachments/assets/8150a19d-0386-485a-a69a-c5941117142c)
![Image](https://github.com/user-attachments/assets/3c4385cf-2fe4-4b42-97d6-2db40afe754a)
![Image](https://github.com/user-attachments/assets/b4aac7d4-fd2b-4cec-b788-c1baaaf5e022)

## Known issues
- The banner image does not align properly once the analysis is complete - primarily due to the fact that I've used margin attribute in CSS in absolute pixels instead of it being relative. \
- The colors of each Pokemon Type is not being displayed correctly, but rather all are displayed as white as of now.\
- Since this is a vanity project, I want it to run side by side with a local LLM, and as such, I'm trying to learn how to integrate it with Ollama

## 📬 Contact & Support
For inquiries, collaborations, or support, contact me:
📧 Email: vaishnav314195@gmail.com

---
*Gotta strategize 'em all!* 🎮🔥
