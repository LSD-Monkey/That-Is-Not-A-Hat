# 🎩 That's Not A Hat - Multiplayer Partyspiel

Ein browserbasiertes Online-Multiplayer-Partyspiel inspiriert vom Gedächtnis- und Bluffspiel "That's Not a Hat". Jede Person spielt auf dem eigenen Gerät über das Internet – kein Pass-and-Play an einem gemeinsamen Bildschirm!

## 🎮 Spielbeschreibung

**"Das Ist Nicht Ein Hut!"** ist ein blitzschnelles Partyspiel für 3-8 Spieler, bei dem es darum geht:
- Verdeckte Gegenstandskarten zu memorieren
- Gegner durch Bluffs zu verwirren
- Richtig zu erkennen, ob jemand blüfft oder die Wahrheit sagt

### Spielregeln

1. **Jede Person spielt auf ihrem eigenen Gerät** über den Internet-Server
2. Eine Person erstellt einen Raum mit einem Code oder Einladungslink
3. Alle Spieler verbinden sich und müssen "bereit" werden
4. Sobald alle verbunden sind, startet das Spiel automatisch:
   - Jeder erhält eine zufällige Gegenstandskarte (z.B. 🎩, 🧢, 👓)
   - Die Karten sind für den Träger verdeckt
5. Nach einer Weile wird die Karte an den nächsten Spieler weitergegeben
6. Der aktuelle Spieler sagt: *"Das ist nicht ein [Gegenstand]"*
7. Der nächste Spieler entscheidet: **Bluff!** oder **Wahrheit!**
8. Wenn jemand richtig erkennt, dass der andere blüfft: **+1 Punkt** für den Erkennenden
9. Wenn die Karte aufgedeckt wird und es doch "nicht X" war: **-1 Punkt** für den Ausreißer
10. Nach voreingestellter Rundenzahl gewinnt die Person mit den meisten Punkten!

## 🏗️ Architektur

### Tech-Stack

| Komponente | Technologie | Zweck |
|------------|-------------|-------|
| Frontend | React + Vite | Modernes UI mit reaktiven Komponenten |
| Backend | Node.js + Express | API und HTTP-Routing |
| Echtzeit-Kommunikation | Socket.IO | WebSocket-basierte Multiplayer-Synchronisation |
| Spielzustand | In-Memory Server State | Zentrale Spiellogik auf dem Server |

### Projektstruktur

```
That-Is-Not-A-Hat/
├── index.html                      # HTML Entry Point
├── package.json                    # Client dependencies (React, Vite)
├── vite.config.js                  # Vite build configuration
├── server/
│   ├── package.json                # Server dependencies (Express, Socket.IO)
│   └── index.js                    # Main server file with game logic
└── src/
    ├── client/                     # React frontend
    │   ├── src/
    │   │   ├── main.jsx           # React entry point
    │   │   ├── components/        # React components
    │   │   │   ├── Game.jsx       # Main game container
    │   │   │   ├── GameClient.jsx # Socket.IO integration
    │   │   │   └── GameInterface.jsx # UI screens
    │   │   └── utils/
    │   │       └── socket.js      # Socket.IO utilities & events
    │   └── assets/
    │       └── css/               # Stylesheets
    └── public/                    # Static files
```

### Spielphasen

1. **Setup** - Spieler wählen "Raum erstellen" oder "Spiel beitreten"
2. **Lobby** - Spieler verbinden sich, zeigen Bereitschaft an
3. **Game** - Aktive Spielphase mit Kartenverteilung und Entscheidungen
4. **Round End** - Runde wird abgeschlossen
5. **Game Over** - Ergebnisse und Siegerauswertung

### Echtzeit-Synchronisation

Der Server verwaltet den gesamten Spielzustand:
- Spielerlisten und Bereitschaftsstatus
- Kartendeck und Verteilung
- Aktuellen Spielerindex
- Spielphase (Lobby, Game, Round End, Game Over)
- Punktestände und Ergebnisse

Jede Aktion wird serverseitig validiert und an alle verbundenen Clients gesendet.

## 📦 Einrichtung

### Voraussetzungen

