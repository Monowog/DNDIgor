const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-info').setDescription('Replies with a description of a party member.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("Your character's name")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "characters";
    let idType = "char_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let id = utils.getID(db, tableName, idType, elemName);
    if (id > 0){
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
      values = utils.getNonNullValues(row);

      let opening = false;
      output = values.name;
      if(values.level || values.race || values.class){ 
        output += " is a";
        opening = true;
      }
      //figure out the grammar of the output string
      if(values.level) output += " level " + values.level;
      if(values.race) output += " " + values.race;
      if(values.class) output += " " + values.class;
      if(opening && (values.height || values.weight || values.age)) output += " who";
      if(values.height || values.weight || values.age) output += " is";
      if(values.height) output += " " + values.height;
      if(values.height && (values.height || values.weight)) output += ",";
      if(values.weight) output += " " + values.weight + "lbs";
      if(values.age && (values.height || values.weight)) output += " and";
      if(values.age) output += " " + values.age + " years old";
      output += ".";
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
		await interaction.reply(output);
	},
};