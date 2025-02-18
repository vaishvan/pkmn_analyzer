import React from 'react';
import { POKEMON_TYPES } from '../constants/Pokemontypes';
import styles from './styles.module.css';

const TYPE_COLORS = {
  Normal: "#A8A878",
  Fire: "#F08030",
  Water: "#6890F0",
  Electric: "#F8D030",
  Grass: "#78C850",
  Ice: "#98D8D8",
  Fighting: "#C03028",
  Poison: "#A040A0",
  Ground: "#E0C068",
  Flying: "#A890F0",
  Psychic: "#F85888",
  Bug: "#A8B820",
  Rock: "#B8A038",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC"
};

const darkenColor = (hex, percent) => {
  let [h, s, l] = hexToHSL(hex);
  l = Math.max(l - percent * 20, 30);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const hexToHSL = (hex) => {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }
  return [h, Math.round(s * 100), Math.round(l * 100)];
};

export const TypeHeatmap = ({ types, title }) => (
  <div className={styles.typeHeatmap}>
    <h4 className={styles.heatmapTitle}>{title}</h4>
    <div className={styles.typeGrid}>
      {POKEMON_TYPES.map(type => {
        const count = types[type] || 0;
        const baseColor = TYPE_COLORS[type] || "#ccc";
        const darkenFactor = Math.min(count * 0.1, 0.3);
        const darkenedColor = darkenColor(baseColor, darkenFactor);

        return (
          <div
            key={type}
            className={styles.typeCell}
            style={{
              backgroundColor: darkenedColor,
              color: darkenFactor > 0.2 ? "white" : "black"
            }}
          >
            {type}<br/>({count})
          </div>
        );
      })}
    </div>
  </div>
);
