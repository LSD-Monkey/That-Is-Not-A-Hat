# 🖥️ Server - Real-time Multiplayer Backend

## Architektur

Der Server besteht aus einem Node.js/Express-Backend mit Socket.IO für Echtzeit-Kommunikation.

### Komponenten

1. **Express API** - HTTP-Routing für RESTful Endpoints
2. **Socket.IO** - WebSocket-basierte Echtzeit-Synchronisation
3. **In-Memory State** - Spielzustand in RAM gehalten (für Performance)

### Tech-Stack

- **Node.js** v18+ - Runtime Environment
- **Express** v4 - HTTP Server Framework
- **Socket.IO** v4 - Real-time WebSocket Library
- **UUID** v9 - Unique ID Generation

## 📦 Installation

```bash
cd server
npm install
```

### Abhängigkeiten

| Paket | Version | Zweck |
|-------|---------|-------|
| express | ^4.18.2 | HTTP Server & API Routing |
| socket.io | ^4.6.1 | WebSocket für Echtzeit-Kommunikation |
| uuid | ^9.0.0 | Generierung eindeutiger Spielerraten |

## 🚀 Starten

### Entwicklung

```bash
node index.js
```

Server läuft auf: `http://localhost:4000`

### Mit Umgebungsvariablen

```bash
cp .env.example .env
# Bearteile PORT, MIN_PLAYERS, etc.
node index.js
```

## 🏗️ Modulkonfiguration

### Spielkonstanten (`GAME_CONFIG`)

```javascript
{
  MIN_PLAYERS: 3,    // Minimum Spieler für Start
  MAX_PLAYERS: 8,    // Maximum Spieler pro Raum
  DEFAULT_ROUNDS: 5  // Standard Anzahl Runden
}
```

### Exportierte Funktionen

#### Room Management

- **`createRoom(roomId)`** - Erstelle neuen Spielraum
  ```javascript
  const room = createRoom('ABC123');
  ```

- **`getRoom(roomId)`** - Raum nach ID holen
  ```javascript
  const room = getRoom('ABC123');
  ```

#### Spieler Management

- **`addPlayerToRoom(socket, roomId)`** - Spieler zum Raum hinzufügen
  ```javascript
  addPlayerToRoom(socket, 'ABC123');
  ```

- **`startGame(gameData)`** - Spielphase starten
  ```javascript
  startGame(room);
  ```

- **`endRound(gameData)`** - Aktuelle Runde beenden
  ```javascript
  endRound(room);
  ```

- **`endGame(gameData)`** - Ganzes Spiel beenden
  ```javascript
  endGame(room);
  ```

#### Kartendeck

- **`createDeck(size?)`** - Deck mit Karten erstellen und mischen
  ```javascript
  const deck = createDeck(); // Default: 8 Karten
  const smallDeck = createDeck(5);
  ```

#### Hilfsfunktionen

- **`generateAvatarColor()`** - Zufällige Avatar-Farbe generieren
- **`createPlayer(playerId, name)`** - Spieler-Avatar erstellen
- **`calculateRank(score, totalPossible)`** - Spielerrang berechnen

## 📡 Socket.IO Events

### Client → Server

| Event | Payload | Beschreibung |
|-------|---------|--------------|
| `authenticate` | `{ roomId, playerName }` | Spieler identifiziert sich zum Raum |
| `toggle-ready` | `{ playerId, ready }` | Bereitschaftsstatus umschalten |
| `join-game` | `{ roomId }` | Zum aktiven Spiel beitreten |

### Server → Client (Broadcast)

| Event | Payload | Beschreibung |
|-------|---------|--------------|
| `player-joined` | `{ playerId, playerName, avatarColor }` | Neuer Spieler trat bei |
| `game-started` | `{ roomCode, players }` | Spiel startet automatisch |
| `round-ended` | `{ currentPlayer }` | Runde wurde beendet |
| `game-ended` | `{ results, players }` | Spiel beendet mit Ergebnissen |
| `error` | `data` | Fehlermeldung |

### Server → Client (Gezielt)

