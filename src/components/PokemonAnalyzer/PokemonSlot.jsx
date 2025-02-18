import React from 'react';
import { Search } from 'lucide-react';
import styles from './styles.module.css';

export const PokemonSlot = ({ pokemon, onClick, index }) => (
  <div 
    className={styles.pokemonSlot}
    onClick={onClick}
  >
    {pokemon ? (
      <>
        <img 
          src={pokemon.sprites.front_default} 
          alt={pokemon.name} 
          className={styles.pokemonSprite}
        />
        <div>
          <div className={styles.pokemonName}>{pokemon.name}</div>
          <div className={styles.pokemonTypes}>
            {pokemon.types.join(' / ')}
          </div>
        </div>
      </>
    ) : (
      <div className={styles.emptySlot}>
        <Search className={styles.searchIcon} />
        <span>Select Pokémon {index + 1}</span>
      </div>
    )}
  </div>
);
