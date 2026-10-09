import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GameApp from './components/Game.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <GameApp />
  </StrictMode>
);
