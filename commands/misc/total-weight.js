const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('total-weight').setDescription("The total weight of a character's inventory.")
  .addStringOption((option) =>
    option
      .setName("character")
      .setDescription("The character whose inventory you'd like to check")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    let total = 0.0;
    const db = interaction.client.db;

    let charName = interaction.options.getString("character", true);

    let charID = utils.getID(db, "characters", "char_id", charName);
    if(charID > 0){
      const itemStmt = db.prepare('SELECT * FROM character_items WHERE char_id = ?');
      const itemList = itemStmt.all(charID); //get all the items in the character's inventory

      for(let i = 0; i < itemList.length; i++){
        const stmt = db.prepare('SELECT weight FROM items WHERE item_id = ?');
        const itemWeight = stmt.get(itemList[i].item_id);
        if(itemWeight.weight) total += itemWeight.weight * itemList[i].quantity; //add the total weight of all items
      }
      
      const weaponStmt = db.prepare('SELECT * FROM character_weapons WHERE char_id = ?');
      const weaponList = weaponStmt.all(charID);

      for(let i = 0; i < weaponList.length; i++){
        const stmt = db.prepare('SELECT weight FROM weapons WHERE weapon_id = ?');
        const weaponWeight = stmt.get(weaponList[i].weapon_id);
        if(weaponWeight.weight) total += weaponWeight.weight; //add the total weight of all weapons
      }

      output += charName + " is carrying a total of " + total + "lbs in their inventory.";
    } else {
      output += "no characters named " + charName + " found.";
    }

		await interaction.reply(output);
	},
};