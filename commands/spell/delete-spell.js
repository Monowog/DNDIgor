const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delete-spell').setDescription("Removes a spell from characters' known spells and the spell list.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The spell's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "spells";
    let idType = "spell_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){ //item found
      output = elemName + " has been removed.";

      const stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${idType} = ?`); 
      const spellStmt = db.prepare(`DELETE FROM character_spells WHERE spell_id = ?`);

      stmt.run(id);
      spellStmt.run(id);
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};