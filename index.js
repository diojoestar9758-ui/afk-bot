const mineflayer = require('mineflayer');

const CONFIG = {
  host: 'themellowsmp.mcsh.io',
  port: 25565,
  username: 'AFK_Bot_247',
  password: 'BotPassword123!', // The password for /register and /login
  version: '1.20.1'           // Set a fixed base version for ViaVersion
};

function startBot() {
  const bot = mineflayer.createBot(CONFIG);

  // Triggered when the bot fully joins the world
  bot.on('spawn', () => {
    console.log('>>> BOT CONNECTED TO SERVER <<<');

    // Wait 2 seconds for the login prompt to appear, then attempt auth commands
    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
      bot.chat(`/login ${CONFIG.password}`);
    }, 2000);

    // Jump every 45 seconds to keep anti-AFK plugins from kicking
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 45000);
  });

  // Prints the exact server message if the bot gets kicked
  bot.on('kicked', (reason) => {
    console.log('>>> KICKED BY SERVER:', JSON.stringify(reason));
  });

  // Reconnect automatically if the connection drops
  bot.on('end', () => {
    console.log('Disconnected from server. Retrying in 10s...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => console.log('Bot Error:', err));
}

startBot();
