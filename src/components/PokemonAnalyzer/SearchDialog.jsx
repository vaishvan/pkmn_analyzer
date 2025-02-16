// src/components/PokemonAnalyzer/SearchDialog.jsx
import React from 'react';
import styles from './styles.module.css';

export const SearchDialog = ({ 
  open, 
  onClose, 
  pokemonList, 
  onSelect, 
  searchValue, 
  onSearchChange 
}) => {
  if (!open) return null;

  const filteredPokemon = pokemonList.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchDialog} onClick={e => e.stopPropagation()}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search Pokémon..."
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          autoFocus
        />
        <div className={styles.searchResults}>
          {filteredPokemon.length === 0 ? (
            <div className={styles.searchItem}>No Pokémon found.</div>
          ) : (
            filteredPokemon.map(pokemon => (
              <div
                key={pokemon.name}
                className={styles.searchItem}
                onClick={() => onSelect(pokemon.name)}
              >
                {pokemon.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};