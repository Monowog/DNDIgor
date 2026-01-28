const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('toggle-ready').setDescription("Readies or unreadies a character's known spell.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character in question")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("spell")
      .setDescription("The spell in question")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let spellName = interaction.options.getString("spell", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    let spellID = utils.getID(db, "spells", "spell_id", spellName);
    if(spellID < 0){
      output = "Error: No spells named " + spellName + " found.";
    }
    if(charID < 0){
      output = "Error: No characters named " + charName + " found.";
    }
    if(charID > 0 && spellID > 0) {
      const spellRow = db.prepare('SELECT ready FROM character_spells WHERE char_id = ? AND spell_id = ?;').get(charID, spellID);

      if(spellRow) { //spell is known
        let rdy = spellRow.ready;
        let ready = (rdy) ? 0 : 1;

        const updateStmt = db.prepare(`UPDATE character_spells SET ready = ? WHERE (spell_id = ? AND char_id = ?);`);
        updateStmt.run(ready, spellID, charID);
        if(ready){
          output = charName + " now has " + spellName + " at the ready!";
        } else {
          output = charName + " no longer has " + spellName + " at the ready.";
        }
      } else { 
        output = "Error: " + charName + " doesn't know " + spellName + ".";
      }
    }
    
		await interaction.reply(output);
	},
};