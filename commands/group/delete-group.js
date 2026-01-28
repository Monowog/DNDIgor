const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delete-group').setDescription("Removes a group from the group list.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The group's title")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "groups";
    let idType = "group_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){ //group found
      output = elemName + " has been removed from the group list.";

      const stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${idType} = ?`); 
      const groupStmt = db.prepare(`DELETE FROM character_groups WHERE group_id = ?`);

      stmt.run(id);
      groupStmt.run(id);
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};