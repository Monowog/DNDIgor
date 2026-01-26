const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-character').setDescription('Adds a character to the party.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("Your character's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("level")
      .setDescription("Your character's level")
      .setRequired(true)
  )
  .addStringOption((option) => 
    option
      .setName("race")
      .setDescription("Your character's race")
  )
  .addStringOption((option) => 
    option
      .setName("class")
      .setDescription("Your character's class")
  )
  .addNumberOption((option) => 
    option
      .setName("weight")
      .setDescription("Your character's weight in pounds")
  )
  .addStringOption((option) => 
    option
      .setName("height")
      .setDescription("Your character's height (ex. 5'6\")")
  )
  .addIntegerOption((option) => 
    option
      .setName("age")
      .setDescription("Your character's age")
  ),
	async execute(interaction) {
    let output = "";
    let tableName = "characters";
    let idType = "char_id";
    const db = interaction.client.db;

    let charName = interaction.options.getString('name', true);
    let level = interaction.options.getInteger('level', true);
    let race = interaction.options.getString('race');
    let charClass = interaction.options.getString('class');
    let weight = interaction.options.getNumber('weight');
    let height = interaction.options.getString('height');
    let age = interaction.options.getInteger('age');

    const charStmt = db.prepare(`INSERT INTO ${tableName} (name, level) VALUES (?,?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = charStmt.run(charName,level);
    
    if(info.changes > 0) {
      output = "Welcome to the party, " + charName + "! ";

      let isFirst = true;
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

      if(race||charClass||weight||height||age) output += ".";
    } else {
      output = utils.setInfo(interaction.client.db, "characters", "char_id", charName, "name", charName, true);
    }

		await interaction.reply(output);
	},
};