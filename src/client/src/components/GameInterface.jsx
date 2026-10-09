import './Game.css';

export default function GameInterface({ gameState, myPlayer, showRules, setShowRules, message }) {
  if (gameState?.phase === 'lobby') {
    return <LobbyPhase gameState={gameState} myPlayer={myPlayer} />;
  }

  if (gameState?.phase === 'round_end' || gameState?.phase === 'game_over') {
    return <ResultPhase gameState={gameState} />;
  }

  if (gameState?.phase === 'game') {
    return <GamePhase gameState={gameState} myPlayer={myPlayer} />;
  }

  if (showRules) {
    return <RulesScreen setShowRules={setShowRules} />;
  }

  return (
    <div className="no-game">
      <h2>🎮 Das Ist Nicht Ein Hut!</h2>
      <p>Komm in einen Raum und finde heraus, ob du die Wahrheit sagst oder bluffst!</p>
      {message && <p>{message}</p>}
      <button onClick={() => setShowRules(true)} className="btn btn-primary">
        📖 Regeln ansehen
      </button>
    </div>
  );
}

function LobbyPhase({ gameState, myPlayer }) {
  const toggleReady = () => {
    if (myPlayer) {
      socketIO('http://localhost:4000').emit('toggle-ready', { 
        playerId: myPlayer.id, 
        ready: !myPlayer.ready 
      });
    }
  };

  return (
    <div className="lobby-phase">
      <h2>🏠 Lobby - Raum {gameState.roomId}</h2>
      
      <div className="players-grid">
        {gameState.players.map((player) => (
          <PlayerCard key={player.id} player={player} isMe={myPlayer?.id === player.id} />
        ))}
      </div>

      <div className="lobby-actions">
        {!myPlayer?.ready ? (
          <button onClick={toggleReady} className={`btn btn-success ${gameState.players.filter(p => p.ready).length >= 3 ? 'pulsing' : ''}`}>
            🟢 Bereit werden
          </button>
        ) : (
          <div className="ready-status">🟦 BEREIT</div>
        )}

        <button onClick={() => socketIO('http://localhost:4000').disconnect()} className="btn btn-secondary">
          🚪 Raum verlassen
        </button>
      </div>

      {gameState.players.size >= game.GAME_CONFIG.MIN_PLAYERS && !myPlayer?.ready && (
        <p className="auto-start-notice">Alle Spieler sind bereit - das Spiel startet automatisch!</p>
      )}
    </div>
  );
}

