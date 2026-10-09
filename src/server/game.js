import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// Game state storage (in-memory for simplicity, can be enhanced with Redis)
const rooms = new Map(); // roomId -> game state
const players = new Map(); // socketId -> player data

// Game configuration
const GAME_CONFIG = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8,
  DEFAULT_ROUNDS: 5,
};

// Initialize room
export function createRoom(roomId) {
  const gameData = {
    id: roomId,
    code: roomId.slice(0, 6),
    players: new Map(), // playerId -> player data (with ready status)
    gamePhase: 'lobby', // lobby, game, round_end, game_over
    currentRound: 0,
    totalRounds: GAME_CONFIG.DEFAULT_ROUNDS,
    currentPlayerIndex: 0,
    deck: [],
    hiddenCards: [],
    revealedCardIndex: -1,
    isRevealPhase: false,
    gameStateHistory: [], // For reconnection recovery
  };
  
  rooms.set(roomId, gameData);
  return gameData;
}

// Get room by ID
export function getRoom(roomId) {
  return rooms.get(roomId);
}

// Add player to room
export function addPlayerToRoom(socket, roomId) {
  const gameData = rooms.get(roomId);
  if (!gameData) return null;
  
  if (gameData.players.size >= GAME_CONFIG.MAX_PLAYERS) {
    socket.emit('error', 'Room is full');
    return null;
  }
  
  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: socket.data?.user?.name || `Player ${gameData.players.size + 1}`,
    ready: false,
    avatarColor: generateAvatarColor(),
  };
  
  gameData.players.set(playerId, player);
  players.set(socket.id, { roomId, playerId });
  
  io.to(roomId).emit('player-joined', { 
    playerId, 
    playerName: player.name, 
    avatarColor: player.avatarColor 
  });
  
  // Start game if minimum players reached
  if (gameData.players.size === GAME_CONFIG.MIN_PLAYERS && gameData.gamePhase === 'lobby') {
    startGame(gameData);
  }
  
  return player;
}

function generateAvatarColor() {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63', '#00bcd4', '#ff9800'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Start the game phase
export function startGame(gameData) {
  gameData.gamePhase = 'game';
  gameData.currentRound = 0;
  gameData.currentPlayerIndex = 0;
  
  io.to(gameData.id).emit('game-started', { 
    roomCode: gameData.code,
    players: Array.from(gameData.players.values())
  });
}

// End current round
export function endRound(gameData) {
  gameData.gamePhase = 'round_end';
  gameData.revealedCardIndex = -1;
  gameData.isRevealPhase = false;
  
  io.to(gameData.id).emit('round-ended', {
    currentPlayer: Array.from(gameData.players.values())[gameData.currentPlayerIndex],
  });
}

// End the entire game
export function endGame(gameData) {
  gameData.gamePhase = 'game_over';
  
  const results = calculateWinner(gameData);
  
  io.to(gameData.id).emit('game-ended', { 
    results,
    players: Array.from(gameData.players.values()),
  });
}

// Calculate winner based on successful bluffs
function calculateWinner(gameData) {
  let correctBluffs = new Map(); // playerId -> count
  
  for (const [playerId, player] of gameData.players) {
    correctBluffs.set(playerId, 0);
  }
  
  return Array.from(correctBluffs.entries()).map(([playerId, count]) => ({
    playerId,
    name: player.name,
    avatarColor: player.avatarColor,
    correctBluffs: count,
    rank: calculateRank(count),
  })).sort((a, b) => b.correctBluffs - a.correctBluffs);
}

function calculateRank(score) {
  const maxScore = Object.values(players).length * GAME_CONFIG.MAX_ROUNDS;
  const percentage = score / maxScore;
  
  if (percentage >= 0.95) return '🏆'; // Champion
  if (percentage >= 0.8) return '⭐'; // Star
  if (percentage >= 0.6) return '🌟'; // Great
  return '✨'; // Good luck next time!
}

// Create a card (item to memorize)
function createCard() {
  const items = [
    '🎩 Ein Hut', '🧢 Eine Baseballkappe', '👓 Sonnenbrillen', '🕶️ Shades',
    '👞 Stiefel', '👠 Abschuhe', '👡 Flache Sandalen', '🧤 Handschuhe',
    '🧦 Socken', '🎀 Ein Schleifen', '🪖 Helm', '⛑️ Schutzbrille',
    '🥋 Kampfausrüstung', '🎭 Theatermasken', '🎨 Pinsel', '📚 Bücher',
    '🎤 Mikrofon', '🎸 Gitarre', '🎹 Klavier', '🎺 Trompete',
    '⚽ Fußball', '🏀 Basketball', '🏈 American Football', '🏐 Volleyball',
    '🏓 Schläger', '🔧 Werkzeug', '💄 Lippenstift', '🖌️ Make-up Pinsel',
    '🎵 Notenheft', '🗺️ Landkarte', '📋 Notizbuch', '📝 Stift und Papier'
  ];
  
  return {
    id: uuidv4(),
    emoji: items[Math.floor(Math.random() * items.length)],
    description: `Ein ${items[Math.floor(Math.random() * items.length)]}`,
  };
}

// Deck management
export function createDeck(gameData) {
  const deck = Array.from({ length: GAME_CONFIG.MAX_PLAYERS }, () => createCard());
  // Shuffle using Fisher-Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Reset room for new game
export function resetRoom(gameData) {
  gameData.players.clear();
  gameData.gamePhase = 'lobby';
  gameData.currentRound = 0;
  gameData.deck = [];
  gameData.hiddenCards = [];
  gameData.revealedCardIndex = -1;
  gameData.isRevealPhase = false;
}

export default {
  io,
  createRoom,
  getRoom,
  addPlayerToRoom,
  startGame,
  endRound,
  endGame,
  resetRoom,
  GAME_CONFIG,
};
