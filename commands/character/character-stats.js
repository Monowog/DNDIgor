const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-stats').setDescription("Replies with a party member's statistics.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The character who you want to list the stats of")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "stats";
    let idType = "char_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, "characters", idType, elemName);
    if (id > 0){
      const data = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(data);

      numStats = Object.keys(values).length-2;

      if(numStats === 0) {
        output += elemName + " hasn't input any stats yet.";
      } else {
        output += elemName + " has";
        
        //figure out the grammar of the output string
        let temp = "";
        [temp, numStats] = utils.statFormat(values.hp, "HP", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.max_hp, "Max HP", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.str, "Str", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.dex, "Dex", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.con, "Con", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.int, "Int", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.wis, "Wis", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.cha, "Cha", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.speed, "Speed", numStats);
        output += temp;
        
        output += ".";
      }
    } else {
      output = `Error: No characters named ` + elemName + " were found.";
    }
		await interaction.reply(output);
	},
};