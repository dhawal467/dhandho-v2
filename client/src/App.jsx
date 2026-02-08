import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DhandhoGame } from './Game';

// A simple board just to prove it works
const TestBoard = ({ ctx, moves }) => (
  <div style={{ padding: 50, textAlign: 'center' }}>
    <h1>Dhandho V2: Connection Successful</h1>
    <p>Player: {ctx.currentPlayer}</p>
    <button onClick={() => moves.DrawCard()} style={{ fontSize: 20, padding: 20 }}>
      DRAW CARD
    </button>
  </div>
);

// DETECT ENVIRONMENT AUTOMATICALLY
// If we are on localhost, use localhost:8000
// If we are on Vercel, use the Render URL
const { protocol, hostname } = window.location;
const SERVER_URL = hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://dhandho-v2-server.onrender.com'; // <--- WE WILL CREATE THIS URL NEXT

const DhandhoClient = Client({
  game: DhandhoGame,
  board: TestBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: true,
});

export default DhandhoClient;