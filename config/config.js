const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for the bot to function in servers
    GatewayIntentBits.GuildMessages, // Required to receive messages in channels
    GatewayIntentBits.MessageContent // Required to read the content of messages 
  ]
});

module.exports = { client };