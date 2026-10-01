const mineflayer = require('mineflayer');
const express = require('express');

// Dummy HTTP server for Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('AFK Bot is running!'));
app.listen(PORT, '0.0.0.0', () => console.log(`Web server listening on port ${PORT}`));

const CONFIG = {
  host: 'themellowsmp.mcsh.io',
  port: 25565,
  username: 'AFK_Bot_247',
  password: 'BotPassword123!',
  version: '1.21.1'
};

function startBot() {
  console.log('Connecting to Minecraft server...');
  const bot = mineflayer.createBot(CONFIG);

  // Trigger login ONLY when fully spawned in the world
  bot.on('spawn', () => {
    console.log('>>> BOT SPAWNED IN LOBBY/WORLD <<<');

    // Wait 2 seconds for the server/plugin chat listener to be ready
    setTimeout(() => {
      console.log('>>> SENDING LOGIN COMMAND <<<');
      bot.chat(`/login ${CONFIG.password}`);
    }, 2000);

    // Keep-alive jump loop
    setTimeout(() => {
      setInterval(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
        }
      }, 45000);
    }, 10000);
  });

  // Log all server chat to see what AuthMe/nLogin says
  bot.on('messagestr', (message) => {
    console.log('[SERVER CHAT]:', message);
  });

  bot.on('kicked', (reason) => {
    console.log('>>> KICKED REASON:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    console.log('Disconnected from server. Retrying in 10s...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => console.log('Bot Error:', err.message));
}

process.on('uncaughtException', (err) => {
  if (err.code !== 'EPIPE') console.error('Uncaught Exception:', err);
});

startBot();
