import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
// IMPORT SENSORS
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';

import { DhandhoGame } from './Game';
import Card from './components/Card';
import PlayerZone from './components/PlayerZone';
import { DraggableCard, DroppableZone } from './components/DragDropHelpers';

const DhandhoBoard = ({ ctx, G, moves, playerID }) => {
  const isMyTurn = ctx.currentPlayer === playerID;
  const myPlayer = G.players[playerID];
  const opponentID = playerID === '0' ? '1' : '0';
  const opponent = G.players[opponentID];
  const [activeDragCard, setActiveDragCard] = useState(null);

  // --- SENSOR SETUP (THE FIX) ---
  // This tells the browser: "If the user moves the mouse by 5 pixels, start dragging."
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement to start (prevents accidental clicks)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Press and hold for 250ms on mobile to drag (prevents scrolling issues)
        tolerance: 5,
      },
    })
  );

  if (!myPlayer || !opponent) return <div style={{ color: 'white', padding: 20 }}>Connecting...</div>;

  const handleDragStart = (event) => {
    const cardIndex = event.active.id;
    // Store the card data so the overlay looks correct
    setActiveDragCard(myPlayer.hand[cardIndex]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragCard(null);

    if (!over) return;

    // DEBUG: Alert to prove it works
    const cardName = myPlayer.hand[active.id]?.name || "Unknown Card";
    alert(`SUCCESS! You dropped ${cardName} onto ${over.id}`);

    // LOGIC PLACEHOLDER (We will add real moves next)
    /*
    if (over.id === 'zone-bank') moves.playMoney(active.id);
    if (over.id === 'zone-properties') moves.playProperty(active.id);
    if (over.id === 'zone-discard') moves.playAction(active.id);
    */
  };

  return (
    // PASS SENSORS HERE
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div style={styles.boardContainer}>

        {/* OPPONENT ZONE */}
        <div style={styles.section}>
          <PlayerZone player={opponent} isCurrentPlayer={false} />
        </div>

        {/* MIDDLE BAR */}
        <div style={styles.middleBar}>
          <div style={{ flex: 1 }}>
            <div style={styles.statusBadge(isMyTurn)}>
              {isMyTurn ? "🟢 YOUR TURN" : "🔴 OPPONENT"}
            </div>
          </div>

          {/* DISCARD ZONE */}
          <DroppableZone id="zone-discard" style={styles.discardZone}>
            <span style={{ textAlign: 'center' }}>🗑️<br />DISCARD</span>
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

          {/* DROP TARGETS */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <DroppableZone id="zone-bank" style={styles.dropTarget}>
              <span>💰 DROP MONEY</span>
            </DroppableZone>

            <DroppableZone id="zone-properties" style={styles.dropTarget}>
              <span>🏠 DROP PROPERTY</span>
            </DroppableZone>
          </div>

          <PlayerZone player={myPlayer} isCurrentPlayer={true} />

          {/* MY HAND */}
          <div style={styles.handContainer}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '14px' }}>MY HAND</h3>
            <div style={styles.cardList}>
              {myPlayer.hand.map((card, index) => (
                // We use a div wrapper to handle spacing
                <div key={index} style={{ marginRight: '-60px', position: 'relative' }}>
                  <DraggableCard id={index} disabled={!isMyTurn}>
                    <Card card={card} />
                  </DraggableCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DRAG OVERLAY */}
        <DragOverlay>
          {activeDragCard ? (
            <div style={{ transform: 'scale(1.1)' }}>
              <Card card={activeDragCard} />
            </div>
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
};

// --- STYLES ---
const styles = {
  boardContainer: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2d3748',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    touchAction: 'none',
    overflow: 'hidden', // Prevent scrolling drag issues
  },
  section: {},
  middleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    gap: '10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  discardZone: {
    width: '100px',
    height: '70px',
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
    transition: 'all 0.2s',
  },
  statusBadge: (active) => ({
    padding: '8px 10px',
    borderRadius: '20px',
    backgroundColor: active ? '#48bb78' : '#f56565',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '11px',
    textAlign: 'center',
    border: '1px solid white',
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
    minHeight: '250px',
  },
  cardList: {
    display: 'flex',
    paddingBottom: '20px',
    paddingLeft: '10px',
    minHeight: '220px',
    alignItems: 'center',
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