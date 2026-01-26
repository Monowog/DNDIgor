const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('take-spell').setDescription("Removes a spell from a character's known spells.")
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The character's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("spell")
      .setDescription("The spell's name")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let spellName = interaction.options.getString("spell", true);

    let charID = utils.getID(db, "characters", "char_id", charName); 
    let spellID = utils.getID(db, "spells", "spell_id", spellName);
    if(spellID < 0){
      output = "Error: No spell named " + spellName + " found.";
    }
    if(charID < 0){
      output = "Error: No character named " + charName + " found.";
    }
    if(charID > 0 && spellID > 0) {
      const spellRow = db.prepare('SELECT cs_id FROM character_spells WHERE char_id = ? AND spell_id = ?;').get(charID, spellID);

      if(spellRow) { //spell exists in known spells
        const deleteStmt = db.prepare('DELETE FROM character_spells WHERE cs_id = ?;');
        deleteStmt.run(spellRow.cs_id);
        output += charName + " has forgotten " + spellName + ".";
      } else { //not known
        output = "Error: " + charName + " already didn't know " + spellName + ".";
      }
    }
  
		await interaction.reply(output);
	},
};