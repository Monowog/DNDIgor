const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-items').setDescription('Replies with a list of the complete item pool.'),
	async execute(interaction) {
    const output = utils.list(interaction.client.db, "items");
		await interaction.reply(output);
	},
};