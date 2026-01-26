const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-characters').setDescription('Replies with a list of all party members.'),
	async execute(interaction) {
    let output = utils.list(interaction.client.db, "characters");
		await interaction.reply(output);
	},
};