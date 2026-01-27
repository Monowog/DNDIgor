const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('take-weapon').setDescription("Removes a weapon from a character's inventory.")
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The character's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("weapon")
      .setDescription("The weapon's name")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let weaponName = interaction.options.getString("weapon", true);

    let charID = utils.getID(db, "characters", "char_id", charName); 
    let weaponID = utils.getID(db, "weapons", "weapon_id", weaponName);
    if(weaponID < 0){
      output = "Error: No weapon named " + spellName + " found.";
    }
    if(charID < 0){
      output = "Error: No character named " + charName + " found.";
    }
    if(charID > 0 && weaponID > 0) {
      const weaponRow = db.prepare('SELECT cw_id FROM character_weapons WHERE char_id = ? AND weapon_id = ?;').get(charID, weaponID);

      if(weaponRow) { //weapon exists in inventory
        const deleteStmt = db.prepare('DELETE FROM character_weapons WHERE cw_id = ?;');
        deleteStmt.run(weaponRow.cw_id);
        output += charName + " no longer has a " + weaponName + ".";
      } else { //not owned
        output = "Error: " + charName + " already didn't have a " + weaponName + ".";
      }
    }
  
		await interaction.reply(output);
	},
};