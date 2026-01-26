const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('list-characters').setDescription('Replies with a list of all party members.'),
	async execute(interaction) {
    let output = "";
    const stmt = interaction.client.db.prepare('SELECT name FROM characters');
    const charList = stmt.all();
    
    for (let i = 0; i < charList.length; i++){
      output += "'" + charList[i].name + "'";
      if (i !== charList.length-1){
        output += ", ";
      }
    }

    if(output === "") output = "There are currently no characters in the party.";
		await interaction.reply(output);
	},
};