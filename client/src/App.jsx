import React, { useState } from 'react'; // Added useState
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DndContext, DragOverlay } from '@dnd-kit/core'; // Import DndContext
import { DhandhoGame } from './Game';
import Card from './components/Card';
import PlayerZone from './components/PlayerZone';
import { DraggableCard, DroppableZone } from './components/DragDropHelpers'; // Import our new helpers

const DhandhoBoard = ({ ctx, G, moves, playerID }) => {
  const isMyTurn = ctx.currentPlayer === playerID;
  const myPlayer = G.players[playerID];
  const opponentID = playerID === '0' ? '1' : '0';
  const opponent = G.players[opponentID];

  // State to track which card is currently being dragged (for visual overlay)
  const [activeDragCard, setActiveDragCard] = useState(null);

  if (!myPlayer || !opponent) return <div>Connecting...</div>;

  // --- DRAG END HANDLER (The Brain) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragCard(null); // Stop tracking drag

    // If we dropped it nowhere, cancel
    if (!over) return;

    console.log(`DROPPED Card ${active.id} onto Zone ${over.id}`);

    // LOGIC: Check which zone we dropped onto
    if (over.id === 'zone-bank') {
      // Logic to Play Money will go here later
      // moves.playMoney(active.id); 
      alert(`You tried to play card index ${active.id} into BANK`);
    }
    else if (over.id === 'zone-properties') {
      // Logic to Play Property will go here later
      // moves.playProperty(active.id);
      alert(`You tried to play card index ${active.id} into PROPERTIES`);
    }
    else if (over.id === 'zone-discard') {
      alert(`You tried to play card index ${active.id} into DISCARD`);
    }
  };

  const handleDragStart = (event) => {
    // Find the actual card object based on the Index ID
    const cardIndex = event.active.id;
    const cardObj = myPlayer.hand[cardIndex];
    setActiveDragCard(cardObj);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div style={styles.boardContainer}>

        {/* OPPONENT ZONE */}
        <div style={styles.section}>
          <PlayerZone player={opponent} isCurrentPlayer={false} />
        </div>

        {/* MIDDLE: DISCARD & DECK */}
        <div style={styles.middleBar}>
          <div style={{ flex: 1 }}>
            <div style={styles.statusBadge(isMyTurn)}>
              {isMyTurn ? "🟢 YOUR TURN" : "🔴 OPPONENT"}
            </div>
          </div>

          {/* ACTION / DISCARD ZONE (Droppable) */}
          <DroppableZone id="zone-discard" style={styles.discardZone}>
            <span>🗑️ DISCARD / ACTION</span>
          </DroppableZone>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => moves.endTurn()}
              disabled={!isMyTurn}
              style={styles.button(isMyTurn)}
            >
              END TURN
            </button>
          </div>
        </div>

        {/* MY ZONE */}
        <div style={styles.section}>
          {/* We wrap the PlayerZone in Droppable areas in the next step. 
              For now, let's create explicit Drop Targets above your hand. */}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            {/* BANK DROP ZONE */}
            <DroppableZone id="zone-bank" style={styles.dropTarget}>
              <span>💰 DROP MONEY HERE</span>
            </DroppableZone>

            {/* PROPERTY DROP ZONE */}
            <DroppableZone id="zone-properties" style={styles.dropTarget}>
              <span>🏠 DROP PROPERTIES HERE</span>
            </DroppableZone>
          </div>

          <PlayerZone player={myPlayer} isCurrentPlayer={true} />

          {/* MY HAND (Draggable) */}
          <div style={styles.handContainer}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>MY HAND</h3>
            <div style={styles.cardList}>
              {myPlayer.hand.map((card, index) => (
                <div key={index} style={{ marginRight: '-60px' }}>
                  {/* WRAP CARD IN DRAGGABLE */}
                  <DraggableCard id={index} disabled={!isMyTurn}>
                    <Card card={card} />
                  </DraggableCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DRAG OVERLAY: Shows a copy of the card while dragging */}
        <DragOverlay>
          {activeDragCard ? <Card card={activeDragCard} /> : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
};

// ... STYLES (Keep your existing styles, add these new ones) ...
const styles = {
  // ... (Paste your old styles here or keep them) ...
  boardContainer: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2d3748',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    touchAction: 'none', // Prevents scrolling while dragging on mobile
  },
  section: {},
  middleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    gap: '10px',
  },
  discardZone: {
    width: '120px',
    height: '60px',
    border: '2px dashed #a0aec0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0aec0',
    fontSize: '10px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dropTarget: {
    flex: 1,
    height: '60px',
    border: '2px dashed #48bb78',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#48bb78',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
  },
  statusBadge: (active) => ({
    padding: '8px 10px',
    borderRadius: '20px',
    backgroundColor: active ? '#48bb78' : '#f56565',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'center',
  }),
  button: (active) => ({
    padding: '10px 15px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: active ? '#ecc94b' : '#a0aec0',
    color: active ? '#000' : '#4a5568',
    border: 'none',
    borderRadius: '6px',
    cursor: active ? 'pointer' : 'not-allowed',
  }),
  handContainer: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    overflowX: 'auto',
    minHeight: '240px', // Increased height for drag space
  },
  cardList: {
    display: 'flex',
    paddingBottom: '20px',
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
  debug: false,
});

const App = () => (
  <GameClient matchID="default" playerID="0" />
);

export default App;