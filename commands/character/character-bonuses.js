const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-bonuses').setDescription("Replies with a party member's bonuses.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The character who you want to list the bonuses of")
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
      const data = db.prepare(`SELECT str_bonus, dex_bonus, con_bonus, int_bonus, wis_bonus, cha_bonus FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(data);

      numStats = Object.keys(values).length-2;

      if(numStats === 0) {
        output += elemName + " doesn't have any bonuses.";
      } else {
        output += elemName + " has";
        
        //figure out the grammar of the output string
        let temp = "";
        [temp, numStats] = utils.statFormat(values.str_bonus, "bonus Str", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.dex_bonus, "bonus Dex", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.con_bonus, "bonus Con", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.int_bonus, "bonus Int", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.wis_bonus, "bonus Wis", numStats);
        output += temp;
        [temp, numStats] = utils.statFormat(values.cha_bonus, "bonus Cha", numStats);
        output += temp;
        
        output += ".";
      }
    } else {
      output = `Error: No characters named ` + elemName + " were found.";
    }
		await interaction.reply(output);
	},
};