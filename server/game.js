import { v4 as uuidv4 } from 'uuid';

// Game configuration constants
export const GAME_CONFIG = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8,
  DEFAULT_ROUNDS: 5,
};

// Helper function to generate avatar color
function generateAvatarColor() {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e91e63', '#00bcd4', '#ff9800'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to create a card (item to memorize)
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

// Deck management - create and shuffle deck using Fisher-Yates algorithm
export function createDeck(size = GAME_CONFIG.MAX_PLAYERS) {
  const deck = Array.from({ length: size }, () => createCard());
  
  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

// Calculate player rank based on score
export function calculateRank(score, totalPossible) {
  const percentage = score / totalPossible;
  
  if (percentage >= 0.95) return { emoji: '🏆', label: 'Champion' };
  if (percentage >= 0.8) return { emoji: '⭐', label: 'Star Player' };
  if (percentage >= 0.6) return { emoji: '🌟', label: 'Great!' };
  return { emoji: '✨', label: 'Good Luck Next Time!' };
}

// Create player avatar data
export function createPlayer(playerId, name) {
  return {
    id: playerId,
    name: name || `Player ${playerId}`,
    ready: false,
    avatarColor: generateAvatarColor(),
  };
}
