const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-weapons').setDescription('Replies with the complete weapon pool.'),
	async execute(interaction) {
    let output = utils.list(interaction.client.db, "weapons");
		await interaction.reply(output);
	},
};