// server/server.js

// 1. Use 'import' instead of 'require'
// We point directly to the ESM (EcmaScript Module) file
import { Server, Origins } from 'boardgame.io/dist/esm/server.js';
import { DhandhoGame } from './Game.js'; // <--- IMPORTANT: You MUST add '.js' at the end

const server = Server({
    games: [DhandhoGame],
    origins: [
        Origins.LOCALHOST,
        'https://dhandho-v2.vercel.app', // Your Vercel URL
        '*'
    ],
});

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});