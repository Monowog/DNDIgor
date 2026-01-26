const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('take-item').setDescription('Takes one or a specified number of an item from a character.')
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The character's name")
      .setRequired(true)
  )
  .addStringOption( (option) =>
    option
      .setName("item")
      .setDescription("The item's name")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("quantity")
      .setDescription("The number of items to take")
  ),
	async execute(interaction) {
    let output = "";
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);
    let itemName = interaction.options.getString("item", true);
    let quantity = interaction.options.getInteger("quantity") ?? 1;

    if (quantity < 0) { //quantity was negative
      output = "Error: quantity can't be negative.";
    } else { //good input
      let charID = utils.getID(db, "characters", "char_id", charName); 
      let itemID = utils.getID(db, "items", "item_id", itemName)
      if(itemID < 0){
        output = "Error: No item named " + itemName + " found.";
      }
      if(charID < 0){
        output = "Error: No character named " + charName + " found.";
      }
      if(charID > 0 && itemID > 0) {
        const itemRow = db.prepare('SELECT ci_id FROM character_items WHERE char_id = ? AND item_id = ?;').get(charID, itemID);

        if(itemRow) { //item already exists in inventory
          const inventory = db.prepare('SELECT quantity FROM character_items WHERE ci_id = ?;').get(itemRow.ci_id);

          let total = inventory.quantity;
          total -= quantity;

          if(total > 0){
            const updateStmt = db.prepare('UPDATE character_items SET quantity = ? WHERE ci_id = ?;');
            updateStmt.run(total, itemRow.ci_id);

            output = charName + " now has " + total + " " + itemName;
            if(total > 1) output += "s";
            output += " in their inventory.";
          } else {
            const deleteStmt = db.prepare('DELETE FROM character_items WHERE ci_id = ?;');
            deleteStmt.run(itemRow.ci_id);

            output = charName + " only had " + inventory.quantity + " " + itemName;
            if(inventory.quantity > 1) output += "s";
            output += " in their inventory, and now has none left.";
          }
        } else { //none in inventory
          output = "Error: " + charName + " didn't have any " + itemName + "s.";
        }
      }
    }
    
		await interaction.reply(output);
	},
};