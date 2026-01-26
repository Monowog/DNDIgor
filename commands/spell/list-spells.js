const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-spells').setDescription('Replies with the complete spell list.'),
	async execute(interaction) {
    let output = utils.list(interaction.client.db, "spells");
		await interaction.reply(output);
	},
};