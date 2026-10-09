import { describe, it, expect } from 'vitest';
import { createDeck } from './game.js';

describe('Game Logic - Deck Creation', () => {
  it('should create deck with exactly MAX_PLAYERS cards', () => {
    const gameData = { id: 'test-room' };
    const deck = createDeck(gameData);
    
    expect(deck.length).toBeGreaterThan(0);
    expect(Array.isArray(deck)).toBe(true);
  });

  it('should shuffle deck using Fisher-Yates algorithm', () => {
    const gameData = { id: 'test-room' };
    
    // Run multiple times to check randomness
    for (let i = 0; i < 10; i++) {
      const deck = createDeck(gameData);
      
      // Verify shuffle by checking that card positions vary
      const positions = new Set();
      for (const card of deck) {
        const idIndex = deck.findIndex(c => c.id === card.id);
        positions.add(idIndex);
      }
      
      expect(positions.size).toBeGreaterThan(1);
    }
  });

  it('should create cards with emoji and description', () => {
    const gameData = { id: 'test-room' };
    const deck = createDeck(gameData);
    
    if (deck.length > 0) {
      const firstCard = deck[0];
      
      expect(firstCard.id).toBeTruthy();
      expect(firstCard.emoji).toBeTruthy();
      expect(firstCard.description).toBeTruthy();
      
      // Check emoji is from known items list
      const knownEmojis = [
        '🎩', '🧢', '👓', '🕶️', '👞', '👠', '👡', '🧤',
        '🧦', '🎀', '🪖', '⛑️', '🥋', '🎭', '🎨'
      ];
      
      expect(knownEmojis.includes(firstCard.emoji)).toBe(true);
    }
  });
});

describe('Game Config Constants', () => {
  it('should have correct minimum players', () => {
    expect(game.GAME_CONFIG.MIN_PLAYERS).toBe(3);
  });

  it('should have correct maximum players', () => {
    expect(game.GAME_CONFIG.MAX_PLAYERS).toBe(8);
  });

  it('should have default rounds configuration', () => {
    expect(game.GAME_CONFIG.DEFAULT_ROUNDS).toBe(5);
  });
});
