const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('toggle-mastery').setDescription("Changes mastery status of a character's weapon.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character in question")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("weapon")
      .setDescription("The weapon in question")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let weaponName = interaction.options.getString("weapon", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    let weaponID = utils.getID(db, "weapons", "weapon_id", weaponName);
    if(weaponID < 0){
      output = "Error: No weapons named " + weaponName + " found.";
    }
    if(charID < 0){
      output = "Error: No characters named " + charName + " found.";
    }
    if(charID > 0 && weaponID > 0) {
      const weaponRow = db.prepare('SELECT mastery FROM character_weapons WHERE char_id = ? AND weapon_id = ?;').get(charID, weaponID);

      if(weaponRow) { //weapon is known
        let mstry = weaponRow.mastery;
        let mastery = (mstry) ? 0 : 1;

        const updateStmt = db.prepare(`UPDATE character_weapons SET mastery = ? WHERE (weapon_id = ? AND char_id = ?);`);
        updateStmt.run(mastery, weaponID, charID);
        if(mastery){
          output = charName + " has now mastered the " + weaponName + "!";
        } else {
          output = charName + " has no longer mastered the " + weaponName + ".";
        }
      } else { 
        output = "Error: " + charName + " doesn't have a " + weaponName + ".";
      }
    }
    
		await interaction.reply(output);
	},
};