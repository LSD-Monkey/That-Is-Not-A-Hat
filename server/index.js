import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import * as gameModule from './game.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// API routes
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    code: room.code,
    playerCount: room.players.size,
    maxPlayers: gameModule.GAME_CONFIG.MAX_PLAYERS,
  }));
  res.json({ success: true, rooms: roomList });
});

app.post('/api/rooms/:code/start', (req, res) => {
  const roomId = req.params.code;
  const room = getRoom(roomId);
  
  if (!room || room.players.size < gameModule.GAME_CONFIG.MIN_PLAYERS) {
    return res.status(400).json({ success: false, error: 'Not enough players' });
  }
  
  startGame(room);
  res.json({ success: true });
});

app.post('/api/rooms/:code/end-round', (req, res) => {
  const roomId = req.params.code;
  const room = getRoom(roomId);
  
  if (!room || room.gamePhase !== 'game') {
    return res.status(400).json({ success: false, error: 'Invalid game state' });
  }
  
  endRound(room);
  io.to(roomId).emit('round-ended', { currentPlayer: null });
  res.json({ success: true });
});

app.post('/api/rooms/:code/end-game', (req, res) => {
  const roomId = req.params.code;
  const room = getRoom(roomId);
  
  if (!room || room.gamePhase !== 'game') {
    return res.status(400).json({ success: false, error: 'Invalid game state' });
  }
  
  endGame(room);
  res.json({ success: true });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('authenticate', ({ roomId, playerName }) => {
    const room = getRoom(roomId);
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    
    // Add player to room
    addPlayerToRoom(socket, roomId);
  });
  
  socket.on('toggle-ready', ({ playerId, ready }) => {
    const room = getRoom(socket.data?.roomId);
    if (room) {
      const player = room.players.get(playerId);
      if (player) {
        player.ready = ready;
        io.to(room.id).emit('lobby-state-update', { players: Array.from(room.players.values()) });
        
        // Auto-start game if minimum players and all are ready
        if (room.gamePhase === 'lobby' && room.players.size >= gameModule.GAME_CONFIG.MIN_PLAYERS) {
          startGame(room);
        }
      }
    }
  });
  
  socket.on('join-game', ({ roomId }) => {
    const room = getRoom(roomId);
    if (room && room.gamePhase === 'game') {
      socket.join(roomId);
      io.to(roomId).emit('sync-state', getRoomState(room));
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Find and remove player
    for (const [sid, data] of players) {
      if (sid === socket.id) {
        const roomId = data.roomId;
        const room = rooms.get(roomId);
        
        if (room) {
          const playerId = data.playerId;
          room.players.delete(playerId);
          io.to(roomId).emit('player-left', { playerId });
          
          // Check if game should end
          if (room.gamePhase === 'game' && room.players.size < gameModule.GAME_CONFIG.MIN_PLAYERS) {
            endGame(room);
          }
        }
        
        players.delete(sid);
        break;
      }
    }
  });
});

// Helper functions for API and socket handlers
function getRoomState(room) {
  return {
    roomId: room.id,
    players: Array.from(room.players.values()),
    phase: room.gamePhase,
    round: room.currentRound,
    totalRounds: room.totalRounds,
  };
}

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🎮 Server running on http://localhost:${PORT}`);
});

export default { io, app, httpServer };
