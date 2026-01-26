const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('item-info').setDescription('Replies with a description of an item.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The item's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "items";
    let idType = "item_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(row);

      numInfo = Object.keys(values).length-2;
      
      if(numInfo>0) output += values.name + " is"; //figure out the grammar of the output string
      if(values.rarity) {output += " " + values.rarity; numInfo -= 1;}
      if(values.rarity && numInfo > 1) {output += ",";}
      if(values.weight) {output += " weighs " + values.weight + "lbs"; numInfo -= 1;}
      if(values.weight && numInfo > 1) {output += ",";}
      if(values.weight && numInfo === 1) output += " and";
      if(values.cost){output += " its cost is " + values.cost; numInfo -= 1;}
      if(numInfo > 0 && values.cost) output += " and";
      if(values.description) output += " its description is '" + values.description + "'";

      if(output === "") output = values.name + " doesn't have any information yet";
      output += ".";
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }

		await interaction.reply(output);
	},
};