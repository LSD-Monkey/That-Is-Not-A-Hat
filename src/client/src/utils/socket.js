import { io as IO } from 'socket.io-client';

export const socketIO = (url) => {
  return IO(url, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });
};

export const GAME_EVENT_TYPES = {
  // Room and Game Management
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  
  // Lobby State
  LOBBY_STATE_UPDATE: 'lobby_state_update',
  
  // Game Phase Transitions
  GAME_STARTING: 'game_starting',
  ROUND_ENDING: 'round_ending',
  GAME_ENDING: 'game_ending',
  
  // Card Actions
  CARD_HIDDEN: 'card_hidden',
  CARD_TO_NEXT_PLAYER: 'card_to_next_player',
  
  // Player Decisions
  BLUFF_CALL: 'bluff_call',
  REVEAL_CARD: 'reveal_card',
  
  // Round Management
  ROUND_STARTED: 'round_started',
  ROUND_ENDED: 'round_ended',
  REVEAL_PHASE: 'reveal_phase',
  
  // Game Results
  GAME_RESULT: 'game_result',
  PLAYER_RANKINGS: 'player_rankings',
  
  // Error Messages
  ERROR: 'error',
  
  // Connection
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

export const SOCKET_EVENTS = {
  AUTHENTICATE: 'authenticate',
  GET_ROOM_CODE: 'get_room_code',
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  TOGGLE_READY: 'toggle_ready',
  
  // Game actions
  CALL_BLUFF: 'call_bluff',
  CLAIM_TRUTH: 'claim_truth',
  
  // State updates
  SYNC_STATE: 'sync_state',
};
