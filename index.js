const mineflayer = require('mineflayer');
const express = require('express');

// 1. DUMMY WEB SERVER (Fixes Render Port Scan Timeout)
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('Bot is active!'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Render Web Server listening on port ${PORT}`);
});

// 2. MINECRAFT BOT CONFIGURATION
const CONFIG = {
  host: 'themellowsmp.mcsh.io',
  port: 25565,
  username: 'AFK_Bot_247',
  password: 'BotPassword123!',
  checkTimeoutInterval: 60000,
  hideErrors: false
};

function startBot() {
  console.log('Connecting to Minecraft server...');
  const bot = mineflayer.createBot(CONFIG);

  bot.on('spawn', () => {
    console.log('>>> BOT CONNECTED! SERVER IS AWAKE <<<');

    // Authentication delay
    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
      bot.chat(`/login ${CONFIG.password}`);
    }, 3000);

    // Anti-AFK jump timer
    setTimeout(() => {
      setInterval(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
        }
      }, 45000);
    }, 10000);
  });

  // Catch kicking messages
  bot.on('kicked', (reason) => {
    console.log('>>> KICKED BY SERVER:', JSON.stringify(reason));
  });

  // Handle connection drops without crashing Node
  bot.on('end', (reason) => {
    console.log('Disconnected from server:', reason, 'Retrying in 15s...');
    setTimeout(startBot, 15000);
  });

  // Suppress uncaught stream errors (Fixes EPIPE crash)
  bot.on('error', (err) => {
    console.log('Mineflayer connection error:', err.message);
  });
}

// Catch socket/stream-level crashes globally so Render doesn't restart
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE') {
    console.log('Caught EPIPE write error (server closed pipe). Reconnecting...');
  } else {
    console.error('Uncaught Exception:', err);
  }
});

startBot();
