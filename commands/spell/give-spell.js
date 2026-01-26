const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('give-spell').setDescription("Adds a spell to a character's known spells.")
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The recipient's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("spell")
      .setDescription("The spell's name")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("ready")
      .setDescription("Whether or not the spell is prepared to be cast")
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let spellName = interaction.options.getString("spell", true);
    let rdy = interaction.options.getBoolean("ready") ?? false;

    let ready = (rdy) ? 1 : 0; //convert bool to int

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

      if(spellRow) { //spell already exists in known spells
        output = "Error: " + charName + " already knows " + spellName + ".";
      } else { //just give the spell
        let giveStmt = db.prepare('INSERT INTO character_spells(char_id, spell_id, ready) VALUES (?,?,?);');
        giveStmt.run(charID, spellID, ready);
        output = charName + " now knows " + spellName;
        if(ready) output += " and has it at the ready";
        output += "!";
      }
    }
  
		await interaction.reply(output);
	},
};