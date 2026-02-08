import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DhandhoGame } from './Game';
import Card from './components/Card'; // <--- IMPORT YOUR NEW COMPONENT

// 1. The Visual Game Board
const DhandhoBoard = ({ ctx, G, moves, playerID }) => {
  const isMyTurn = ctx.currentPlayer === playerID;
  const myPlayer = G.players[playerID]; // Get my specific data

  // Safety Check: If we are a spectator or loading, don't crash
  if (!myPlayer) return <div>Spectating...</div>;

  return (
    <div style={styles.boardContainer}>
      {/* HEADER: Game Status */}
      <div style={styles.header}>
        <h1>Dhandho V2</h1>
        <div style={styles.statusBadge(isMyTurn)}>
          {isMyTurn ? "🟢 YOUR TURN" : `🔴 Player ${ctx.currentPlayer}'s Turn`}
        </div>
      </div>

      {/* ACTION BAR: Buttons */}
      <div style={styles.actionBar}>
        <button
          onClick={() => moves.endTurn()}
          disabled={!isMyTurn}
          style={styles.button(isMyTurn)}
        >
          END TURN
        </button>
      </div>

      {/* GAME AREA: My Hand */}
      <div style={styles.handContainer}>
        <h3>My Hand ({myPlayer.hand.length} Cards)</h3>

        {/* THE NEW PART: Render Card Components instead of text */}
        <div style={styles.cardList}>
          {myPlayer.hand.map((card, index) => (
            // We pass the card data into your new component
            <Card key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Simple Styles for the Board Layout
const styles = {
  boardContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  statusBadge: (active) => ({
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: active ? '#e6fffa' : '#fff5f5',
    color: active ? '#2c7a7b' : '#c53030',
    fontWeight: 'bold',
    border: `1px solid ${active ? '#2c7a7b' : '#c53030'}`,
  }),
  actionBar: {
    marginBottom: '30px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  button: (active) => ({
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: active ? '#3182ce' : '#cbd5e0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: active ? 'pointer' : 'not-allowed',
  }),
  handContainer: {
    marginTop: '20px',
  },
  cardList: {
    display: 'flex',
    gap: '10px',        // Space between cards
    overflowX: 'auto',  // Scroll sideways if hand is full
    paddingBottom: '20px', // Space for scrollbar
    alignItems: 'center',
  }
};

// 3. Connection Setup (Same as before)
const { hostname } = window.location;
const SERVER_URL = hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://dhandho-v2-server.onrender.com'; // <--- CHECK THIS URL MATCHES YOURS

const GameClient = Client({
  game: DhandhoGame,
  board: DhandhoBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: true,
});

const App = () => (
  <GameClient matchID="default" playerID="0" />
);

export default App;