| Event | Payload | Beschreibung |
|-------|---------|--------------|
| `lobby-state-update` | `{ players }` | Lobby-Status aktualisiert |
| `sync-state` | `{ state }` | Vollständiger Spielzustand synchronisiert |

## 🔒 Sicherheit

### Validierung

- **Mindestrundenzahl**: Mindestens 3 Spieler erforderlich
- **Maximale Spieler**: Maximum 8 Spieler pro Raum
- **Raum-Code**: Nur gültige Room-Codes akzeptiert

### Autorisierung

- Server validiert alle Spielzüge serverseitig
- Client darf Spielzustand nicht direkt manipulieren
- WebSocket-Reconnection mit Zustandserhalt

### Fehlerbehandlung

```javascript
socket.on('error', (data) => {
  // Fehler wird an den spezifischen Client gesendet
});

io.to(roomId).emit('player-left', { playerId });
// Broadcast an alle im Raum
```

## 🔄 Spielphasen

1. **Lobby** - Spieler verbinden sich, warten auf Mindestrundenzahl
2. **Game** - Aktives Spiel mit Kartenverteilung
3. **Round End** - Runde wird abgeschlossen
4. **Game Over** - Ergebnisse und Siegerauswertung

## 💾 Persistenz (Aktuell)

Der Server verwendet **In-Memory State**:

```javascript
const rooms = new Map(); // roomId -> game state
const players = new Map(); // socketId -> player data
```

### Für persistente Speicherung:

Füge Redis oder eine Datenbank hinzu:

```javascript
// Beispiel: Redis Integration
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

// Spielstand speichern
await redisClient.set(`game:${roomId}`, JSON.stringify(gameData));
```

## 🌐 Externe Freigabe

### Lokal im Netzwerk (WLAN)

1. Finde deine IP-Adresse: `ipconfig` (Windows) oder `ifconfig` (Mac/Linux)
2. Teile den Link mit anderen im gleichen WLAN: `http://DEINE_IP:4000`

### Für Internet-Zugang

Benutze einen Tunneling-Dienst:

```bash
# ngrok installieren
npm install -g ngrok

# Tunnel starten
ngrok http 4000
```

Teile die generierte HTTPS-URL mit externen Spielern.

## 🧪 Tests

```bash
cd server/__tests__
npm test
```

## 📝 Logging

Der Server loggt:

- Verbindungen (Connect/Disconnect)
- Fehler
- Startstatus

### Beispiel Output

```
🎮 Server running on http://localhost:4000
Client connected: abc123xyz
authenticate received for room: ABC123
lobby-state-update broadcast to 3 players
game-started for room: ABC123
Client disconnected: abc123xyz
```

## 🔧 Konfiguration

### .env Datei

```env
PORT=4000              # Server-Port (Standard: 4000)
WS_HEARTBEAT=25000     # Socket.IO Ping-Interval (ms)
WS_PING_TIMEOUT=60000  # Timeout für fehlgeschlagene Pings (ms)
MIN_PLAYERS=3          # Minimum Spieleranzahl
MAX_PLAYERS=8          # Maximum Spieleranzahl  
DEFAULT_ROUNDS=5       # Standard Runde Anzahl
```

## 🐛 Debugging

### WebSocket-Debugging

```javascript
io.on('connection', (socket) => {
  socket.onAny((event, ...args) => {
    console.log(`Event: ${event}`, args);
  });
});
```

### Spielzustand prüfen

```bash
# API Endpoint für Raumliste
curl http://localhost:4000/api/rooms

# Prüfe den Server-Terminal für Logs
```

## 📊 Performance

- **Memory**: In-Memory State ist sehr schnell (~1ms Latenz)
- **Concurrent Rooms**: Bis zu 50 Räume mit je 8 Spielern möglich
- **WebSocket**: Niedrigste Latenz für Echtzeit-Spiel

### Für höhere Last:

- Redis für Zustandshinterlegung
- Cluster Module für Multi-Core Support
- Load Balancer für mehrere Server-Instanzen

---

**Viel Spaß beim Entwickeln! 🎮💻**
