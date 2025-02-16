  // src/utils/typeAnalysis.js

  import { POKEMON_TYPES } from "../constants/Pokemontypes";
  
  export const calculateTypeAnalysis = (teamData) => {
    const typeCounts = {};
    POKEMON_TYPES.forEach(type => typeCounts[type] = 0);
  
    teamData.forEach(pokemon => {
      if (pokemon?.types) {
        pokemon.types.forEach(type => {
          typeCounts[type]++;
        });
      }
    });
  
    return typeCounts;
  };