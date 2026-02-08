import React from 'react';
import Card from './Card';

const PlayerZone = ({ player, isCurrentPlayer }) => {
    // --- BULLETPROOF SAFETY CHECKS ---

    // 1. If player doesn't exist, show loading
    if (!player) {
        return <div style={styles.container(false)}>Waiting for data...</div>;
    }

    // 2. Force Properties to be an Array
    // If it's undefined, null, or NOT an array, make it empty []
    let properties = player.properties;
    if (!Array.isArray(properties)) {
        properties = [];
    }

    // 3. Force Bank to be an Array
    let bank = player.bank;
    if (!Array.isArray(bank)) {
        bank = [];
    }

    // --- LOGIC ---

    // Group Properties by Color
    const groupedProps = {};
    properties.forEach(card => {
        // Safety check for card itself
        if (!card) return;

        const color = card.color || 'misc';
        if (!groupedProps[color]) groupedProps[color] = [];
        groupedProps[color].push(card);
    });

    return (
        <div style={styles.container(isCurrentPlayer)}>
            {/* HEADER */}
            <div style={styles.header}>
                <span style={styles.playerName}>
                    {isCurrentPlayer ? "YOU" : "OPPONENT"}
                </span>
                <div style={styles.bankSummary}>
                    💰 Bank: ₹{calculateBankTotal(bank)}M
                </div>
            </div>

            {/* ZONE 1: THE BANK */}
            <div style={styles.bankZone}>
                <span style={styles.zoneLabel}>BANK</span>
                <div style={styles.cardRow}>
                    {bank.length === 0 && <span style={styles.emptyText}>Empty Bank</span>}
                    {bank.map((card, i) => (
                        <div key={i} style={{ marginRight: '-100px', zIndex: i }}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ZONE 2: PROPERTIES */}
            <div style={styles.propertyZone}>
                <span style={styles.zoneLabel}>PROPERTIES</span>
                {properties.length === 0 && <span style={styles.emptyText}>No Properties Built</span>}

                <div style={styles.setsContainer}>
                    {Object.keys(groupedProps).map(color => (
                        <div key={color} style={styles.column}>
                            {groupedProps[color].map((card, i) => (
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
    if (!Array.isArray(bank)) return 0;
    return bank.reduce((total, card) => total + (card.value || 0), 0);
};

// --- STYLES ---
const styles = {
    container: (isMe) => ({
        padding: '10px',
        backgroundColor: isMe ? '#e6fffa' : '#fff5f5',
        borderRadius: '10px',
        marginBottom: '10px',
        border: isMe ? '2px solid #38b2ac' : '2px solid #fc8181',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
    }),
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '12px',
        textTransform: 'uppercase',
        color: '#4a5568',
    },
    playerName: {
        fontSize: '14px',
        fontWeight: '900',
    },
    bankSummary: {
        backgroundColor: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        fontSize: '12px',
    },
    bankZone: {
        marginBottom: '10px',
        padding: '5px',
        borderBottom: '1px dashed rgba(0,0,0,0.1)',
        minHeight: '80px',
    },
    cardRow: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '5px',
        overflowX: 'auto',
        minHeight: '100px',
    },
    propertyZone: {
        flex: 1,
        minHeight: '120px',
        position: 'relative',
    },
    setsContainer: {
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '10px',
        paddingLeft: '5px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '100px',
    },
    zoneLabel: {
        fontSize: '9px',
        color: '#a0aec0',
        fontWeight: 'bold',
        letterSpacing: '1px',
        marginBottom: '5px',
        display: 'block',
    },
    emptyText: {
        fontSize: '11px',
        color: '#cbd5e0',
        fontStyle: 'italic',
        padding: '10px',
    }
};

export default PlayerZone;