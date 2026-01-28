const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('spell-info').setDescription('Replies with a description of a spell.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The spell's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "spells";
    let idType = "spell_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(row);

      numInfo = Object.keys(values).length-2;
      
      if(numInfo > 0) output = values.name; //figure out the grammar of the output string
      if(values.level && values.type) {output += " is a level " + values.level + " " + values.type + " spell"; numInfo -= 2;}
      else if(values.level) {output += " is a level " + values.level + " spell"; numInfo -= 1;}
      else if (values.type) {output += " is a " + values.type + " spell"; numInfo -= 1;}
      if((values.level||values.type) && values.casting_time) output += " that";
      if(values.casting_time) output += " can be cast as a " + values.casting_time;
      if((values.level||values.type||values.casting_time) && numInfo > 0) output += ",";
      if(values.damage) {
        if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
        output += " deals " + values.damage + " damage"; numInfo -= 1;
        if(numInfo > 0) output += ",";
      }
      if(values.range) {
        if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
        output += " has a range of " + values.range; numInfo -= 1;
        if(numInfo > 0) output += ",";
      }
      if(values.duration) {
        if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
        output += " has a duration of " + values.duration; numInfo -= 1;
        if(numInfo > 0) output += ",";
      }
      if(values.components) {
        if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
        output += " requires " + values.components + " to cast"; numInfo -= 1;
        if(numInfo > 0) output += ",";
      }
      if(values.description) {
        if((Object.keys(values).length-2) > 1) output += " and";
        output += " has the description '" + values.description + "'";
      }

      if(output === "") output = values.name + " doesn't have any information yet";
      output += ".";
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }

		await interaction.reply(output);
	},
};