import React from 'react';

// --- 1. CONFIGURATION ---
const CARD_STYLES = {
    // Standard Keys
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

    // Types
    action: { bg: '#FF4500', icon: '⚡', name: 'Action' },
    money: { bg: '#85bb65', icon: '💰', name: 'Cash' },
    wildcard: { bg: '#9932CC', icon: '🌈', name: 'Wildcard' }
};

// ALIAS MAP: Connects your DB color names to our Style Keys
const COLOR_MAP = {
    'darkblue': 'blue',
    'dark blue': 'blue',
    'black': 'railroad',
    'station': 'railroad',
    'light blue': 'lightblue',
    'water': 'utility',
    'electric': 'utility',
};

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

    // --- NORMALIZE COLOR ---
    let rawColor = (card.color || '').toLowerCase();
    // Check if we need to translate 'darkblue' to 'blue'
    const normalizedColor = COLOR_MAP[rawColor] || rawColor;

    if (!displayName) return <div style={styles.errorCard}>ERROR</div>;

    // --- STYLE SELECTION ---
    let style = CARD_STYLES[normalizedColor] || CARD_STYLES.action;
    if (safeType === 'MONEY') style = CARD_STYLES.money;

    // Specific Action Icons
    if (displayName === 'Deal Breaker') style = { ...style, icon: '💔', bg: '#800080' };
    if (displayName === 'Just Say No') style = { ...style, icon: '🛑', bg: '#B22222' };
    if (displayName === 'Sly Deal') style = { ...style, icon: '🥷', bg: '#4B0082' };
    if (displayName === 'Forced Deal') style = { ...style, icon: '🤝', bg: '#A52A2A' };
    if (displayName === 'Debt Collector') style = { ...style, icon: '🤑', bg: '#556B2F' };
    if (displayName === 'It\'s My Birthday') style = { ...style, icon: '🎂', bg: '#FF1493' };

    const priceTag = card.value ? `₹${card.value}` : 'FREE';

    return (
        <div style={styles.cardContainer}>
            <div style={styles.priceTag}>{priceTag}</div>

            <div style={{ ...styles.header, backgroundColor: style.bg }}>
                <span style={styles.headerText}>{displayName.toUpperCase()}</span>
            </div>

            <div style={styles.artContainer}>
                <div style={styles.emoji}>{style.icon}</div>
            </div>

            {/* RENT TABLE - Uses Normalized Color */}
            {safeType === 'PROPERTY' && RENT_TABLE[normalizedColor] && (
                <div style={styles.rentContainer}>
                    {RENT_TABLE[normalizedColor].map((rent, i) => (
                        <div key={i} style={styles.rentRow}>
                            <span style={styles.rentLabel}>{i + 1} House</span>
                            <strong style={styles.rentValue}>₹{rent}</strong>
                        </div>
                    ))}
                </div>
            )}

            {safeType === 'ACTION' && (
                <div style={styles.actionText}>
                    {getActionDescription(displayName)}
                </div>
            )}
        </div>
    );
};

const getActionDescription = (name) => {
    // ... (Same list as before)
    return 'Play to use effect.';
};

// --- COMPACT CSS ---
const styles = {
    cardContainer: {
        width: '140px',
        height: '210px',
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
    errorCard: {
        width: '140px',
        height: '210px',
        backgroundColor: '#eee',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red',
        fontWeight: 'bold'
    },
    header: {
        height: '32px', // Slightly smaller header
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
    },
    headerText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: '10px', // Smaller text to prevent wrapping
        letterSpacing: '0.5px',
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        textAlign: 'center',
        whiteSpace: 'nowrap', // Force single line
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0 5px',
    },
    priceTag: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        backgroundColor: '#fff',
        color: '#333',
        fontWeight: '900',
        fontSize: '12px',
        padding: '2px',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
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
        minHeight: '60px', // Prevent squishing
    },
    emoji: {
        fontSize: '45px', // Slightly smaller icon
        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))',
    },
    rentContainer: {
        padding: '6px 8px', // Tighter padding
        backgroundColor: '#fff',
        borderTop: '2px solid #eee',
        fontSize: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: 'auto', // Let it grow/shrink naturally
    },
    rentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2px', // Tighter rows
        borderBottom: '1px dotted #eee',
    },
    rentLabel: {
        color: '#555',
        fontSize: '10px',
        fontWeight: 'bold',
    },
    rentValue: {
        color: '#000',
        fontSize: '11px',
        fontWeight: '900',
    },
    actionText: {
        padding: '8px',
        fontSize: '11px',
        color: '#444',
        textAlign: 'center',
        fontWeight: '500',
        backgroundColor: '#fff',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.3',
    }
};

export default Card;