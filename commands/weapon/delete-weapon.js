const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delete-weapon').setDescription("Removes a weapon from all inventories and the weapon pool.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The weapon's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "weapons";
    let idType = "weapon_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){ //weapon found
      output = elemName + " has been removed.";

      const stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${idType} = ?`); 
      const weaponStmt = db.prepare(`DELETE FROM character_weapons WHERE weapon_id = ?`);

      stmt.run(id);
      weaponStmt.run(id);
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};