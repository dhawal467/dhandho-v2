import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DhandhoGame } from './Game';

// 1. The Game Board
const TestBoard = ({ ctx, G, moves, playerID }) => {
  // Visual check: Are we Player 0?
  const isMyTurn = ctx.currentPlayer === playerID;

  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1>Dhandho V2: Connected</h1>

      <div style={{ margin: '20px 0', padding: '20px', background: '#f0f0f0' }}>
        <p><strong>My Player ID:</strong> {playerID} (If this is null, you are a spectator)</p>
        <p><strong>Current Turn:</strong> Player {ctx.currentPlayer}</p>
        <p><strong>Status:</strong> {isMyTurn ? "🟢 IT IS YOUR TURN" : "🔴 WAITING FOR OPPONENT"}</p>
      </div>

      <button
        onClick={() => moves.endTurn()}
        disabled={!isMyTurn} // Disable button if it's not our turn
        style={{
          fontSize: 20,
          padding: '15px 30px',
          cursor: isMyTurn ? 'pointer' : 'not-allowed',
          opacity: isMyTurn ? 1 : 0.5
        }}
      >
        END TURN
      </button>
    </div>
  );
};

// 2. The Connection Setup
const { hostname } = window.location;
// IMPORTANT: Verify this URL matches your Render dashboard exactly
const SERVER_URL = hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://dhandho-v2-server.onrender.com';

const GameClient = Client({
  game: DhandhoGame,
  board: TestBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: true, // Shows the sidebar for debugging
});

// 3. The App Component (FORCE PLAYER ID 0)
const App = () => (
  <GameClient
    matchID="default"
    playerID="0"
  />
);

export default App;