import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import {
    CardType,
    PropertySets,
    PropertyColor,
    ActionCards,
    MoneyCards,
    isSetComplete,
    calculateBankTotal
} from './constants.js';

// Helper Functions
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const buildDeck = () => {
    const deck = [];

    // Add Property Cards
    Object.values(PropertySets).forEach(set => {
        set.cards.forEach(card => {
            deck.push({
                ...card,
                type: CardType.PROPERTY,
                id: `${card.name}_${card.color}`,
            });
        });
    });

    // Add Action Cards
    Object.values(ActionCards).forEach(action => {
        for (let i = 0; i < action.quantity; i++) {
            deck.push({
                ...action,
                id: `${action.id}_${i}`,
            });
        }
    });

    // Add Money Cards
    MoneyCards.forEach(money => {
        for (let i = 0; i < money.quantity; i++) {
            deck.push({
                type: CardType.MONEY,
                value: money.value,
                id: `MONEY_${money.value}_${i}`,
            });
        }
    });

    return shuffleArray(deck);
};

const createPlayerState = () => ({
    hand: [],
    bank: [],
    properties: {
        [PropertyColor.PINK]: [],
        [PropertyColor.DARK_BLUE]: [],
        [PropertyColor.GREEN]: [],
        [PropertyColor.YELLOW]: [],
        [PropertyColor.RED]: [],
        [PropertyColor.BLACK]: [],
        [PropertyColor.LIGHT_GREEN]: [],
    },
});

// Check if player has won (3 complete sets)
const checkWinCondition = (player) => {
    let completeSets = 0;
    Object.entries(player.properties).forEach(([color, cards]) => {
        if (isSetComplete(cards, color)) {
            completeSets++;
        }
    });
    return completeSets >= 3;
};

