// client/src/Game.js

export const DhandhoGame = {
    name: 'dhandho',

    setup: (ctx) => ({
        deck: [
            { id: 'mumbai', name: 'Mumbai', type: 'PROPERTY', color: 'green', value: 4 },
            { id: 'delhi', name: 'Delhi', type: 'PROPERTY', color: 'red', value: 3 },
            { id: 'bangalore', name: 'Bangalore', type: 'PROPERTY', color: 'yellow', value: 3 },
            { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
            { id: 'rickshaw', name: 'Rickshaw', type: 'PROPERTY', color: 'black', value: 2 }, // Added Rickshaw for testing
            { id: 'money_5m', name: 'Cash', type: 'MONEY', value: 5 },
            { id: 'deal_breaker', name: 'Deal Breaker', type: 'ACTION', value: 5 },
        ],
        discardPile: [],
        players: {
            '0': {
                hand: [
                    { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
                    { id: 'rickshaw', name: 'Rickshaw', type: 'PROPERTY', color: 'black', value: 2 },
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

    moves: {
        playMoney: (G, ctx, cardIndex) => {
            const playerID = ctx.currentPlayer;
            const player = G.players[playerID];

            // SAFETY 1: Check if player exists
            if (!player) { console.error("Player not found!"); return; }

            // SAFETY 2: Check if card exists
            const card = player.hand[cardIndex];
            if (!card) { console.error("Card not found at index", cardIndex); return; }

            // SAFETY 3: Initialize bank if missing
            if (!Array.isArray(player.bank)) player.bank = [];

            // EXECUTE
            player.hand.splice(cardIndex, 1);
            player.bank.push(card);
        },

        playProperty: (G, ctx, cardIndex) => {
            const playerID = ctx.currentPlayer;
            const player = G.players[playerID];

            // SAFETY 1
            if (!player) { console.error("Player not found!"); return; }

            // SAFETY 2
            const card = player.hand[cardIndex];
            if (!card) { console.error("Card not found at index", cardIndex); return; }

            // SAFETY 3: Initialize properties if missing
            if (!Array.isArray(player.properties)) player.properties = [];

            // EXECUTE
            player.hand.splice(cardIndex, 1);
            player.properties.push(card);
        },

        playAction: (G, ctx, cardIndex) => {
            const playerID = ctx.currentPlayer;
            const player = G.players[playerID];

            if (!player || !player.hand[cardIndex]) return;

            const card = player.hand[cardIndex];
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

    turn: {
        minMoves: 0,
        maxMoves: 3,
    },
};