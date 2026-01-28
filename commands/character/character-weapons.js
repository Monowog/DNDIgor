const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-weapons').setDescription("Replies with a list of a character's weapons.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character who you want to list the weapons of")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    const stmt = db.prepare('SELECT * FROM character_weapons WHERE char_id = ?');
    const weaponList = stmt.all(charID);
    
    if(charID < 1) {
      output = "Error: no characters named " + charName + " were found.";
    } else if (weaponList.length === 0) {
      output = charName + " doesn't have any weapons.";
    } else {
      output = charName + " has";
      for(let i = 0; i < weaponList.length; i++){
        const weaponRow = db.prepare('SELECT name FROM weapons WHERE weapon_id = ?').get(weaponList[i].weapon_id);
        output += " a " + weaponRow.name;
        if(weaponList[i].mastery) output += " with mastery";
        if(!(i === weaponList.length-1) && weaponList.length > 2) output += ",";
        if(i === weaponList.length-2) output += " and";
      }
      output += ".";
    }
		await interaction.reply(output);
	},
};