export const DhandhoGame = {
    name: 'dhandho',

    setup: ({ ctx }) => {
        const deck = buildDeck();
        const players = {};
        const numPlayers = ctx.numPlayers || 2;

        // Initialize players (for 2-5 players)
        for (let i = 0; i < numPlayers; i++) {
            players[i] = createPlayerState();
            // Deal 5 cards to each player
            for (let j = 0; j < 5; j++) {
                players[i].hand.push(deck.pop());
            }
        }

        return {
            deck,
            discardPile: [],
            players,
            actionsRemaining: 3,
            pendingAction: null, // For actions that can be blocked
            debtOwed: {}, // { playerId: { amount, to: playerId } }
            birthdayPayments: {}, // { fromPlayerId: amount }
        };
    },

    minPlayers: 2,
    maxPlayers: 5,

    turn: {
        // FIX BUG #1: Dynamic turn order based on actual player count
        order: {
            first: () => 0,
            next: ({ ctx }) => (parseInt(ctx.currentPlayer) + 1) % ctx.numPlayers,
        },

        // Stage definitions for interactive cards
        stages: {
            // Vasooli Bhai - Select target
            selectDebtTarget: {
                moves: { selectDebtTarget },
            },
            // Vasooli Bhai / Shagun - Pay debt
            payingDebt: {
                moves: { payDebt, skipPayment },
            },
            // Shagun - Pay birthday
            payingBirthday: {
                moves: { payBirthday },
            },
            // Scam 1992 - Select property set to steal
            selectPropertySet: {
                moves: { selectSetToSteal },
            },
            // Jugaad - Select single property to steal
            selectSingleProperty: {
                moves: { selectPropertyToSteal },
            },
            // Adla Badli - Select properties to swap
            selectPropertiesForSwap: {
                moves: { selectPropertySwap },
            },
            // Just Say No - Respond to action
            respondToAction: {
                moves: { playJustSayNo, acceptAction },
            },
        },

        onBegin: ({ G, ctx }) => {
            if (!ctx || ctx.currentPlayer === undefined) {
                console.warn('ctx or ctx.currentPlayer is undefined in onBegin');
                return;
            }

            // Reset actions at start of turn
            G.actionsRemaining = 3;

            // Draw cards at start of turn (up to 2 cards)
            const player = G.players[ctx.currentPlayer];
            if (!player) {
                console.error('Player not found:', ctx.currentPlayer);
                return;
            }

            for (let i = 0; i < 2; i++) {
                if (G.deck.length > 0) {
                    player.hand.push(G.deck.pop());
                } else if (G.discardPile.length > 0) {
                    // Reshuffle discard pile into deck
                    G.deck = shuffleArray(G.discardPile);
                    G.discardPile = [];
                    if (G.deck.length > 0) {
                        player.hand.push(G.deck.pop());
                    }
                }
            }
        },

        onEnd: ({ G, ctx }) => {
            if (!ctx || ctx.currentPlayer === undefined) {
                console.warn('ctx or ctx.currentPlayer is undefined in onEnd');
                return;
            }

            const player = G.players[ctx.currentPlayer];
            if (!player) {
                console.error('Player not found:', ctx.currentPlayer);
                return;
            }

            // Reset actions counter
            G.actionsRemaining = 0;

            // Discard down to 7 cards at end of turn
            while (player.hand.length > 7) {
                G.discardPile.push(player.hand.pop());
            }

            // Check win condition
            if (checkWinCondition(player)) {
                ctx.events.endGame({ winner: ctx.currentPlayer });
            }
        },

        // Auto-end turn when actions run out
        endIf: ({ G }) => {
            if (G.actionsRemaining <= 0) {
                return true;
            }
        },
    },

    moves: {
        // Play a card as money to the bank
        playMoney: ({ G, ctx }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];

            if (G.actionsRemaining <= 0) return INVALID_MOVE;
            if (cardIndex < 0 || cardIndex >= player.hand.length) return INVALID_MOVE;

            const card = player.hand[cardIndex];
            player.bank.push(card);
            player.hand.splice(cardIndex, 1);
            G.actionsRemaining--;
        },

        // Play a property card
        playProperty: ({ G, ctx }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];

            if (G.actionsRemaining <= 0) return INVALID_MOVE;
            if (cardIndex < 0 || cardIndex >= player.hand.length) return INVALID_MOVE;

            const card = player.hand[cardIndex];
            if (card.type !== CardType.PROPERTY) return INVALID_MOVE;

            player.properties[card.color].push(card);
            player.hand.splice(cardIndex, 1);
            G.actionsRemaining--;
        },

        // Play an action card
        playAction: ({ G, ctx, events }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];

            if (G.actionsRemaining <= 0) return INVALID_MOVE;
            if (cardIndex < 0 || cardIndex >= player.hand.length) return INVALID_MOVE;

            const card = player.hand[cardIndex];
            if (card.type !== CardType.ACTION) return INVALID_MOVE;
            const baseCardId = card.id.split('_')[0];
            if (baseCardId === 'ABBA') return INVALID_MOVE;

            // Remove card and consume action
            player.hand.splice(cardIndex, 1);
            G.discardPile.push(card);
            G.actionsRemaining--;

            // Route to appropriate stage or immediate effect
            switch (baseCardId) { // Get base card ID without instance number
                case 'PASS':
                    // Draw 2 cards immediately
                    for (let i = 0; i < 2; i++) {
                        if (G.deck.length > 0) {
                            player.hand.push(G.deck.pop());
                        } else if (G.discardPile.length > 0) {
                            G.deck = shuffleArray(G.discardPile);
                            G.discardPile = [];
                            if (G.deck.length > 0) {
                                player.hand.push(G.deck.pop());
                            }
                        }
                    }
                    break;

                case 'VASOOLI':
                    // Debt Collector - ₹5Cr
                    const opponents = Object.keys(G.players).filter(p => p !== ctx.currentPlayer);
                    if (opponents.length === 0) break;

                    if (opponents.length === 1) {
                        // Auto-target single opponent for response
                        G.pendingAction = {
                            type: 'DEBT_COLLECTION',
                            amount: 5,
                            from: ctx.currentPlayer,
                            target: opponents[0],
                        };
                        events.setActivePlayers({
                            value: { [opponents[0]]: 'respondToAction' },
                            moveLimit: 1,
                        });
                    } else {
                        // Let current player select target
                        G.pendingAction = { type: 'DEBT_COLLECTION', amount: 5, from: ctx.currentPlayer };
                        events.setStage('selectDebtTarget');
                    }
                    break;

                case 'SHAGUN':
                    // Birthday - ₹2Cr from everyone
                    const allOpponents = Object.keys(G.players).filter(p => p !== ctx.currentPlayer);
                    if (allOpponents.length === 0) break;

                    // Initialize birthday payments tracker
                    G.birthdayPayments = {};
                    allOpponents.forEach(pid => {
                        G.birthdayPayments[pid] = false; // Track payment status per player
                    });
                    G.pendingAction = {
                        type: 'BIRTHDAY',
                        to: ctx.currentPlayer,
                        targets: [...allOpponents],
                    };

                    // Put all opponents in respond stage
                    const stageConfig = {};
                    allOpponents.forEach(pid => {
                        stageConfig[pid] = 'respondToAction';
                    });
                    events.setActivePlayers({
                        value: stageConfig,
                        moveLimit: 1,
                    });
                    break;

                case 'SCAM':
                    // Deal Breaker - Steal complete set
                    G.pendingAction = { type: 'SCAM', from: ctx.currentPlayer };
                    events.setStage('selectPropertySet');
                    break;

                case 'JUGAAD':
                    // Sly Deal - Steal single property
                    G.pendingAction = { type: 'JUGAAD', from: ctx.currentPlayer };
                    events.setStage('selectSingleProperty');
                    break;

                case 'ADLA':
                    // Forced Deal - Swap properties
                    G.pendingAction = { type: 'ADLA', from: ctx.currentPlayer };
                    events.setStage('selectPropertiesForSwap');
                    break;

                default:
                    break;
            }
        },

        // Manual end turn
        endTurn: ({ events }) => {
            events.endTurn();
        },
    },

    endIf: (G) => {
        // Check if any player has won
        for (let playerId in G.players) {
            if (checkWinCondition(G.players[playerId])) {
                return { winner: playerId };
            }
        }
    },
};

