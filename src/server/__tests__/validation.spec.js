import { describe, it, expect } from 'vitest';

describe('Room Validation', () => {
  it('should validate minimum player count', () => {
    const isValid = (count) => count >= 3 && count <= 8;
    
    // Valid counts
    expect(isValid(3)).toBe(true);
    expect(isValid(4)).toBe(true);
    expect(isValid(5)).toBe(true);
    expect(isValid(6)).toBe(true);
    expect(isValid(7)).toBe(true);
    expect(isValid(8)).toBe(true);
    
    // Invalid counts
    expect(isValid(2)).toBe(false);
    expect(isValid(1)).toBe(false);
    expect(isValid(0)).toBe(false);
    expect(isValid(9)).toBe(false);
    expect(isValid(10)).toBe(false);
  });

  it('should calculate round progress', () => {
    const totalRounds = 5;
    
    // Round progression
    expect(Math.floor(0 / totalRounds) + 1).toBe(1);   // Start
    expect(Math.floor(1 / totalRounds) + 1).toBe(2);   // After round 1
    expect(Math.floor(4 / totalRounds) + 1).toBe(5);   // After round 4
    expect(Math.floor(5 / totalRounds)).toBe(1);       // Completed all rounds
    
    // Mid-game calculation
    const currentRound = Math.floor(2.5 / totalRounds) + 1;
    expect(currentRound).toBeLessThanOrEqual(totalRounds);
  });

  it('should detect game end condition', () => {
    const currentRound = 5;
    const totalRounds = 5;
    
    const isGameOver = currentRound >= totalRounds;
    expect(isGameOver).toBe(true);
    
    const stillPlaying = currentRound < totalRounds;
    expect(stillPlaying).toBe(true);
  });
});

describe('Player State Management', () => {
  it('should track player readiness', () => {
    const players = new Map();
    
    // Add players with ready state
    players.set('player1', { id: 'p1', ready: true, name: 'Alice' });
    players.set('player2', { id: 'p2', ready: false, name: 'Bob' });
    players.set('player3', { id: 'p3', ready: true, name: 'Charlie' });
    
    // Count ready players
    const readyCount = Array.from(players.values()).filter(p => p.ready).length;
    expect(readyCount).toBe(2);
    
    // All ready check
    const allReady = Array.from(players.values()).every(p => p.ready);
    expect(allReady).toBe(false);
  });

  it('should handle player count changes', () => {
    const players = new Map();
    
    // Start with minimum players
    for (let i = 0; i < 3; i++) {
      players.set(`p${i}`, `Player ${i}`);
    }
    
    expect(players.size).toBe(3);
    
    // Add more players
    for (let i = 3; i < 7; i++) {
      players.set(`p${i}`, `Player ${i}`);
    }
    
    expect(players.size).toBe(7);
    
    // Remove player
    players.delete('p0');
    expect(players.size).toBe(6);
  });
});
