const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delete-character').setDescription('Removes a character from the party.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The character's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "characters";
    let idType = "char_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){ //character found
      output = "Goodbye, " + elemName + "!";
      const charStmt = db.prepare('DELETE FROM characters WHERE char_id = ?'); 
      const statStmt = db.prepare('DELETE FROM stats WHERE char_id = ?'); 
      const itemStmt = db.prepare('DELETE FROM character_items WHERE char_id = ?');
      const weaponStmt = db.prepare('DELETE FROM character_weapons WHERE char_id = ?'); 
      const spellStmt = db.prepare('DELETE FROM character_spells WHERE char_id = ?'); 

      charStmt.run(id);
      statStmt.run(id);
      itemStmt.run(id);
      weaponStmt.run(id);
      spellStmt.run(id);
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};