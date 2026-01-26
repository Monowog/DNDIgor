const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('wassap')
	.setDescription('Replies with a greeting')
	.addIntegerOption((option) => 
    option
      .setName('input')
      .setDescription('The emphasis of the greeting')
      .setRequired(true)
  );
  
module.exports = {
  data,
  async execute(interaction){
    let output = "WASS";
    for(let i = 0; i < interaction.options.getInteger('input', true); i++) output += "A";
    output += "P!";
    await interaction.reply(output);
  },
}