const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-spells').setDescription("Replies with a list of a character's known spells.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character who you want to list the spells of")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    const stmt = db.prepare('SELECT * FROM character_spells WHERE char_id = ?');
    const spellList = stmt.all(charID);
    
    if (spellList.length === 0) {
      output = charName + " doesn't know any spells.";
    } else {
      output = charName + " has";
      for(let i = 0; i < spellList.length; i++){
        const spellRow = db.prepare('SELECT name FROM spells WHERE spell_id = ?').get(spellList[i].spell_id);
        output += " " + spellRow.name;
        if(spellList[i].ready) output += " at the ready";
        if(!(i === spellList.length-1) && spellList.length > 2) output += ",";
        if(i === spellList.length-2) output += " and";
      }
      output += ".";
    }
		await interaction.reply(output);
	},
};