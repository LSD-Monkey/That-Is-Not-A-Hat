import { createDeck, GAME_CONFIG } from './game.js';

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

export { GAME_CONFIG };
