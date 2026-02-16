// client/src/Game.js

export const DhandhoGame = {
    name: 'dhandho',

    setup: (ctx) => ({
        deck: [
            { id: 'mumbai', name: 'Mumbai', type: 'PROPERTY', color: 'green', value: 4 },
            { id: 'delhi', name: 'Delhi', type: 'PROPERTY', color: 'red', value: 3 },
            { id: 'indranagar', name: 'Indranagar', type: 'PROPERTY', color: 'blue', value: 4 },
            { id: 'money_5m', name: 'Cash', type: 'MONEY', value: 5 },
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
        playMoney: (G, ctx, cardIndex) => {
            console.log("--- DEBUG playMoney ---");
            console.log("Arg 1 (G):", G);
            console.log("Arg 2 (ctx):", ctx);
            console.log("Arg 3 (cardIndex):", cardIndex);

            if (!G) { console.error("G is missing!"); return; }
            if (!ctx) { console.error("CTX is missing!"); return; }

            const player = G.players[ctx.currentPlayer];
            const card = player.hand[cardIndex];

            // Initialize if missing
            if (!player.bank) player.bank = [];

            player.hand.splice(cardIndex, 1);
            player.bank.push(card);
        },

        playProperty: (G, ctx, cardIndex) => {
            console.log("--- DEBUG playProperty ---");
            console.log("Arg 1 (G):", G);
            console.log("Arg 2 (ctx):", ctx);
            console.log("Arg 3 (cardIndex):", cardIndex);

            // --- CRITICAL FIX ATTEMPT ---
            // Sometimes frameworks pass (G, ctx) and sometimes (ctx) is merged?
            // We will check if 'ctx' is actually inside 'G' or if arguments are shifted.

            let safeCtx = ctx;
            let safeG = G;

            // Check if G is actually the context (Argument Shift)
            if (G && G.currentPlayer && !ctx) {
                console.warn("⚠️ Arguments seem shifted! G is acting as CTX.");
                safeCtx = G;
                safeG = undefined; // This would be bad
            }

            if (!safeCtx) {
                console.error("⛔ CTX IS DEAD. Cannot proceed.");
                return;
            }

            const playerID = safeCtx.currentPlayer;
            const player = safeG.players[playerID];

            if (!player) { console.error("Player not found for ID:", playerID); return; }

            // SAFETY: Check card
            if (cardIndex === undefined || cardIndex === null) {
                console.error("Card Index is missing!");
                return;
            }

            const card = player.hand[cardIndex];
            if (!card) {
                console.error("Card is undefined at index:", cardIndex);
                return;
            }

            // EXECUTE
            if (!player.properties) player.properties = [];
            player.hand.splice(cardIndex, 1);
            player.properties.push(card);
            console.log("✅ Moved card to Property Zone");
        },

        playAction: (G, ctx, cardIndex) => {
            const player = G.players[ctx.currentPlayer];
            const card = player.hand[cardIndex];
            player.hand.splice(cardIndex, 1);
            G.discardPile.push(card);
        },

        drawCard: (G, ctx) => {
            const card = G.deck.pop();
            G.players[ctx.currentPlayer].hand.push(card);
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