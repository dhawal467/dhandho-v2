// server/server.js

// 1. IMPORT THE "CJS" VERSION (The one Node recommended)
import boardgame from 'boardgame.io/dist/cjs/server.js';
const { Server, Origins } = boardgame;

// 2. Import your game logic
// (Ensure Game.js exports using 'export const DhandhoGame = ...')
import { DhandhoGame } from './Game.js';

const server = Server({
    games: [DhandhoGame],
    origins: [
        // Allow localhost for testing
        Origins.LOCALHOST,
        // Allow your Vercel frontend
        'https://dhandho-v2.vercel.app',
        // Allow everything else (Nuclear option to fix CORS)
        '*'
    ],
});

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});