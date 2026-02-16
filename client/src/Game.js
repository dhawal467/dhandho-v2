// client/src/Game.js

export const DhandhoGame = {
    name: 'dhandho',

    // 1. SETUP: Initialize the state correctly
    setup: (ctx) => ({
        deck: [
            { id: 'mumbai', name: 'Mumbai', type: 'PROPERTY', color: 'green', value: 4 },
            { id: 'delhi', name: 'Delhi', type: 'PROPERTY', color: 'red', value: 3 },
            { id: 'bangalore', name: 'Bangalore', type: 'PROPERTY', color: 'yellow', value: 3 },
            { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
            { id: 'money_5m', name: 'Cash', type: 'MONEY', value: 5 },
            { id: 'deal_breaker', name: 'Deal Breaker', type: 'ACTION', value: 5 },
        ],
        discardPile: [],
        players: {
            '0': {
                hand: [
                    { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
                    { id: 'red_fort', name: 'Red Fort', type: 'PROPERTY', color: 'red', value: 3 },
                    { id: 'money_2m', name: 'Cash', type: 'MONEY', value: 2 }
                ],
                bank: [],
                properties: []
            },
            '1': {
                hand: [],
                bank: [],
                properties: []
            }
        }
    }),

    // 2. MOVES: The logic for actions
    moves: {
        playMoney: (G, ctx, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            const card = player.hand[cardIndex];
            // Move from Hand -> Bank
            player.hand.splice(cardIndex, 1);
            player.bank.push(card);
        },

        playProperty: (G, ctx, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            const card = player.hand[cardIndex];

            // Safety: Ensure properties array exists
            if (!player.properties) player.properties = [];

            // Move from Hand -> Properties
            player.hand.splice(cardIndex, 1);
            player.properties.push(card);
        },

        playAction: (G, ctx, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            const card = player.hand[cardIndex];
            // Move from Hand -> Discard
            player.hand.splice(cardIndex, 1);
            G.discardPile.push(card);
        },

        drawCard: (G, ctx) => {
            if (G.deck.length > 0) {
                const card = G.deck.pop();
                G.players[ctx.currentPlayer].hand.push(card);
            }
        },

        endTurn: (ctx) => {
            ctx.events.endTurn();
        },
    },

    // 3. TURN: Basic turn structure
    turn: {
        minMoves: 0,
        maxMoves: 3,
    },
};