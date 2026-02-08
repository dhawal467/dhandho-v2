const { Server, Origins } = require('boardgame.io/server');
const { DhandhoGame } = require('./Game');

const server = Server({
    games: [DhandhoGame],
    // This allows connection from ANYWHERE (Vercel, Localhost, etc.)
    // We use this for the initial test to prevent CORS errors.
    origins: [Origins.LOCALHOST, 'https://dhandho-v2.vercel.app', '*'],
});

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});