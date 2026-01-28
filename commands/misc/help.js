const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Replies with a link to the full list of commands and their descriptions.'),
	async execute(interaction) {
    let output = "https://github.com/Monowog/DNDIgor";
		await interaction.reply(output);
	},
};