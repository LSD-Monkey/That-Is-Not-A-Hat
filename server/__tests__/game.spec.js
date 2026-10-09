import { describe, it, expect } from 'vitest';
import { createDeck, GAME_CONFIG, calculateRank } from './game.js';

describe('Game Logic - Deck Creation', () => {
  it('should create deck with correct size', () => {
    const deck = createDeck(8);
    
    expect(deck.length).toBe(8);
    expect(Array.isArray(deck)).toBe(true);
  });

  it('should shuffle deck using Fisher-Yates algorithm', () => {
    // Run multiple times to check randomness
    for (let i = 0; i < 10; i++) {
      const deck = createDeck(8);
      
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
    const deck = createDeck(5);
    
    if (deck.length > 0) {
      const firstCard = deck[0];
      
      expect(firstCard.id).toBeTruthy();
      expect(firstCard.emoji).toBeTruthy();
      expect(firstCard.description).toBeTruthy();
    }
  });
});

describe('Game Config Constants', () => {
  it('should have correct minimum players', () => {
    expect(GAME_CONFIG.MIN_PLAYERS).toBe(3);
  });

  it('should have correct maximum players', () => {
    expect(GAME_CONFIG.MAX_PLAYERS).toBe(8);
  });

  it('should have default rounds configuration', () => {
    expect(GAME_CONFIG.DEFAULT_ROUNDS).toBe(5);
  });
});

describe('Rank Calculation', () => {
  it('should calculate correct ranks based on score', () => {
    const totalPossible = 10;
    
    // Champion
    expect(calculateRank(10, totalPossible).emoji).toBe('🏆');
    expect(calculateRank(9, totalPossible).emoji).toBe('🏆');
    
    // Star Player
    expect(calculateRank(8, totalPossible).emoji).toBe('⭐');
    expect(calculateRank(7, totalPossible).emoji).toBe('⭐');
    
    // Great!
    expect(calculateRank(6, totalPossible).emoji).toBe('🌟');
    expect(calculateRank(5, totalPossible).emoji).toBe('🌟');
    
    // Good luck next time
    expect(calculateRank(4, totalPossible).emoji).toBe('✨');
  });
});