// ===== STAGE-SPECIFIC MOVES =====

// Vasooli Bhai: Select debt target
function selectDebtTarget({ G, ctx, events }, targetPlayerId) {
    if (!G.pendingAction || G.pendingAction.type !== 'DEBT_COLLECTION') {
        return INVALID_MOVE;
    }

    if (!G.players[targetPlayerId] || targetPlayerId === ctx.currentPlayer) {
        return INVALID_MOVE;
    }

    G.pendingAction.target = targetPlayerId;

    // Move target to respond stage
    events.setActivePlayers({
        value: { [targetPlayerId]: 'respondToAction' },
        moveLimit: 1,
    });

    // Return to main stage
    events.endStage();
}

// Pay debt (Vasooli Bhai)
function payDebt({ G, ctx, events }, cardIndices) {
    const playerId = ctx.currentPlayer;
    const debt = G.debtOwed[playerId];

    if (!debt) return INVALID_MOVE;

    const player = G.players[playerId];
    const collector = G.players[debt.to];
    let totalPaid = 0;
    const uniqueCardIndices = [...new Set(cardIndices || [])];

    for (const index of uniqueCardIndices) {
        if (!Number.isInteger(index) || index < 0 || index >= player.bank.length) {
            return INVALID_MOVE;
        }
    }

    // Transfer cards from bank
    uniqueCardIndices.forEach(index => {
        const card = player.bank[index];
        totalPaid += card.value || 0;
    });

    // Validate payment is enough
    if (totalPaid < debt.amount) {
        // Check if they have enough assets
        const bankTotal = calculateBankTotal(player.bank);
        if (bankTotal < debt.amount) {
            // Player doesn't have enough, take what they have
            totalPaid = 0;
            while (player.bank.length > 0) {
                const card = player.bank.pop();
                collector.bank.push(card);
                totalPaid += card.value || 0;
            }
        } else {
            return INVALID_MOVE; // They have enough, must pay properly
        }
    } else {
        // Remove cards in reverse order to avoid index shifting
        uniqueCardIndices.sort((a, b) => b - a).forEach(index => {
            const card = player.bank.splice(index, 1)[0];
            collector.bank.push(card);
        });
    }

    // Clear debt and end stage
    delete G.debtOwed[playerId];
    events.endStage();
}

// Skip payment (if no assets)
function skipPayment({ G, ctx, events }) {
    const playerId = ctx.currentPlayer;
    const player = G.players[playerId];

    // Only allowed if player has no bank cards
    if (player.bank.length > 0) return INVALID_MOVE;

    delete G.debtOwed[playerId];
    events.endStage();
}

