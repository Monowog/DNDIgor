const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('weapon-info').setDescription('Replies with a description of a weapon.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The weapon's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "weapons";
    let idType = "weapon_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(row);

      numInfo = Object.keys(values).length-2;
      
      if(numInfo > 0) output = values.name + "'s"; //figure out the grammar of the output string
      if(values.damage){output += " damage is " + values.damage; 
        numInfo -= 1;
        if(numInfo > 1) output += ",";
        if(numInfo === 1) output += " and";
      }
      if(values.range) {output += " range is " + values.range; 
        numInfo -= 1;
        if(numInfo > 1) output += ",";
        if(numInfo === 1) output += " and";
      }
      if(values.weight) {output += " weight is " + values.weight + "lbs"; 
        numInfo -= 1;
        if(numInfo > 1) output += ",";
        if(numInfo === 1) output += " and";
      }
      if(values.rarity) {output += " rarity is " + values.rarity; 
        numInfo -= 1;
        if(numInfo === 1) output += " and";
      }
      if(values.description) output += " description is '" + values.description + "'";

      if(output === "") output = values.name + " doesn't have any information yet";
      output += ".";
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }

		await interaction.reply(output);
	},
};