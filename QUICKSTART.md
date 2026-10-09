# 🚀 Quick Start Guide - Das Ist Nicht Ein Hut

## 1. Installation (einmalig)

Öffne einen Terminal im Projektordner:

```bash
# Server-Abhängigkeiten installieren
cd server
npm install
cd ..

# Client-Abhängigkeiten installieren
cd src/client
npm install
cd ..
```

## 2. Lokaler Start

### Für Entwicklung (Hot Reload):

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```
Server läuft auf: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd src/client
npm run dev
```
Frontend läuft auf: `http://localhost:5173`

### Für Produktion:

```bash
# Beide starten
npm run dev
```

## 3. Spielen

1. Öffne `http://localhost:5173` in einem Browser-Tab (Host)
2. Klicke "Raum erstellen" → "Spiel beitreten"
3. Du erhältst automatisch einen Raumcode (z.B. "ABC12")
4. Teile diesen Code mit Freunden oder öffne den Link in neuen Tabs
5. Alle Spieler verbinden sich und warten auf Mindestrundenzahl
6. Klicke alle auf "Bereit werden" - das Spiel startet!

## 4. Mehr Browser gleichzeitig testen

Öffne denselben Link in:
- Neuem Tab (Strg+T)
- Inkognito-Modus (Strg+Shift+N)
- Anderem Browser (Firefox, Safari)

Jeder Tab ist ein unabhängiger Spieler!

## 5. Spielregeln kurz

- **Verdeckte Karten**: Jeder hat eine Gegenstandskarte
- **Weitergeben**: Nach Weile wird die Karte weitergegeben
- **Bluff oder Wahrheit?** Du entscheidest, ob der Gegner lügt
- **Punkte**: Richtig erkannt = +1 Punkt
- **Gewinner**: Mehrste Punkte nach vorgegebener Rundenzahl!

## 6. Troubleshooting

**"Can't connect to server"**
→ Stelle sicher, dass der Server auf Port 4000 läuft

**"Room not found"**
→ Verbinde zuerst mit dem Spielbeitreten-Button

**Spiel startet nicht automatisch**
→ Warte auf alle Spieler (Min. 3) und klicke "Bereit werden"

## 7. Externe Freigabe

Für Freunde außerhalb des WLANs:

1. Installiere [ngrok](https://ngrok.com/)
2. Starte Tunnel für Frontend:
   ```bash
   ngrok http 5173
   ```
3. Teile die ngrok-URL (z.B. `https://abc12.ngrok.io`)

## 8. Server konfigurieren

Für andere Ports oder Einstellungen:

**server/.env:**
```env
PORT=8080
MIN_PLAYERS=3
MAX_PLAYERS=8
DEFAULT_ROUNDS=5
```

---

**Viel Spaß beim Bluffen! 🎭🎩**
