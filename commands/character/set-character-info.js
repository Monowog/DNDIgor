const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('set-character-info').setDescription('Changes the characteristics of a party member.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The changing character's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("level")
      .setDescription("The character's level")
  )
  .addStringOption((option) => 
    option
      .setName("race")
      .setDescription("The character's race")
  )
  .addStringOption((option) => 
    option
      .setName("class")
      .setDescription("The character's class")
  )
  .addNumberOption((option) => 
    option
      .setName("weight")
      .setDescription("The character's weight in pounds")
  )
  .addStringOption((option) => 
    option
      .setName("height")
      .setDescription("The character's height (ex. 5'6\")")
  )
  .addIntegerOption((option) => 
    option
      .setName("age")
      .setDescription("The character's age")
  ),
  async execute(interaction) {
    let output = "";
    let tableName = "characters";
    let idType = "char_id";
    const db = interaction.client.db;

    let charName = interaction.options.getString('name', true);
    let level = interaction.options.getInteger('level');
    let race = interaction.options.getString('race');
    let charClass = interaction.options.getString('class');
    let weight = interaction.options.getNumber('weight');
    let height = interaction.options.getString('height');
    let age = interaction.options.getInteger('age');

    const id = utils.getID(db, tableName, idType, charName);
    
    if(id > 0) {

      let isFirst = true;
      if(level){
        output += utils.setInfo(db, tableName, idType, charName, "level", level, isFirst);
        isFirst = false;
      }
      if(race){
        output += utils.setInfo(db, tableName, idType, charName, "race", race, isFirst);
        isFirst = false;
      }
      if(charClass){
        output += utils.setInfo(db, tableName, idType, charName, "class", charClass, isFirst);
        isFirst = false;
      }
      if(weight){
        output += utils.setInfo(db, tableName, idType, charName, "weight", weight, isFirst);
        isFirst = false;
      }
      if(height){
        output += utils.setInfo(db, tableName, idType, charName, "height", height, isFirst);
        isFirst = false;
      }
      if(age){
        output += utils.setInfo(db, tableName, idType, charName, "age", age, isFirst);
      }

      if(output === "") output += "Error: no information input"
      output += "."
    } else {
      output = "Error: no character named " + charName + " found.";
    }

    await interaction.reply(output);
  },
};