const mineflayer = require('mineflayer');
const express = require('express');

// Dummy HTTP server to satisfy Render's port check
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('AFK Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// Minecraft Bot Configuration
const CONFIG = {
  host: 'themellowsmp.mcsh.io',
  port: 25565,
  username: 'AFK_Bot_247',
  password: 'BotPassword123!',
  version: '1.20.1'
};

function startBot() {
  const bot = mineflayer.createBot(CONFIG);

  bot.on('spawn', () => {
    console.log('>>> BOT CONNECTED TO SERVER <<<');

    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
      bot.chat(`/login ${CONFIG.password}`);
    }, 2000);

    setTimeout(() => {
      setInterval(() => {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }, 45000);
    }, 10000);
  });

  bot.on('kicked', (reason) => {
    console.log('>>> KICKED BY SERVER:', JSON.stringify(reason));
  });

  bot.on('end', () => {
    console.log('Disconnected from server. Retrying in 10s...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => console.log('Bot Error:', err));
}

startBot();
