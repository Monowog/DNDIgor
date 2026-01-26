const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!').addIntegerOption((option) => 
    option
      .setName('input')
      .setDescription('The emphasis of the greeting')
      .setRequired(true)
  ),
	async execute(interaction) {
		await interaction.reply('Pong! ' + interaction.options.getInteger('input', true));
	},
};