import React from 'react';

// --- 1. CONFIGURATION ---
const CARD_STYLES = {
    // Property Colors
    brown: { bg: '#8B4513', icon: '🛖', name: 'Brown Set' },
    lightblue: { bg: '#87CEEB', icon: '🥥', name: 'Light Blue' },
    pink: { bg: '#FF69B4', icon: '🎀', name: 'Pink Set' },
    orange: { bg: '#FFA500', icon: '🚦', name: 'Orange Set' },
    red: { bg: '#DC143C', icon: '🏯', name: 'Red Set' },
    yellow: { bg: '#FFD700', icon: '💻', name: 'Yellow Set' },
    green: { bg: '#228B22', icon: '🌳', name: 'Green Set' },
    blue: { bg: '#00008B', icon: '💎', name: 'Blue Set' },
    railroad: { bg: '#000000', icon: '🚂', name: 'Railroad' },
    utility: { bg: '#A9A9A9', icon: '⚡', name: 'Utility' },

    // Special Types
    action: { bg: '#FF4500', icon: '⚡', name: 'Action' },
    money: { bg: '#85bb65', icon: '💰', name: 'Cash' },
    wildcard: { bg: '#9932CC', icon: '🌈', name: 'Wildcard' }
};

// VERIFIED RENT VALUES (Standard Monopoly Deal)
const RENT_TABLE = {
    brown: ['1M', '2M'],
    lightblue: ['1M', '2M', '3M'],
    pink: ['1M', '2M', '4M'],
    orange: ['1M', '3M', '5M'],
    red: ['2M', '3M', '6M'],
    yellow: ['2M', '4M', '6M'],
    green: ['2M', '4M', '7M'],
    blue: ['3M', '8M'],
    railroad: ['1M', '2M', '3M', '4M'],
    utility: ['1M', '2M'],
};

const Card = ({ card }) => {
    // --- DATA CLEANUP ---
    const safeType = (card.type || '').toUpperCase();
    let displayName = card.name;
    if (!displayName && safeType === 'MONEY') displayName = "CASH";

    // --- SAFETY CHECK ---
    if (!displayName) {
        return (
            <div style={{ ...styles.cardContainer, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ color: 'red', fontWeight: 'bold' }}>ERROR</span>
            </div>
        );
    }

    // --- STYLE SELECTION ---
    let style = CARD_STYLES[card.color] || CARD_STYLES.action;
    if (safeType === 'MONEY') style = CARD_STYLES.money;

    // Specific Action Card Icons
    if (displayName === 'Deal Breaker') style = { ...style, icon: '💔', bg: '#800080' };
    if (displayName === 'Just Say No') style = { ...style, icon: '🛑', bg: '#B22222' };
    if (displayName === 'Sly Deal') style = { ...style, icon: '🥷', bg: '#4B0082' };
    if (displayName === 'Forced Deal') style = { ...style, icon: '🤝', bg: '#A52A2A' };
    if (displayName === 'Debt Collector') style = { ...style, icon: '🤑', bg: '#556B2F' };
    if (displayName === 'It\'s My Birthday') style = { ...style, icon: '🎂', bg: '#FF1493' };

    // Price Tag (No 'M', just the symbol and number)
    const priceTag = card.value ? `₹${card.value}` : 'FREE';

    return (
        <div style={styles.cardContainer}>
            <div style={styles.priceTag}>{priceTag}</div>

            {/* HEADER */}
            <div style={{ ...styles.header, backgroundColor: style.bg }}>
                <span style={styles.headerText}>{displayName.toUpperCase()}</span>
            </div>

            {/* ICON */}
            <div style={styles.artContainer}>
                <div style={styles.emoji}>{style.icon}</div>
            </div>

            {/* RENT TABLE (Bold & Clear) */}
            {safeType === 'PROPERTY' && RENT_TABLE[card.color] && (
                <div style={styles.rentContainer}>
                    {RENT_TABLE[card.color].map((rent, i) => (
                        <div key={i} style={styles.rentRow}>
                            {/* Left Side: Number of Houses */}
                            <span style={styles.rentLabel}>{i + 1}</span>
                            {/* Right Side: Price (BOLDER) */}
                            <strong style={styles.rentValue}>₹{rent}</strong>
                        </div>
                    ))}
                </div>
            )}

            {/* ACTION TEXT */}
            {safeType === 'ACTION' && (
                <div style={styles.actionText}>
                    {getActionDescription(displayName)}
                </div>
            )}
        </div>
    );
};

const getActionDescription = (name) => {
    const desc = {
        'Deal Breaker': 'Steal a complete set.',
        'Just Say No': 'Cancel any action.',
        'Sly Deal': 'Steal a single property.',
        'Forced Deal': 'Swap properties.',
        'Debt Collector': 'Force player to pay 5M.',
        'It\'s My Birthday': 'All players pay 2M.',
        'Pass Go': 'Draw 2 extra cards.',
        'Double The Rent': 'Double rent price.',
        'House': 'Add 3M to rent.',
        'Hotel': 'Add 4M to rent.',
    };
    return desc[name] || 'Play to use effect.';
};

const styles = {
    cardContainer: {
        width: '140px',
        height: '210px', // Slightly taller to fit rent list comfortably
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Roboto", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        flexShrink: 0,
        marginRight: '10px',
    },
    header: {
        height: '35px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Centered text looks better
        borderBottom: '1px solid rgba(0,0,0,0.1)',
    },
    headerText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: '11px',
        letterSpacing: '0.5px',
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        textAlign: 'center',
    },
    priceTag: {
        position: 'absolute',
        top: '6px',
        right: '6px',
        backgroundColor: '#fff',
        color: '#333',
        fontWeight: '900', // Extra Bold
        fontSize: '14px',  // Slightly Larger
        padding: '2px 6px',
        borderRadius: '50%', // Circular look
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        zIndex: 10,
        border: '2px solid #333',
    },
    artContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    emoji: {
        fontSize: '55px',
        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))',
    },
    rentContainer: {
        padding: '8px 12px',
        backgroundColor: '#fff',
        borderTop: '2px solid #eee',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: '60px',
    },
    rentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3px',
        borderBottom: '1px dotted #eee',
    },
    rentLabel: {
        color: '#555',
        fontSize: '11px',
        fontWeight: 'bold',
    },
    rentValue: {
        color: '#000',
        fontSize: '13px', // Larger Value
        fontWeight: '900', // Max Boldness
    },
    actionText: {
        padding: '10px',
        fontSize: '12px',
        color: '#444',
        textAlign: 'center',
        fontWeight: '500',
        backgroundColor: '#fff',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.4',
    }
};

export default Card;