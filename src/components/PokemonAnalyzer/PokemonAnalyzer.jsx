import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { PokemonSlot } from './PokemonSlot';
import { TypeHeatmap } from './TypeHeatmap';
import { SearchDialog } from './SearchDialog';
import { fetchPokemonList, fetchPokemonData } from '../services/pokemonAPI';
import { generateAIAnalysis } from '../services/aiService';
import { calculateTypeAnalysis } from '../utils/typeAnalysis';
import styles from './styles.module.css';
import banner from "../assets/banner.png";

const PokemonAnalyzer = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentEditingSlot, setCurrentEditingSlot] = useState({ team: null, index: null });
  const [teamData, setTeamData] = useState({
    yourTeam: Array(6).fill(null),
    opponentTeam: Array(6).fill(null)
  });
  const [analysis, setAnalysis] = useState('');
  const [typeAnalysis, setTypeAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  useEffect(() => {
    fetchPokemonList().then(setPokemonList).catch(error => setError(error.message));
  }, []);

  const handlePokemonSelect = async (pokemonName) => {
    try {
      const pokemonData = await fetchPokemonData(pokemonName);
      const newTeamData = { ...teamData };
      
      if (currentEditingSlot.team === 'your') {
        newTeamData.yourTeam[currentEditingSlot.index] = pokemonData;
      } else {
        newTeamData.opponentTeam[currentEditingSlot.index] = pokemonData;
      }
      
      setTeamData(newTeamData);
      setShowSearchDialog(false);
      setSearchValue('');
    } catch (error) {
      setError(error.message);
    }
  };

  const analyzePokemonTeams = async () => {
    const filledYourTeam = teamData.yourTeam.filter(Boolean);
    const filledOpponentTeam = teamData.opponentTeam.filter(Boolean);
    
    if (filledYourTeam.length === 0 || filledOpponentTeam.length === 0) {
      setError('Please enter at least one Pokémon for each team.');
      return;
    }

    setIsLoading(true);
    setError('');    try {
      const [aiResult, yourTypes, opponentTypes] = await Promise.all([
        generateAIAnalysis(teamData.yourTeam, teamData.opponentTeam),
        calculateTypeAnalysis(filledYourTeam),
        calculateTypeAnalysis(filledOpponentTeam)
      ]);

      // Handle enhanced API response
      if (typeof aiResult === 'object') {
        setAnalysis(aiResult.analysis);
        setRateLimitInfo(aiResult.rateLimitInfo);
        
        // Show cache indicator if response was cached
        if (aiResult.cached) {
          console.log('Analysis retrieved from cache');
        }
      } else {
        // Fallback for simple string response
        setAnalysis(aiResult);
      }
      
      setTypeAnalysis({ yourTypes, opponentTypes });
    } catch (error) {
      // Handle rate limiting errors with specific UI feedback
      if (error.rateLimitInfo) {
        setRateLimitInfo(error.rateLimitInfo);
        setError(`${error.message} ${error.retryAfter ? `Try again ${error.retryAfter}.` : ''}`);
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bannerContainer}>
      <img src={banner} className={styles.bannerImage} />
      </div>

    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <span>Pokémon Team Analyzer</span>
          <button
            className={`${styles.button} ${styles.outlineButton} ${styles.iconButton}`}
            onClick={() => setTeamData({
              yourTeam: Array(6).fill(null),
              opponentTeam: Array(6).fill(null)
            })}
          >
            Clear List
          </button>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.subtitle}>Your Team</h3>
            <div className={styles.teamGrid}>
              {teamData.yourTeam.map((pokemon, index) => (
                <PokemonSlot
                  key={`your-${index}`}
                  pokemon={pokemon}
                  index={index}
                  onClick={() => {
                    setCurrentEditingSlot({ team: 'your', index });
                    setShowSearchDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={styles.subtitle}>Opponent's Team</h3>
            <div className={styles.teamGrid}>
              {teamData.opponentTeam.map((pokemon, index) => (
                <PokemonSlot
                  key={`opponent-${index}`}
                  pokemon={pokemon}
                  index={index}
                  onClick={() => {
                    setCurrentEditingSlot({ team: 'opponent', index });
                    setShowSearchDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actionContainer}>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={analyzePokemonTeams}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className={styles.spinningIcon} />
                Analyzing...
              </>
            ) : (
              'Analyze Teams'
            )}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {rateLimitInfo && (
          <div className={styles.rateLimitInfo}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
              API Usage: {rateLimitInfo.limit - rateLimitInfo.remaining}/{rateLimitInfo.limit} requests used
            </div>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((rateLimitInfo.limit - rateLimitInfo.remaining) / rateLimitInfo.limit) * 100}%`,
                height: '100%',
                backgroundColor: rateLimitInfo.remaining < 3 ? '#ef4444' : '#10b981',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {typeAnalysis && (
          <div className={styles.analysisSection}>
            <TypeHeatmap types={typeAnalysis.yourTypes} title="Your Team Type Coverage" />
            <TypeHeatmap types={typeAnalysis.opponentTypes} title="Opponent's Team Type Coverage" />
          </div>
        )}

        {analysis && (
          <div className={styles.analysisSection}>
            <h3 className={styles.analysisTitle}>Analysis</h3>
            <pre className={styles.analysisContent}>{analysis}</pre>
          </div>
        )}

        <SearchDialog
          open={showSearchDialog}
          onClose={() => setShowSearchDialog(false)}
          pokemonList={pokemonList}
          onSelect={handlePokemonSelect}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>
    </div>
    </div>
  );
};

export default PokemonAnalyzer;