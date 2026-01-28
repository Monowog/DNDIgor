const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('leave-group').setDescription("Removes a character from a group.")
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

      if(groupRow) { //character's in the group
        const deleteStmt = db.prepare('DELETE FROM character_groups WHERE cg_id = ?;');
        deleteStmt.run(groupRow.cg_id);
        output += charName + " is no longer in " + groupName + ".";
      } else { //not in group
        output = "Error: " + charName + " already isn't in " + groupName + ".";
      }
    }

		await interaction.reply(output);
	},
};