// Pay birthday (Shagun)
function payBirthday({ G, ctx, events }, cardIndices) {
    const playerId = ctx.currentPlayer;
    if (!G.pendingAction || G.pendingAction.type !== 'BIRTHDAY') {
        return INVALID_MOVE;
    }

    const player = G.players[playerId];
    const birthdayPlayer = G.players[G.pendingAction.to];
    let totalPaid = 0;
    const uniqueCardIndices = [...new Set(cardIndices || [])];

    for (const index of uniqueCardIndices) {
        if (!Number.isInteger(index) || index < 0 || index >= player.bank.length) {
            return INVALID_MOVE;
        }
    }

    // Validate payment
    uniqueCardIndices.forEach(index => {
        totalPaid += player.bank[index].value || 0;
    });

    const required = 2;
    const bankTotal = calculateBankTotal(player.bank);

    if (totalPaid < required && bankTotal >= required) {
        return INVALID_MOVE; // Must pay full amount if they have it
    }

    // Transfer cards
    uniqueCardIndices.sort((a, b) => b - a).forEach(index => {
        const card = player.bank.splice(index, 1)[0];
        birthdayPlayer.bank.push(card);
    });

    // Record payment
    G.birthdayPayments[playerId] = true;

    // Check if all have paid
    const allPaid = Object.keys(G.birthdayPayments).every(pid =>
        G.birthdayPayments[pid] === true
    );

    if (allPaid) {
        G.pendingAction = null;
        G.birthdayPayments = {};
    }

    events.endStage();
}

// Scam 1992: Select set to steal
function selectSetToSteal({ G, ctx, events }, targetPlayerId, color) {
    if (!G.pendingAction || G.pendingAction.type !== 'SCAM') {
        return INVALID_MOVE;
    }

    if (!G.players[targetPlayerId] || targetPlayerId === ctx.currentPlayer) {
        return INVALID_MOVE;
    }

    const targetPlayer = G.players[targetPlayerId];
    const propertyCards = targetPlayer.properties[color];

    // Must be a complete set
    if (!isSetComplete(propertyCards, color)) {
        return INVALID_MOVE;
    }

    G.pendingAction = {
        ...G.pendingAction,
        target: targetPlayerId,
        color,
    };

    events.setActivePlayers({
        value: { [targetPlayerId]: 'respondToAction' },
        moveLimit: 1,
    });

    events.endStage();
}

// Jugaad: Select single property to steal
function selectPropertyToSteal({ G, ctx, events }, targetPlayerId, color, propertyIndex) {
    if (!G.pendingAction || G.pendingAction.type !== 'JUGAAD') {
        return INVALID_MOVE;
    }

    if (!G.players[targetPlayerId] || targetPlayerId === ctx.currentPlayer) {
        return INVALID_MOVE;
    }

    const targetPlayer = G.players[targetPlayerId];
    const propertyCards = targetPlayer.properties[color];

    if (!propertyCards || !propertyCards[propertyIndex]) {
        return INVALID_MOVE;
    }

    // Cannot steal from complete set
    if (isSetComplete(propertyCards, color)) {
        return INVALID_MOVE;
    }

    G.pendingAction = {
        ...G.pendingAction,
        target: targetPlayerId,
        color,
        propertyIndex,
    };

    events.setActivePlayers({
        value: { [targetPlayerId]: 'respondToAction' },
        moveLimit: 1,
    });

    events.endStage();
}

// Adla Badli: Swap properties
function selectPropertySwap({ G, ctx, events }, myColor, myIndex, targetPlayerId, theirColor, theirIndex) {
    if (!G.pendingAction || G.pendingAction.type !== 'ADLA') {
        return INVALID_MOVE;
    }

    const player = G.players[ctx.currentPlayer];
    const targetPlayer = G.players[targetPlayerId];

    if (!targetPlayer || targetPlayerId === ctx.currentPlayer) {
        return INVALID_MOVE;
    }

    const myProperty = player.properties[myColor]?.[myIndex];
    const theirProperty = targetPlayer.properties[theirColor]?.[theirIndex];

    if (!myProperty || !theirProperty) {
        return INVALID_MOVE;
    }

    // Neither property can be in a complete set
    if (isSetComplete(player.properties[myColor], myColor)) {
        return INVALID_MOVE;
    }
    if (isSetComplete(targetPlayer.properties[theirColor], theirColor)) {
        return INVALID_MOVE;
    }

    G.pendingAction = {
        ...G.pendingAction,
        target: targetPlayerId,
        myColor,
        myIndex,
        theirColor,
        theirIndex,
    };

    events.setActivePlayers({
        value: { [targetPlayerId]: 'respondToAction' },
        moveLimit: 1,
    });

    events.endStage();
}

