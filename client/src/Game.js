// client/src/Game.js

export const DhandhoGame = {
    name: 'dhandho',

    setup: (ctx) => ({
        deck: [
            { id: 'mumbai', name: 'Mumbai', type: 'PROPERTY', color: 'green', value: 4 },
            { id: 'delhi', name: 'Delhi', type: 'PROPERTY', color: 'red', value: 3 },
            { id: 'bangalore', name: 'Bangalore', type: 'PROPERTY', color: 'yellow', value: 3 },
            { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
            { id: 'rickshaw', name: 'Rickshaw', type: 'PROPERTY', color: 'black', value: 2 },
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
            '1': { hand: [], bank: [], properties: [] }
        }
    }),

    moves: {
        playMoney: ({ G, ctx }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            if (!player) return;

            const originalCard = player.hand[cardIndex];
            if (!originalCard) return;

            // CLONE
            const cardCopy = { ...originalCard };

            if (!Array.isArray(player.bank)) player.bank = [];

            player.hand.splice(cardIndex, 1);
            player.bank.push(cardCopy);
            console.log(`✅ Banked: ${cardCopy.name}`);
        },

        playProperty: ({ G, ctx }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            if (!player) return;

            const originalCard = player.hand[cardIndex];
            if (!originalCard) {
                console.error("❌ Card not found at index", cardIndex);
                return;
            }

            // CLONE
            const cardCopy = { ...originalCard };

            // FORCE ARRAY
            if (!Array.isArray(player.properties)) {
                console.warn("⚠️ Fixed corrupted properties array");
                player.properties = [];
            }

            player.hand.splice(cardIndex, 1);
            player.properties.push(cardCopy);
            console.log(`✅ Built Property: ${cardCopy.name}`);
        },

        playAction: ({ G, ctx }, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            if (!player) return;

            const originalCard = player.hand[cardIndex];
            if (!originalCard) return;

            const cardCopy = { ...originalCard };

            if (!Array.isArray(G.discardPile)) G.discardPile = [];

            player.hand.splice(cardIndex, 1);
            G.discardPile.push(cardCopy);
        },

        drawCard: ({ G, ctx }) => {
            if (G.deck.length > 0) {
                const card = G.deck.pop();
                G.players[ctx.currentPlayer].hand.push(card);
            }
        },

        endTurn: ({ events }) => {
            events.endTurn();
        },
    },

    turn: {
        minMoves: 0,
        maxMoves: 3,
    },
};