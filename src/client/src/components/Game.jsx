import { useState, useEffect } from 'react';
import './Game.css';

export default function Game() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup, lobby, game, round_end, game_over
    role: 'spectator', // spectator, observer, active_player
    currentView: 'room_creator', // room_creator, lobby, game, result
  });

  return (
    <div className="game-container">
      {gameState.phase === 'setup' && (
        <SetupScreen
          onCreate={() => setGameState({ ...gameState, currentView: 'lobby' })}
        />
      )}

      {gameState.currentView === 'room_creator' && (
        <RoomCreatorScreen onBack={() => setGameState({ 
          ...gameState, 
          currentView: 'room_creator_input' 
        })} />
      )}

      {gameState.currentView === 'room_creator_input' && (
        <JoinRoomScreen onJoin={() => setGameState({ ...gameState, phase: 'lobby' })} />
      )}

      {gameState.phase === 'lobby' && (
        <LobbyScreen 
          roomCode={gameState.roomCode} 
          playerReady={gameState.playerReady || false}
          onBack={() => setGameState({ ...gameState, phase: 'setup', currentView: 'room_creator' })}
        />
      )}

      {gameState.phase === 'game' && (
        <GameScreen 
          roomCode={gameState.roomCode} 
          onBack={() => setGameState({ ...gameState, phase: 'lobby' })}
        />
      )}

      {gameState.phase === 'game_over' && (
        <ResultScreen roomCode={gameState.roomCode} />
      )}
    </div>
  );
}

function SetupScreen({ onCreate }) {
  const [hasJoined, setHasJoined] = useState(false);

  return (
    <div className="setup-screen">
      <h1>🎩 Das Ist Nicht Ein Hut!</h1>
      <p className="subtitle">Ein blitzschnelles Partyspiel</p>
      
      <div className="welcome-buttons">
        <button onClick={onCreate} className="btn btn-primary">
          🏠 Raum erstellen
        </button>
        
        <button 
          onClick={() => setHasJoined(!hasJoined)} 
          className="btn btn-secondary"
        >
          ✋ Spiel beitreten
        </button>

        {hasJoined && (
          <div className="join-instructions">
            <p>Verbinde mit deinem Server, um das Spiel zu starten!</p>
            <button onClick={onCreate} className="btn btn-success">
              🚀 Zum Lobby
            </button>
          </div>
        )}
      </div>

      <div className="game-info">
        <h3>🎮 Wie funktioniert's?</h3>
        <ul>
          <li>Jede Person spielt auf ihrem eigenen Gerät</li>
          <li>Eine Person erstellt einen Raum mit Einladungslink oder Code</li>
          <li>Betretenen müssen sich identifizieren</li>
          <li>Der Host startet das Spiel für alle gleichzeitig</li>
          <li>Geschwindigkeitskönig gewinnt!</li>
        </ul>
      </div>
    </div>
  );
}

function RoomCreatorScreen({ onBack }) {
  return (
    <div className="room-creator">
      <h2>🏠 Erstelle einen neuen Spielraum</h2>
      <p>Dein Raumcode wird automatisch generiert. Teile ihn mit deinen Freunden!</p>
      
      <button onClick={onBack} className="btn btn-secondary">
        ⬅ Zurück
      </button>
    </div>
  );
}

function JoinRoomScreen({ onJoin }) {
  return (
    <div className="join-room">
      <h2>✋ Spiel beitreten</h2>
      <p>Verbinde dich mit einem bestehenden Spielraum</p>
      
      <button onClick={onJoin} className="btn btn-primary">
        🔗 Zum Demo-Server verbinden
      </button>

      <div className="demo-note">
        <p>💡 Hinweis: Verbinde zuerst mit einem Server, um den Einladungslink zu erhalten!</p>
      </div>
    </div>
  );
}

function LobbyScreen({ roomCode, playerReady, onBack }) {
  return (
    <div className="lobby-screen">
      <div className="lobby-header">
        <button onClick={onBack} className="btn-icon">⬅</button>
        <h2>🎮 Spielraum: {roomCode}</h2>
        <span className={`ready-indicator ${playerReady ? 'ready' : ''}`}>
          🟢 Bereit: {playerReady ? 'JA' : 'NEIN'}
        </span>
      </div>

      <div className="players-list">
        <h3>👥 Spieler ({roomCode})</h3>
        
        <div className="waiting-notice">
          <p>Warte auf mindestens 2 weitere Spieler...</p>
          <button onClick={onBack} className="btn btn-secondary">Abbrechen</button>
        </div>
      </div>
    </div>
  );
}

function GameScreen({ roomCode, onBack }) {
  return (
    <div className="game-screen">
      <header className="game-header">
        <button onClick={onBack} className="btn-icon">⬅</button>
        <h2>🎮 Spiel in Progress...</h2>
        <span className="room-code">Raum: {roomCode}</span>
      </header>

      <div className="game-area">
        <div className="loading-message">
          <p>⏳ Das Spiel wird geladen...</p>
          <p>Bitte warte, dass alle Spieler verbunden sind.</p>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ roomCode }) {
  return (
    <div className="result-screen">
      <h2>🏆 Spiel beendet!</h2>
      
      <div className="game-results">
        <p>Raum: {roomCode}</p>
        <p className="note">Die Ergebnisse werden hier angezeigt...</p>
      </div>

      <button className="btn btn-primary mt-4">
        🔄 Neues Spiel
      </button>
    </div>
  );
}
