import { useEffect, useState } from 'react';
import { socketIO, GAME_EVENT_TYPES } from '../utils/socket.js';

export default function GameClient({ roomCode }) {
  const [socket] = useState(() => socketIO('http://localhost:4000'));
  const [gameState, setGameState] = useState(null);
  const [myPlayer, setMyPlayer] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    socket.on(GAME_EVENT_TYPES.CONNECTED, () => {
      console.log('Connected to server');
    });

    socket.on(GAME_EVENT_TYPES.ERROR, (data) => {
      setMessage(data || 'Unknown error');
    });

    socket.on(GAME_EVENT_TYPES.SYNC_STATE, ({ state }) => {
      setGameState(state);
      setMyPlayer(state?.players?.find(p => p.id === socket.data?.user?.id) || null);
      setMessage('');
    });

    socket.on(GAME_EVENT_TYPES.GAME_STARTING, () => {
      console.log('Game starting...');
    });

    return () => {
      isActive = false;
      socket.off(GAME_EVENT_TYPES.CONNECTED);
      socket.off(GAME_EVENT_TYPES.ERROR);
      socket.off(GAME_EVENT_TYPES.SYNC_STATE);
      socket.off(GAME_EVENT_TYPES.GAME_STARTING);
    };
  }, [socket]);

  useEffect(() => {
    if (roomCode && gameState) {
      // Authenticate with server
      socket.emit('authenticate', { roomId: roomCode, playerName: 'Demo Player' });
    }
  }, [roomCode, gameState?.players]);

  return (
    <GameUI 
      gameState={gameState} 
      myPlayer={myPlayer} 
      message={message}
    />
  );
}

function GameUI({ gameState, myPlayer, message }) {
  const [showRules, setShowRules] = useState(true);

  if (!gameState) {
    return <div className="no-game-state">Connecting...</div>;
  }

  return (
    <GameInterface 
      gameState={gameState} 
      myPlayer={myPlayer}
      showRules={showRules}
      setShowRules={setShowRules}
      message={message}
    />
  );
}
