// src/services/pokemonAPI.js
export const fetchPokemonList = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    if (!response.ok) throw new Error('Failed to fetch Pokemon list');
    const data = await response.json();
    return data.results;
  };
  
  export const fetchPokemonData = async (pokemonName) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) throw new Error(`Failed to fetch data for ${pokemonName}`);
    const data = await response.json();
    
    return {
      name: data.name,
      types: data.types.map(type => type.type.name),
      sprites: data.sprites,
      stats: data.stats,
      abilities: data.abilities.map(ability => ability.ability.name)
    };
  };
  