- **Node.js** 18.x oder höher ([Download](https://nodejs.org/))
- **npm** oder **yarn** (beim Node.js Installieren dabei)
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Klonen des Repositories:**

```bash
git clone https://github.com/LSD-Monkey/That-Is-Not-A-Hat.git
cd That-Is-Not-A-Hat
```

2. **Server-Abhängigkeiten installieren:**

```bash
cd server
npm install
```

3. **Client-Abhängigkeiten installieren:**

```bash
cd ../src/client
npm install
```

4. **Zurück zum Projektordner:**

```bash
cd ../..
```

## 🚀 Lokaler Start

### Entwicklungsumgebung (Hot Reload)

Starte Server und Client parallel:

```bash
npm run dev
```

Dies startet:
- **Vite Dev Server** auf `http://localhost:5173` (Frontend)
- **Node.js/Express Server** auf `http://localhost:4000` (Backend + WebSocket)

### Einzelne Services

**Nur Frontend:**
```bash
npm run dev:client
# Öffne http://localhost:5173 im Browser
```

**Nur Backend:**
```bash
npm run dev:server
# Server läuft auf http://localhost:4000
```

### Produktionsserver

Für den Live-Betrieb:

```bash
npm run build:client      # Frontend für production bauen
npm start                 # Server mit PORT=8080 starten
```

## 🎲 Spielen

### Als Host (Raum erstellen)

1. Öffne `http://localhost:5173` in einem Browser-Tab
2. Klicke auf **"Raum erstellen"**
3. Wähle **"Spiel beitreten"** (simuliert Serververbindung)
4. Du erhältst automatisch einen Raumcode (z.B. "ABC12")
5. Teile diesen Code mit deinen Freunden

### Als Spieler (Beitritt)

1. Öffne `http://localhost:5173` in einem **neuen Browser-Tab** (oder anonymisiertem Fenster)
2. Klicke auf **"Spiel beitreten"** und wähle die Serververbindung
3. Gib den Raumcode ein oder verbinde dich per Einladungslink
4. Warte, bis alle Spieler da sind
5. Klicke **"Bereit werden"** - wenn alle bereit sind, startet das Spiel!

### Mehrere Browser gleichzeitig

Um mehrere "Spieler" auf deinem Computer zu simulieren:
- Öffne den Client in mehreren Browsern (Chrome + Firefox)
- Oder nutze **inkognito Fenster** im selben Browser
- Jeder Tab öffnet eine unabhängige Spielinstanz

## 🧪 Tests

Das Projekt enthält folgende Testfälle:

### 1. Spiellogik-Tests

```bash
npm test
```

Testet:
- ✅ Kartendeck-Generierung und Shuffle (Fisher-Yates Algorithmus)
- ✅ Spieler-Validierung (Min/Max Spieleranzahl)
- ✅ Runde-Zählung und Spielendbedingungen
- ✅ Punktestand-Berechnung

### 2. Raumabläufe

Testet:
- ✅ Lobby-Übergang nach Mindestrundenzahl
- ✅ Auto-Start wenn alle bereit sind
- ✅ Round End Transition
- ✅ Game Over State

### 3. Wiederbeitritt (Reconnection)

```bash
npm run test:reconnect
```

Testet:
- ✅ Spieler-Disconnect und -Reconnect
- ✅ Spielzustand wird korrekt erhalten
- ✅ Neue Spieler können in laufende Partys beitreten
- ✅ Server validiert Züge nach Rejoin

### 4. Serverseitige Zugvalidierung

Testet:
- ✅ Bluff/Truth Entscheidungen werden serverseitig verarbeitet
- ✅ Nur berechtigter Spieler kann entscheiden
- ✅ Verdeckte Informationen bleiben geschützt
- ✅ Ungültige Spielzustände werden abgelehnt

**Ausführen:**
```bash
npm run test           # Alle Tests
npm run test:watch     # Watch Mode (automatisches Wiederaufnehmen)
```

## 🌐 Hosting & Deployment

### Lokal hosten für Online-Parties

1. **Server starten:**
   ```bash
   npm start
   ```
   Server läuft auf `http://localhost:4000`

2. **Freigabe auf dem Netzwerk:**
   
   Für andere Geräte im selben WLAN:
   - Finde deine lokale IP-Adresse (`ipconfig` in CMD)
   - Teile Link: `http://DEINE_IP:5173` (Vite Dev Server)

3. **Für externe Spieler (Internet):**
   
   Benutze einen Tunneling-Dienst wie:
   - **[ngrok](https://ngrok.com/)** - Einfachste Lösung
     ```bash
     ngrok http 5173    # Für Vite Frontend
     ngrok http 4000    # Für Server (falls nötig)
     ```
   - **[localtunnel](https://localtunnel.github.io/www/)** - Alternative

### Cloud-Hosting (optional)

Für produktionsreife Deployment:

**Frontend (Vercel/Netlify):**
```bash
npm run build:client
# Deploy den src/client/build Ordner
```

**Backend (Heroku/Railway/AWS):**
- Node.js mit Express und Socket.IO läuft problemlos auf allen Cloud-Plattformen
- PORT-Umgebungsvariable setzen (`PORT=8080`)
- Für persistente Spielzustände: Redis statt In-Memory Map

## 🛠️ Entwicklung

### Komponenten-Struktur

**Game.jsx** - Hauptkomponente:
- Steuert Spielphasen (setup → lobby → game → result)
- Handelt User-Eingaben und Initialisierung

**GameInterface.jsx** - UI Screens:
- `LobbyPhase` - Spielerliste, Bereitschaftsanzeige
- `GamePhase` - Aktive Karten, Bluff/Truth Buttons
- `ResultPhase` - Gewinnerauswertung
- `RulesScreen` - Spielregeln

**GameClient.jsx** - Socket.IO Integration:
- Verbindet mit Server
- Empfängt Echtzeit-Updates via Events
- Sendet Aktionen (authenticate, toggle-ready, etc.)

### Styling

CSS wird modular organisiert:
- `Game.css` - Grundlegende Styles und Buttons
- `GamePhase.css` - Spielphasen, Karten, Avatare
- Responsive Design für Mobile/Desktop

### Erweiterungsmöglichkeiten

1. **Persistenter Spielzustand:**
   - Integriere Redis oder Datenbank
   - Speichere Spielstand nach jedem Zug

2. **Verbesserte Karten:**
   - Mehr Gegenstände und Emojis
   - Visuelle Karten mit Bildern statt Emoji

3. **Spielvarianten:**
   - Konfigurierbare Punktesysteme
   - Team-Modus vs. Einzelmodus

4. **Chat-Funktion:**
   - Spiel-Chats zwischen Runden
   - Emoji-Support

## 📜 Lizenzen & Credits

- **React** - MIT License (Facebook)
- **Socket.IO** - MIT License
- **Vite** - MIT License
- **Express** - MIT License

Dieses Projekt ist eine Interpretation und Inspiration vom Spiel "That's Not a Hat" von Matt Parker. Alle Originalrechte am Konzept liegen beim ursprünglichen Erfinder.

## 🤝 Contributing

Fehler melden oder Features vorschlagen: [GitHub Issues](https://github.com/LSD-Monkey/That-Is-Not-A-Hat/issues)

## 📞 Support

Hilfestellung bei Problemen? Öffne ein Issue auf GitHub!

---

**Viel Spaß beim Bluffen und Lügen! 🎭✨**
