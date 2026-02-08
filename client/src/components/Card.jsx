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
    wildcard: { bg: '#9932CC', icon: '🌈', name: 'Wildcard' } // Added just in case
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
    railroad: ['1M', '2M', '4M', '8M'],
    utility: ['1M', '2M'],
};

const Card = ({ card }) => {
    // --- 1. DATA NORMALIZATION (The Fix) ---

    // Convert type to uppercase to be safe (MONEY vs money)
    const safeType = (card.type || '').toUpperCase();

    // If Name is missing but it's Money, call it "CASH"
    let displayName = card.name;
    if (!displayName && safeType === 'MONEY') {
        displayName = "CASH";
    }

    // --- 2. SAFETY CHECK ---
    // If it's still missing a name after our fix, THEN it's corrupt.
    if (!displayName) {
        console.error("⚠️ CORRUPT CARD DETECTED:", card);
        return (
            <div style={{ ...styles.cardContainer, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ color: 'red', fontWeight: 'bold', fontSize: '10px' }}>ERROR<br />{card.id}</span>
            </div>
        );
    }

    // --- 3. STYLE SELECTION ---
    // Default to Action style if color is unknown
    let style = CARD_STYLES[card.color] || CARD_STYLES.action;

    // OVERRIDES based on Type
    if (safeType === 'MONEY') style = CARD_STYLES.money;

    // OVERRIDES based on Name (Specific Action Cards)
    if (displayName === 'Deal Breaker') style = { ...style, icon: '💔', bg: '#800080' };
    if (displayName === 'Just Say No') style = { ...style, icon: '🛑', bg: '#B22222' };
    if (displayName === 'Sly Deal') style = { ...style, icon: '🥷', bg: '#4B0082' };
    if (displayName === 'Forced Deal') style = { ...style, icon: '🤝', bg: '#A52A2A' };

    // Format Price
    const priceTag = card.value ? `₹${card.value}M` : 'FREE';

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

            {/* RENT TABLE (Properties Only) */}
            {safeType === 'PROPERTY' && RENT_TABLE[card.color] && (
                <div style={styles.rentContainer}>
                    {RENT_TABLE[card.color].map((rent, i) => (
                        <div key={i} style={styles.rentRow}>
                            <span style={{ color: '#666' }}>{i + 1} House:</span>
                            <strong>{rent}</strong>
                        </div>
                    ))}
                </div>
            )}

            {/* ACTION DESCRIPTION */}
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
        height: '200px',
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
        marginRight: '10px', // Spacing between cards
    },
    header: {
        height: '35px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
    },
    headerText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: '11px',
        letterSpacing: '0.5px',
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
    },
    priceTag: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: '#fff',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '12px',
        padding: '2px 6px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10,
        border: '1px solid #ccc',
    },
    artContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    emoji: {
        fontSize: '50px',
        textShadow: '0 4px 4px rgba(0,0,0,0.1)',
    },
    rentContainer: {
        padding: '8px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        fontSize: '10px',
    },
    rentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2px',
    },
    actionText: {
        padding: '10px',
        fontSize: '11px',
        color: '#555',
        textAlign: 'center',
        fontStyle: 'italic',
        backgroundColor: '#fff',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

export default Card;