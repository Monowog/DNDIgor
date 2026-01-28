const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-groups').setDescription('Replies with the group list.'),
	async execute(interaction) {
    let output = utils.list(interaction.client.db, "groups");
		await interaction.reply(output);
	},
};