function GamePhase({ gameState, myPlayer }) {
  const currentCard = gameState.deck[gameState.revealedCardIndex];
  const isNextPlayer = (index) => index === gameState.currentPlayerIndex;
  
  return (
    <div className="game-phase">
      <div className="top-bar">
        <button onClick={() => socketIO('http://localhost:4000').disconnect()} className="btn-icon-small">❌</button>
        <span className="turn-indicator">
          🎯 Runde {gameState.round} / {gameState.totalRounds}
        </span>
        <span className="player-index">Spieler {gameState.currentPlayerIndex + 1}</span>
      </div>

      <div className="card-area">
        <CardDisplay card={currentCard} isMe={isNextPlayer(gameState.revealedCardIndex)} />
      </div>

      <div className="player-info">
        <h3>Dein Gegner</h3>
        <PlayerAvatar player={gameState.players[gameState.currentPlayerIndex]} size="large" />
      </div>

      <div className="action-buttons">
        {!isNextPlayer(gameState.revealedCardIndex) ? (
          <>
            <button 
              onClick={() => socketIO('http://localhost:4000').emit('call_bluff', { cardId: currentCard.id })}
              className="btn btn-bluff"
            >
              🎭 Ich glaube NICHT! (Bluff!)
            </button>
            <button 
              onClick={() => socketIO('http://localhost:4000').emit('claim_truth', { cardId: currentCard.id })}
              className="btn btn-truth"
            >
              ✅ Ich GLAUBE! (Wahrheit!)
            </button>
          </>
        ) : (
          <div className="your-turn">
            <p className="turn-text">Dein Zug - warte auf Gegner...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPhase({ gameState }) {
  return (
    <div className="result-phase">
      <h2>🏆 Spiel beendet!</h2>
      
      <div className="results-container">
        {gameState.results?.map((result, index) => (
          <ResultCard key={result.playerId} result={result} rank={index + 1} />
        ))}
      </div>

      <div className="continue-game">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          🔄 Neues Spiel
        </button>
      </div>
    </div>
  );
}

function RulesScreen({ setShowRules }) {
  return (
    <div className="rules-screen">
      <button onClick={() => setShowRules(false)} className="btn-icon">❌</button>
      
      <h2>📖 Spielregeln</h2>
      
      <div className="rules-content">
        <section>
          <h3>🎯 Ziel des Spiels</h3>
          <p>Gewinne Punkte, indem du Gegner zum Bluffen bringst oder die Wahrheit erkenntst!</p>
        </section>

        <section>
          <h3>🃏 Spielablauf</h3>
          <ul>
            <li>Jeder Spieler erhält eine verdeckte Gegenstandskarte</li>
            <li>Nach einer Weile gibt der aktuelle Spieler die Karte weiter</li>
            <li>Dann muss er sagen: "Das ist nicht ein [Gegenstand]"</li>
            <li>Die empfangende Person entscheidet: Glaubst du ihr oder blüfft sie?</li>
          </ul>
        </section>

        <section>
          <h3>✅ Richtig erkannt (Bluff)</h3>
          <p class="points">+1 Punkt für dich!</p>
          <p>Gegner erhält den Gegenstand weiter</p>
        </section>

        <section>
          <h3>❌ Falsch erkannt (Wahrheit)</h3>
          <p class="points">-1 Punkt für dich</p>
          <p>Gegner behält den Gegenstand und darf weiterbluffen</p>
        </section>

        <section>
          <h3>🏆 Gewinner</h3>
          <p>Nach der voreingestellten Anzahl von Runden gewinnt die Person mit den meisten Punkten!</p>
        </section>

        <section className="tips">
          <h3>💡 Tipps</h3>
          <ul>
            <li>Behalte die Karten im Kopf - wer hat was?</li>
            <li>Bluffe selbst, um andere zu verwirren</li>
            <li>Höre auf deine Intuition!</li>
          </ul>
        </section>
      </div>

      <button onClick={() => setShowRules(false)} className="btn btn-primary mt-4">
        ✅ Verstanden
      </button>
    </div>
  );
}

function PlayerCard({ player, isMe }) {
  return (
    <div className={`player-card ${isMe ? 'me' : ''}`}>
      <div className="avatar">{player.avatarColor} 👤</div>
      <div className="player-name">{player.name}</div>
      {!player.ready && !isMe && <span className="not-ready">Wartet...</span>}
      {player.ready && !isMe && <span className="ready">🟢 Bereit</span>}
    </div>
  );
}

function CardDisplay({ card, isMe }) {
  return (
    <div className={`card-display ${isMe ? 'visible' : 'hidden'}`}>
      <div className="card-back">❓</div>
      {isMe && (
        <div className="card-content">
          <div className="card-emoji">{card.emoji}</div>
          <div className="card-text">{card.description}</div>
        </div>
      )}
    </div>
  );
}

function PlayerAvatar({ player, size = 'normal' }) {
  const sizeClass = size === 'large' ? 'large' : 'normal';
  
  return (
    <div className={`player-avatar ${sizeClass}`}>
      <div className="avatar-bg" style={{ backgroundColor: player.avatarColor }}></div>
      <div className="avatar-icon">👤</div>
      {player.name}
    </div>
  );
}

function ResultCard({ result, rank }) {
  const icons = ['🏆', '⭐', '🌟', '✨'];
  
  return (
    <div className="result-card">
      <div className="rank">{rank}. {icons[rank - 1]}</div>
      <div className="avatar-circle" style={{ backgroundColor: result.avatarColor }}></div>
      <div className="name">{result.name}</div>
      <div className="score">🎯 {result.correctBluffs} richtige Bluffs</div>
    </div>
  );
}

export { RulesScreen, PlayerCard, CardDisplay, PlayerAvatar, ResultCard };
