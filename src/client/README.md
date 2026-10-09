# 🖼️ Client - React Frontend

## Architektur

Das Frontend basiert auf React 18 mit Vite als Build-Tool für schnelles Hot Reload.

### Komponentenstruktur

```
src/client/src/
├── components/           # React Komponenten
│   ├── Game.jsx         # Haupt-Komponente (Container)
│   ├── GameClient.jsx   # Socket.IO Integration
│   └── GameInterface.jsx # UI Screens & Logik
├── utils/               # Hilfsfunktionen
│   └── socket.js        # Socket.IO Konfiguration & Events
├── assets/              # Statische Assets
│   └── css/            # Stylesheets
├── main.jsx             # React Entry Point
└── App.css              # Globale Styles
```

### Tech-Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| Framework | React | ^18.2.0 |
| Build Tool | Vite | ^5.0.0 |
| Websockets | Socket.IO Client | ^4.6.1 |
| Styling | CSS Modules + Custom | Modern CSS |

## 📦 Installation

```bash
cd src/client
npm install
```

### Abhängigkeiten

| Paket | Version | Zweck |
|-------|---------|-------|
| react | ^18.2.0 | UI Framework |
| react-dom | ^18.2.0 | React DOM Rendering |
| socket.io-client | ^4.6.1 | WebSocket Client Library |

## 🚀 Starten

### Entwicklung (Hot Reload)

```bash
npm run dev
```

Frontend läuft auf: `http://localhost:5173`

**Hinweis**: Der Server muss separat gestartet werden (siehe Haupt-README)!

### Produktion Build

```bash
npm run build
# Ausgabe: dist/
```

## 🎮 Spielablauf im Frontend

### Komponentenübersicht

#### 1. SetupScreen (`Game.jsx`)
- Willkommen-Bildschirm mit Optionen
- Raum erstellen / Beitreten

#### 2. RulesScreen (`Game.jsx`)
- Vollständige Spielregeln anzeigen
- Mit ❌ Button schließen

#### 3. GameInterface (`GameInterface.jsx`)
Hauptkomponente für alle Spielscreens:

**Screens:**

| Screen | Funktion |
|--------|----------|
| LobbyPhase | Spielerliste, Bereitschaftsanzeige |
| GamePhase | Aktives Spiel mit Karten & Buttons |
| ResultPhase | Gewinnerauswertung |
| RulesScreen | Spielregeln (wird separat gerendert) |

### Socket.IO Integration (`GameClient.jsx`)

#### Verbindungsinitialisierung

```javascript
const socket = new io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});
```

#### Event-Handling

**Server → Client:**

| Event | Handler | React State |
|-------|---------|-------------|
| `sync-state` | `setGameState(state)` | gameState, myPlayer |
| `player-joined` | `io.emit('player-joined')` | - |
| `game-started` | Auto-trigger | - |
| `round-ended` | `endRound()` callback | - |
| `game-ended` | Show results screen | phase = 'game_over' |
| `error` | Reset game | showRules = false |

**Client → Server:**

```javascript
// Initial authentication
socket.emit('authenticate', { roomId: roomCode, playerName });

// Toggle ready status
socket.emit('toggle-ready', { playerId: myPlayer.id, ready: true });

// Game actions (Bluff/Truth)
socket.emit('call_bluff', { cardId: currentCard.id });
socket.emit('claim_truth', { cardId: currentCard.id });
```

## 🎨 Styling

### CSS-Organisation

**Dateien:**
- `Game.css` - Grundlayout, Buttons, Utility Classes
- `GamePhase.css` - Spielphasen spezifisch (Karten, Avatare)
- `GameAll.css` - Kombiniertes CSS

**Styling Features:**

1. **Responsive Design**
   - Mobile-First Ansatz
   - Grid/Flexbox Layouts
   - Breakpoint: 768px (Tablet/Desktop)

2. **Animationen**
   - `@keyframes bounce` - Karten erscheinen mit Sprung
   - `@keyframes pulse` - Turn Indicators
   - `@keyframes blink` - Auto-Start Notiz

3. **Responsive Bilder/Emoji**
   - Große Emoji als Karten-Grafiken
   - Avatar-Kreise mit Farb-Customization

### Beispiel: Card Flip Animation

