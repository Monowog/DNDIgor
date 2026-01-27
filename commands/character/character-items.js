const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('character-items').setDescription("Replies with a list of all the items in a character's inventory.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character who you want to list the items of")
      .setRequired(true)
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    const stmt = db.prepare('SELECT * FROM character_items WHERE char_id = ?');
    const itemList = stmt.all(charID);
    
    if (itemList.length === 0) {
      output = charName + " doesn't have any items in their inventory.";
    } else {
      output = charName + " has";
      for(let i = 0; i < itemList.length; i++){
        const itemRow = db.prepare('SELECT name FROM items WHERE item_id = ?').get(itemList[i].item_id);
        output += " " + itemList[i].quantity + " " + itemRow.name;
        if(itemList[i].quantity > 1) output += "s"; //formatting
        if(!(i === itemList.length-1) && itemList.length > 2) output += ",";
        if(i === itemList.length-2) output += " and";
      }
      output += ".";
    }
		await interaction.reply(output);
	},
};