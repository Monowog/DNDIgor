const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('join-group').setDescription("Adds a character to a group.")
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The character's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("group")
      .setDescription("The group's name")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let groupName = interaction.options.getString("group", true);

    let charID = utils.getID(db, "characters", "char_id", charName); 
    let groupID = utils.getID(db, "groups", "group_id", groupName);
    if(groupID < 0){
      output = "Error: No groups named " + groupName + " found.";
    }
    if(charID < 0){
      output = "Error: No characters named " + charName + " found.";
    }
    if(charID > 0 && groupID > 0) {
      const groupRow = db.prepare('SELECT cg_id FROM character_groups WHERE char_id = ? AND group_id = ?;').get(charID, groupID);

      if(groupRow) { //character already in group
        output = "Error: " + charName + " is already in " + groupName + ".";
      } else { //let them in
        let giveStmt = db.prepare('INSERT INTO character_groups(char_id, group_id) VALUES (?,?);');
        giveStmt.run(charID, groupID);
        output = charName + " is now in " + groupName + "!";
      }
    }
  
		await interaction.reply(output);
	},
}