```css
.card-display {
  perspective: 1000px;
}

.card-back, .card-content {
  backface-visibility: hidden;
}

.card-content {
  transform: rotateY(180deg);
}
```

## 🔧 Konfiguration

### Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
      },
    },
  },
});
```

### Server URL

Default: `http://localhost:4000`

Für externe Entwicklung: ngrok-URL oder Cloud IP

## 🧪 Testing (Frontend)

Vitest kann für React-Tests verwendet werden:

```bash
cd src/client
npm test          # Lohnt keine Tests noch
npm run build     # Build und prüfen
```

### Beispiel Unit Test (React Component):

```javascript
import { render, screen } from '@testing-library/react';
import GameInterface from './GameInterface';

test('displays lobby when phase is lobby', () => {
  const gameState = { phase: 'lobby' };
  
  render(<GameInterface gameState={gameState} />);
  
  expect(screen.getByText('Lobby')).toBeInTheDocument();
});
```

## 📱 Responsive Breakdown

### Mobile (< 768px)
- Kompaktierte Buttons (größer für Touch)
- Ein-Spalten Layouts
- Reduzierte Abstände und Padding
- Größere Touch-Ziele (min 44px)

### Tablet/Desktop (> 768px)
- Grid-Layouts für Spielerliste
- Mehrspalten-Komponenten
- Desktop-optimierte Karten

## 🎯 State Management

### React State Flow

```javascript
// Parent Game.jsx
const [gameState, setGameState] = useState(null);

// Child component receives
<GameInterface gameState={gameState} />

// Socket updates state
io.on('sync-state', ({ state }) => {
  setGameState(state);
});
```

### Data Flow Diagram

```
Socket.IO
    ↓
GameClient (Event Handler)
    ↓
setGameState() / setMyPlayer()
    ↓
All child components re-render
    ↓
UI Updates (Lobby/Game/Result screens)
```

## 🔒 Sicherheit (Frontend)

### WICHTIG: Der Client darf **NIEMALS** den Spielzustand direkt ändern!

**Korrekt:**
```javascript
// Client sendet nur Aktionen
socket.emit('call_bluff', { cardId });
```

**Falsch:**
```javascript
// ❌ NICHT TUN! - Verletzt Game Rules!
const gameState = {...};
gameState.phase = 'game'; // Server wird umgangen!
setGameState(gameState);  // Invalide!
```

### Client-Side Validierung (Optional)

```javascript
if (myPlayer.ready) {
  socket.emit('toggle-ready', { playerId, ready: false });
} else {
  console.warn('Nicht bereit - Aktion abgelehnt');
}
```

## 🐛 Debugging

### Console Logging

```javascript
// Socket.IO Events debuggen
socket.onAny((event, ...data) => {
  console.log(`[${event}]`, data);
});

// GameState debuggen
console.log('Game State:', JSON.stringify(gameState, null, 2));
```

### Browser DevTools

1. **Network Tab** - API Calls prüfen
2. **Console** - Socket.IO Events
3. **Elements** - CSS Debugging

## 📝 Best Practices

### Component Design

- **Single Responsibility**: Jede Komponente hat eine klare Aufgabe
- **Props Interface**: Dokumentiere alle Props mit JSDoc
- **Side Effects**: Nutze `useEffect` für Socket.IO
- **Cleanup**: Always disconnect on unmount!

```javascript
useEffect(() => {
  // Connect...
  return () => {
    // Disconnect
    socket.disconnect();
  };
}, [socket]);
```

### Performance

1. **Memoization** wo nötig
2. **Conditional Rendering** statt immer rendern
3. **CSS Modules** für Scoped Styles

## 🔧 Erweiterungsmöglichkeiten

### Chat-Funktion hinzufügen:

```javascript
socket.on('chat-message', ({ sender, message }) => {
  setMessages(prev => [...prev, { sender, message }]);
});

socket.emit('send-message', { roomId, message });
```

### Mehrere Räume unterstützen:

1. Raumliste aus `/api/rooms` laden
2. Player kann zwischen Räumen wechseln
3. Tabs für parallele Spiele

### Theme-Switcher:

- Dark/Light Mode Toggle
- Spieler-definierbare Farben

---

**Viel Spaß beim Entwickeln! 🎨💻**
