const mineflayer = require('mineflayer');

function startBot() {
  const bot = mineflayer.createBot({
    host: 'themellowsmp.mcsh.io', // Added quotes and a comma
    port: 25565,
    username: 'AFK_Bot_247',
    version: false
  });

  bot.on('spawn', () => {
    console.log('>>> BOT CONNECTED! SERVER IS AWAKE <<<');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 45000);
  });

  bot.on('end', () => {
    console.log('Disconnected. Retrying in 10s...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => console.log('Error:', err));
}

startBot();
