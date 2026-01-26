const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delete-item').setDescription('Removes an item from inventories and the item pool.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The item's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "items";
    let idType = "item_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){ //item found
      output = elemName + " has been removed.";

      const stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${idType} = ?`); 
      const itemStmt = db.prepare(`DELETE FROM character_items WHERE char_id = ?`);

      stmt.run(id);
      itemStmt.run(id);
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};