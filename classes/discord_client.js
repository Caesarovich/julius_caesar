// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('error', (err) => {
  console.log(`[Discord Client] Error: ${err}`);
});

client.on('reconnecting', () => {
  console.log('[Discord Client] Reconnecting...');
});

client.on('resume', (replayed) => {
  console.log(`[Discord Client] WS connection resumed: ${replayed}`);
});

client.on('disconnect', (closeEv) => {
  console.log('[Discord Client] Disconnect:');
  console.log('A disconnect was emitted:');
  console.log('Clean: ' + closeEv.wasClean);
  console.log('Code: ' + closeEv.code);
  console.log('Reason: ' + closeEv.reason);
});


module.exports = client;