// Just Say No: Block action
function playJustSayNo({ G, ctx, events }) {
    if (!G.pendingAction) return INVALID_MOVE;

    const targets = G.pendingAction.targets || [];
    const isTarget =
        G.pendingAction.target === ctx.currentPlayer ||
        targets.includes(ctx.currentPlayer);

    if (!isTarget) return INVALID_MOVE;

    if (G.pendingAction.type === 'BIRTHDAY') {
        G.birthdayPayments[ctx.currentPlayer] = true;
        G.pendingAction.targets = targets.filter(pid => pid !== ctx.currentPlayer);

        const allResolved = Object.keys(G.birthdayPayments).every(pid =>
            G.birthdayPayments[pid] === true
        );

        if (allResolved) {
            G.pendingAction = null;
            G.birthdayPayments = {};
        }
    } else {
        G.pendingAction = null;
    }

    events.endStage();
}

// Accept action
function acceptAction({ G, ctx, events }) {
    if (!G.pendingAction) return INVALID_MOVE;

    const targets = G.pendingAction.targets || [];
    const isTarget =
        G.pendingAction.target === ctx.currentPlayer ||
        targets.includes(ctx.currentPlayer);

    if (!isTarget) return INVALID_MOVE;

    switch (G.pendingAction.type) {
        case 'DEBT_COLLECTION': {
            G.debtOwed[ctx.currentPlayer] = {
                amount: G.pendingAction.amount,
                to: G.pendingAction.from,
            };
            G.pendingAction = null;
            events.setStage('payingDebt');
            return;
        }
        case 'BIRTHDAY': {
            G.pendingAction.targets = targets.filter(pid => pid !== ctx.currentPlayer);
            events.setStage('payingBirthday');
            return;
        }
        case 'SCAM': {
            const fromPlayer = G.players[G.pendingAction.from];
            const targetPlayer = G.players[G.pendingAction.target];
            const propertyCards = targetPlayer?.properties[G.pendingAction.color];

            if (!fromPlayer || !targetPlayer || !propertyCards) return INVALID_MOVE;
            if (!isSetComplete(propertyCards, G.pendingAction.color)) return INVALID_MOVE;

            fromPlayer.properties[G.pendingAction.color].push(...propertyCards);
            targetPlayer.properties[G.pendingAction.color] = [];
            G.pendingAction = null;
            events.endStage();
            return;
        }
        case 'JUGAAD': {
            const fromPlayer = G.players[G.pendingAction.from];
            const targetPlayer = G.players[G.pendingAction.target];
            const propertyCards = targetPlayer?.properties[G.pendingAction.color];
            const stolenCard = propertyCards?.[G.pendingAction.propertyIndex];

            if (!fromPlayer || !targetPlayer || !stolenCard) return INVALID_MOVE;
            if (isSetComplete(propertyCards, G.pendingAction.color)) return INVALID_MOVE;

            propertyCards.splice(G.pendingAction.propertyIndex, 1);
            fromPlayer.properties[stolenCard.color].push(stolenCard);
            G.pendingAction = null;
            events.endStage();
            return;
        }
        case 'ADLA': {
            const fromPlayer = G.players[G.pendingAction.from];
            const targetPlayer = G.players[G.pendingAction.target];
            const myProperty = fromPlayer?.properties[G.pendingAction.myColor]?.[G.pendingAction.myIndex];
            const theirProperty = targetPlayer?.properties[G.pendingAction.theirColor]?.[G.pendingAction.theirIndex];

            if (!fromPlayer || !targetPlayer || !myProperty || !theirProperty) return INVALID_MOVE;
            if (isSetComplete(fromPlayer.properties[G.pendingAction.myColor], G.pendingAction.myColor)) return INVALID_MOVE;
            if (isSetComplete(targetPlayer.properties[G.pendingAction.theirColor], G.pendingAction.theirColor)) {
                return INVALID_MOVE;
            }

            fromPlayer.properties[G.pendingAction.myColor].splice(G.pendingAction.myIndex, 1);
            targetPlayer.properties[G.pendingAction.theirColor].splice(G.pendingAction.theirIndex, 1);

            fromPlayer.properties[theirProperty.color].push(theirProperty);
            targetPlayer.properties[myProperty.color].push(myProperty);
            G.pendingAction = null;
            events.endStage();
            return;
        }
        default:
            return INVALID_MOVE;
    }
}
