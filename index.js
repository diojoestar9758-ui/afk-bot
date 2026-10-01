const mineflayer = require('mineflayer');
const express = require('express');

// Dummy HTTP server for Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('AFK Bot active!'));
app.listen(PORT, '0.0.0.0', () => console.log(`Web server listening on port ${PORT}`));

const CONFIG = {
  host: 'themellowsmp.mcsh.io',
  port: 25565,
  username: 'AFK_Bot_247',
  password: 'BotPassword123!' // Replace with the password you registered in-game
};

function startBot() {
  console.log('Connecting to server...');
  const bot = mineflayer.createBot(CONFIG);

  // Automatically log in whenever a login message appears in chat
  bot.on('messagestr', (message) => {
    console.log('[SERVER CHAT]:', message);

    const msgLower = message.toLowerCase();
    if (msgLower.includes('/login') || msgLower.includes('please log in') || msgLower.includes('type /login')) {
      console.log('>>> LOGIN PROMPT DETECTED! SENDING PASSWORD <<<');
      bot.chat(`/login ${CONFIG.password}`);
    }
  });

  bot.on('spawn', () => {
    console.log('>>> BOT JOINED SERVER SPOTS <<<');

    // Immediate backup login send
    setTimeout(() => {
      bot.chat(`/login ${CONFIG.password}`);
    }, 1000);

    // Keep-alive jump loop
    setTimeout(() => {
      setInterval(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
        }
      }, 45000);
    }, 5000);
  });

  bot.on('kicked', (reason) => console.log('>>> KICKED:', JSON.stringify(reason)));
  bot.on('end', () => setTimeout(startBot, 10000));
  bot.on('error', (err) => console.log('Bot Error:', err.message));
}

process.on('uncaughtException', (err) => {
  if (err.code !== 'EPIPE') console.error('Uncaught Exception:', err);
});

startBot();
