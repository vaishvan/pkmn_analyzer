import PokemonAnalyzer from "./components/PokemonAnalyzer/PokemonAnalyzer"
import { APIStatusIndicator } from "./components/APIStatusIndicator"
import "./components/assets/PokemonClassic.ttf";
import './index.css'

function App(){
  return(
    <div className="container">
      <PokemonAnalyzer />
      <APIStatusIndicator />
    </div>
  )
}

export default App
