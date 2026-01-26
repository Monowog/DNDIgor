const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('set-character-info').setDescription('Modifies the non-stat values of a character.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The name of the changing character")
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
    let output = "" + utils;
		await interaction.reply(output);
	},
};