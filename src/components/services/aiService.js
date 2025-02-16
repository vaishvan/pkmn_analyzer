export const generateAIAnalysis = async (yourTeamData, opponentTeamData) => {
  const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

  try {
      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              contents: [{
                  role: 'user',
                  parts: [{
                      text: `As a Pokémon battle expert, analyze these two teams, your response should be based on previous pokemon showdown data, and should account for the best level ranges. Your response should also include the optimal strategy on when to switch pokemon, and which pokemon to start with, everything should be given:
                          My team: ${yourTeamData.map(p => p?.name || '').filter(Boolean).join(', ')}
                          My team types: ${yourTeamData.map(p => p?.types.join('/')).filter(Boolean).join(', ')}
                          My team abilities: ${yourTeamData.map(p => p?.abilities.join('/')).filter(Boolean).join(', ')}
                          
                          Opponent's team: ${opponentTeamData.map(p => p?.name || '').filter(Boolean).join(', ')}
                          Opponent's team types: ${opponentTeamData.map(p => p?.types.join('/')).filter(Boolean).join(', ')}
                          Opponent's team abilities: ${opponentTeamData.map(p => p?.abilities.join('/')).filter(Boolean).join(', ')}`
                  }]
              }]
          })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
  } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error(`Failed to get AI analysis: ${error.message}`);
  }
};
