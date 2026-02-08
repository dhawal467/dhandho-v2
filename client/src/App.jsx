import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DhandhoGame } from './Game';
import Card from './components/Card';
import PlayerZone from './components/PlayerZone'; // <--- IMPORT NEW COMPONENT

const DhandhoBoard = ({ ctx, G, moves, playerID }) => {
  const isMyTurn = ctx.currentPlayer === playerID;
  const myPlayerID = playerID;
  const opponentID = playerID === '0' ? '1' : '0';

  // Get Player Objects (Safety Check)
  const myPlayer = G.players[myPlayerID];
  const opponent = G.players[opponentID];

  if (!myPlayer || !opponent) return <div>Connecting to Match...</div>;

  return (
    <div style={styles.boardContainer}>

      {/* --- TOP: OPPONENT'S AREA --- */}
      <div style={styles.section}>
        <PlayerZone player={opponent} isCurrentPlayer={false} />
      </div>

      {/* --- MIDDLE: GAME INFO --- */}
      <div style={styles.middleBar}>
        <div style={styles.statusBadge(isMyTurn)}>
          {isMyTurn ? "🟢 YOUR TURN" : "🔴 OPPONENT'S TURN"}
        </div>
        <button
          onClick={() => moves.endTurn()}
          disabled={!isMyTurn}
          style={styles.button(isMyTurn)}
        >
          END TURN
        </button>
      </div>

      {/* --- BOTTOM: MY AREA --- */}
      <div style={styles.section}>
        <PlayerZone player={myPlayer} isCurrentPlayer={true} />

        {/* MY HAND (Separate from Played Cards) */}
        <div style={styles.handContainer}>
          <h3 style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            MY HAND
          </h3>
          <div style={styles.cardList}>
            {myPlayer.hand.map((card, index) => (
              <div key={index} style={{ marginRight: '-60px', transition: 'transform 0.2s' }}>
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

const styles = {
  boardContainer: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2d3748', // Dark Table Background
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  section: {
    // Flex creates space for zones
  },
  middleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  statusBadge: (active) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: active ? '#48bb78' : '#f56565',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }),
  button: (active) => ({
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: active ? '#ecc94b' : '#a0aec0',
    color: active ? '#000' : '#4a5568',
    border: 'none',
    borderRadius: '6px',
    cursor: active ? 'pointer' : 'not-allowed',
    boxShadow: active ? '0 4px 0 #d69e2e' : 'none',
  }),
  handContainer: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    overflowX: 'auto',
  },
  cardList: {
    display: 'flex',
    paddingBottom: '10px',
    paddingLeft: '10px',
    minHeight: '220px',
  }
};

const { hostname } = window.location;
const SERVER_URL = hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://dhandho-v2-server.onrender.com';

const GameClient = Client({
  game: DhandhoGame,
  board: DhandhoBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false, // Turn off debug panel to see full UI
});

const App = () => (
  <GameClient matchID="default" playerID="0" />
);

export default App;