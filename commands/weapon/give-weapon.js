const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('give-weapon').setDescription("Adds a weapon to a character's inventory.")
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The recipient's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("weapon")
      .setDescription("The weapon's name")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("mastery")
      .setDescription("Whether or not the character has mastered the weapon")
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let weaponName = interaction.options.getString("weapon", true);
    let mstry = interaction.options.getBoolean("mastery") ?? false;

    let mastery = (mstry) ? 1 : 0; //convert bool to int

    let charID = utils.getID(db, "characters", "char_id", charName); 
    let weaponID = utils.getID(db, "weapons", "weapon_id", weaponName);
    if(weaponID < 0){
      output = "Error: No weapon named " + weaponName + " found.";
    }
    if(charID < 0){
      output = "Error: No character named " + charName + " found.";
    }
    if(charID > 0 && weaponID > 0) {
      const weaponRow = db.prepare('SELECT cw_id FROM character_weapons WHERE char_id = ? AND weapon_id = ?;').get(charID, weaponID);

      if(weaponRow) { //weapon already exists in inventory
        output = "Error: " + charName + " already has a " + weaponName + ".";
      } else { //just give the weapon
        let giveStmt = db.prepare('INSERT INTO character_weapons(char_id, weapon_id, mastery) VALUES (?,?,?);');
        giveStmt.run(charID, weaponID, mastery);
        output = charName + " now has a " + weaponName;
        if(mastery) output += " and has mastered it";
        output += "!";
      }
    }
  
		await interaction.reply(output);
	},
}