const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('group-members').setDescription("Replies with a list of a group's members.")
  .addStringOption((option) =>
    option
      .setName("group")
      .setDescription("The group who you want to list the members of")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let groupName = interaction.options.getString("group", true);

    let groupID = utils.getID(db, "groups", "group_id", groupName);
    const stmt = db.prepare('SELECT * FROM character_groups WHERE group_id = ?');
    const charList = stmt.all(groupID);
    
    if(groupID < 1) {
      output = "Error: no groups named " + groupName + " were found.";
    } else if (charList.length === 0) {
      output = groupName + " doesn't have any members.";
    } else {
      output = groupName + "'s members include";
      for(let i = 0; i < charList.length; i++){
        const charRow = db.prepare('SELECT name FROM characters WHERE char_id = ?').get(charList[i].char_id);
        output += " " + charRow.name;
        if(!(i === charList.length-1) && charList.length > 2) output += ",";
        if(i === charList.length-2) output += " and";
      }
      output += ".";
    }
		await interaction.reply(output);
	},
};