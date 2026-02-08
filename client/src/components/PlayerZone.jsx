import React from 'react';
import Card from './Card';

const PlayerZone = ({ player, isCurrentPlayer }) => {
    // 1. Group Properties by Color (e.g., all Red cards together)
    const properties = player.properties || [];
    const groupedProps = {};

    properties.forEach(card => {
        const color = card.color || 'misc';
        if (!groupedProps[color]) groupedProps[color] = [];
        groupedProps[color].push(card);
    });

    return (
        <div style={styles.container(isCurrentPlayer)}>
            {/* HEADER: Name & Money Count */}
            <div style={styles.header}>
                <span style={styles.playerName}>
                    {isCurrentPlayer ? "YOU" : "OPPONENT"}
                </span>
                <div style={styles.bankSummary}>
                    💰 Bank: ₹{calculateBankTotal(player.bank)}M
                </div>
            </div>

            {/* ZONE 1: THE BANK (Money Cards) */}
            <div style={styles.bankZone}>
                <span style={styles.zoneLabel}>BANK</span>
                <div style={styles.cardRow}>
                    {player.bank.map((card, i) => (
                        // Small overlap for bank cards to save space
                        <div key={i} style={{ marginRight: '-100px', zIndex: i }}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ZONE 2: PROPERTIES (Grouped by Color) */}
            <div style={styles.propertyZone}>
                <span style={styles.zoneLabel}>PROPERTIES</span>
                <div style={styles.setsContainer}>
                    {Object.keys(groupedProps).map(color => (
                        <div key={color} style={styles.column}>
                            {groupedProps[color].map((card, i) => (
                                // Stack cards vertically (margin-top: -160px)
                                <div key={i} style={{ marginTop: i > 0 ? '-160px' : '0', zIndex: i }}>
                                    <Card card={card} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper: Count total money
const calculateBankTotal = (bank) => {
    return bank.reduce((total, card) => total + (card.value || 0), 0);
};

const styles = {
    container: (isMe) => ({
        padding: '10px',
        backgroundColor: isMe ? '#e6fffa' : '#fff5f5', // Green tint for me, Red for opponent
        borderRadius: '10px',
        marginBottom: '20px',
        border: isMe ? '2px solid #38b2ac' : '2px solid #fc8181',
        minHeight: '200px',
    }),
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    playerName: {
        fontSize: '18px',
        textTransform: 'uppercase',
    },
    bankSummary: {
        backgroundColor: '#fff',
        padding: '4px 8px',
        borderRadius: '5px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    bankZone: {
        marginBottom: '15px',
        padding: '5px',
        borderBottom: '1px dashed #ccc',
        overflowX: 'auto',
    },
    cardRow: {
        display: 'flex',
        paddingBottom: '10px',
        minHeight: '220px', // Height of one card
    },
    propertyZone: {
        minHeight: '250px',
    },
    setsContainer: {
        display: 'flex',
        gap: '15px',
        overflowX: 'auto',
        paddingBottom: '20px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '140px', // Width of one card
    },
    zoneLabel: {
        fontSize: '10px',
        color: '#718096',
        fontWeight: 'bold',
        letterSpacing: '1px',
        marginBottom: '5px',
        display: 'block',
    }
};

export default PlayerZone;