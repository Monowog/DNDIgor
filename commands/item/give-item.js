const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('give-item').setDescription('Gives one or a specified number of an item to a character.')
  .addStringOption( (option) =>
    option
      .setName("character")
      .setDescription("The recipient's name")
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
      .setDescription("The number of items to give")
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
        output = "Error: No characters named " + charName + " were found.";
      }
      if(charID > 0 && itemID > 0) {
        const itemRow = db.prepare('SELECT ci_id FROM character_items WHERE char_id = ? AND item_id = ?;').get(charID, itemID);

        if(itemRow) { //item already exists in inventory
          const inventory = db.prepare('SELECT quantity FROM character_items WHERE ci_id = ?;').get(itemRow.ci_id);

          let total = inventory.quantity;
          total += quantity;
          let updateStmt = db.prepare('UPDATE character_items SET quantity = ? WHERE ci_id = ?;');
          updateStmt.run(total, itemRow.ci_id);

          output = charName + " now has " + total + " " + itemName;
          if(total > 1) output += "s";
          output += " in their inventory.";
        } else { //just insert quantity into inventory
          let giveStmt = db.prepare('INSERT INTO character_items(char_id, item_id, quantity) VALUES (?,?,?);');
          giveStmt.run(charID, itemID, quantity);
          output = charName + " now has " + quantity + " " + itemName;
          if(quantity > 1) output += "s";
          output += " in their inventory.";
        }
      }
    }
    
		await interaction.reply(output);
	},
};